import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def _detect_currency(symbol: str) -> str:
    """
    Detect the currency for a stock symbol based on exchange suffix.
    Indian exchanges: .NS (NSE), .BO (BSE) → INR
    Everything else defaults to USD.
    """
    s = symbol.upper()
    if s.endswith('.NS') or s.endswith('.BO'):
        return 'INR'
    return 'USD'


def _safe_float(val, default=0.0):
    """Safely convert a value to float, returning default on None/NaN."""
    try:
        f = float(val)
        return f if not np.isnan(f) else default
    except (TypeError, ValueError):
        return default


def get_stock_info(symbol, fast=False):
    """Fetch real-time stock information for any stock (US or Indian)."""
    try:
        ticker = yf.Ticker(symbol)

        # ── Step 1: full info dict (most reliable for price + metadata) ──────
        full_info = {}
        try:
            full_info = ticker.info or {}
        except Exception:
            full_info = {}

        # ── Step 2: resolve currency ─────────────────────────────────────────
        yf_currency = (
            str(full_info.get('currency', '')).upper()
            or _detect_currency(symbol)
        )
        if not yf_currency or yf_currency == 'UNKNOWN':
            yf_currency = _detect_currency(symbol)

        # ── Step 3: price — try multiple sources in order of reliability ─────
        # ticker.info keys tried: currentPrice → regularMarketPrice → previousClose
        price = _safe_float(
            full_info.get('currentPrice')
            or full_info.get('regularMarketPrice')
        )

        # Fallback: fast_info.last_price
        if price == 0:
            try:
                fast_info = ticker.fast_info
                price = _safe_float(
                    getattr(fast_info, 'last_price', None)
                )
            except Exception:
                pass

        # Last resort: most recent close from history (always works)
        if price == 0:
            try:
                hist_short = ticker.history(period="5d", interval="1d")
                if not hist_short.empty:
                    price = _safe_float(hist_short['Close'].dropna().iloc[-1])
            except Exception:
                pass

        # ── Step 4: prev close & change ──────────────────────────────────────
        prev_close = _safe_float(
            full_info.get('previousClose')
            or full_info.get('regularMarketPreviousClose')
        )
        if prev_close == 0:
            try:
                fast_info = ticker.fast_info
                prev_close = _safe_float(getattr(fast_info, 'previous_close', None))
            except Exception:
                pass

        change = price - prev_close if price and prev_close else 0
        change_percent = (change / prev_close) * 100 if prev_close else 0

        # ── Step 5: volatility & momentum (skip in fast mode) ────────────────
        volatility = 0.2
        momentum = 0
        if not fast:
            try:
                hist = ticker.history(period="1y")
                if not hist.empty:
                    returns = hist['Close'].pct_change().dropna()
                    calc_vol = returns.std() * np.sqrt(252)
                    volatility = _safe_float(calc_vol, 0.2)
                    momentum = _safe_float(
                        (hist['Close'].iloc[-1] / hist['Close'].iloc[0]) - 1
                    )
            except Exception:
                pass

        return {
            "symbol": symbol,
            "name": full_info.get("longName") or full_info.get("shortName") or symbol,
            "price": price,
            "change": round(change, 4),
            "changePercent": round(change_percent, 4),
            "volume": full_info.get("regularMarketVolume") or full_info.get("volume") or 0,
            "marketCap": full_info.get("marketCap") or 0,
            "pe_ratio": _safe_float(full_info.get("trailingPE")),
            "pe": _safe_float(full_info.get("trailingPE")),
            "sector": full_info.get("sector") or "Unknown",
            "currency": yf_currency,
            "high": _safe_float(full_info.get("dayHigh") or full_info.get("regularMarketDayHigh")),
            "low": _safe_float(full_info.get("dayLow") or full_info.get("regularMarketDayLow")),
            "dividend_yield": _safe_float(full_info.get("dividendYield")),
            "volatility": volatility,
            "beta": _safe_float(full_info.get("beta"), 1.0),
            "momentum": momentum,
            "growth_rate": _safe_float(full_info.get("earningsGrowth")),
        }
    except Exception as e:
        return {"error": str(e), "symbol": symbol}

def get_historical_data(symbol, period="1mo", interval="1d"):
    """Fetch historical price data"""
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)
        
        if df.empty:
            return {"error": f"No data found for {symbol}", "symbol": symbol}
            
        # Convert to list of dicts or standard format
        return {
            "symbol": symbol,
            "history": {
                "dates": df.index.strftime('%Y-%m-%d').tolist(),
                "open": df['Open'].tolist(),
                "high": df['High'].tolist(),
                "low": df['Low'].tolist(),
                "close": df['Close'].tolist(),
                "volume": df['Volume'].tolist()
            }
        }
    except Exception as e:
        return {"error": str(e), "symbol": symbol}

def get_trending_stocks(region="US"):
    """Fetch trending stocks efficiently by downloading batch live data avoiding IP bans.
    Includes both US and Indian popular stocks with correct currency tagging."""

    us_symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA']
    in_symbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS']
    all_symbols = us_symbols + in_symbols

    results = []

    # ---------- batch download for ALL symbols at once ----------
    try:
        # Use 5d to ensure we get at least 2 distinct days of data
        data = yf.download(all_symbols, period="5d", progress=False, group_by="ticker")

        for symbol in all_symbols:
            try:
                if len(all_symbols) > 1:
                    sym_data = data[symbol] if symbol in data.columns.get_level_values(0) else None
                else:
                    sym_data = data

                if sym_data is None or sym_data.empty:
                    continue

                # Drop NaNs and get the last two available closing prices
                series_data = sym_data['Close'].dropna()
                if len(series_data) >= 2:
                    current_price = float(series_data.iloc[-1])
                    prev_close = float(series_data.iloc[-2])
                    
                    # If prices are identical (market not moved), try one day further back
                    if current_price == prev_close and len(series_data) >= 3:
                        prev_close = float(series_data.iloc[-3])
                elif len(series_data) == 1:
                    current_price = float(series_data.iloc[-1])
                    prev_close = current_price
                else:
                    continue

                change = current_price - prev_close
                change_percent = (change / prev_close) * 100 if prev_close and prev_close != 0 else 0
                currency = _detect_currency(symbol)

                results.append({
                    "symbol": symbol,
                    "name": symbol,
                    "price": round(current_price, 2),
                    "change": round(change, 4),
                    "changePercent": round(change_percent, 4),
                    "volume": 0, "marketCap": 0, "pe_ratio": 0, "pe": 0,
                    "sector": "Popular", "currency": currency,
                    "high": 0, "low": 0, "dividend_yield": 0, "volatility": 0.2,
                    "beta": 1.0, "momentum": 0, "growth_rate": 0,
                })
            except Exception:
                continue
    except Exception:
        pass

    # ---------- enrich names via fast individual lookups ----------
    name_map = {
        'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp',
        'GOOGL': 'Alphabet Inc', 'AMZN': 'Amazon.com',
        'NVDA': 'NVIDIA Corp', 'TSLA': 'Tesla Inc',
        'RELIANCE.NS': 'Reliance Industries', 'TCS.NS': 'TCS',
        'HDFCBANK.NS': 'HDFC Bank', 'INFY.NS': 'Infosys',
        'ICICIBANK.NS': 'ICICI Bank', 'SBIN.NS': 'State Bank of India',
        'BHARTIARTL.NS': 'Bharti Airtel', 'ITC.NS': 'ITC Limited'
    }
    for r in results:
        r['name'] = name_map.get(r['symbol'], r['symbol'])

    return results
