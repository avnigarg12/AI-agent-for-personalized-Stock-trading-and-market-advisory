#!/usr/bin/env python3
"""
TradeMind AI - Main Entry Point
Handles stdin/stdout communication with Node.js backend
"""

import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from utils.logger import setup_logger

logger = setup_logger('trademind_ai')

def handle_profile_request(data):
    """Handle investor profiling request"""
    try:
        from services.profiling_service import build_investor_profile
        result = build_investor_profile(data)
        return result
    except Exception as e:
        logger.error(f"Profile request error: {e}")
        return {'success': False, 'error': str(e)}

def handle_recommendation_request(data):
    """Handle portfolio recommendation request"""
    try:
        from services.recommendation_service import generate_recommendation
        profile = data.get('profile')
        market_data = data.get('market_data')
        portfolio_value = data.get('portfolio_value', 10000)
        
        result = generate_recommendation(profile, market_data, portfolio_value)
        return result
    except Exception as e:
        logger.error(f"Recommendation request error: {e}")
        return {'success': False, 'error': str(e)}

def handle_prediction_request(data):
    """Handle stock prediction request"""
    try:
        from services.prediction_service import get_stock_prediction
        from services.market_data_service import get_historical_data
        
        prices = data.get('prices', [])
        symbol = data.get('symbol')
        
        # If symbol provided but no prices, fetch historical data first
        if symbol and not prices:
            hist = get_historical_data(symbol, period="3mo")
            if "history" in hist:
                prices = hist["history"]["close"]
        
        model_type = data.get('model_type', 'lstm')
        result = get_stock_prediction(prices, model_type)
        return {'success': True, 'prediction': result}
    except Exception as e:
        logger.error(f"Prediction request error: {e}")
        return {'success': False, 'error': str(e)}

def handle_market_data_request(data):
    """Handle market data requests"""
    try:
        from services.market_data_service import get_stock_info, get_historical_data, get_trending_stocks
        sub_action = data.get('sub_action')
        symbol = data.get('symbol')
        
        if sub_action == 'quote':
            result = get_stock_info(symbol)
        elif sub_action == 'history':
            result = get_historical_data(symbol, period=data.get('period', '1mo'))
        elif sub_action == 'trending':
            result = get_trending_stocks()
        else:
            result = {'error': f'Unknown sub-action: {sub_action}'}
            
        return {'success': True, 'data': result}
    except Exception as e:
        logger.error(f"Market data request error: {e}")
        return {'success': False, 'error': str(e)}

def main():
    """Main entry point for stdin/stdout communication"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        
        if not input_data:
            print(json.dumps({'success': False, 'error': 'No input data'}))
            return
        
        request = json.loads(input_data)
        action = request.get('action')
        data = request.get('data', {})
        
        # Route to appropriate handler
        if action == 'profile':
            result = handle_profile_request(data)
        elif action == 'recommend':
            result = handle_recommendation_request(data)
        elif action == 'predict':
            result = handle_prediction_request(data)
        elif action == 'market_data':
            result = handle_market_data_request(data)
        else:
            result = {'success': False, 'error': f'Unknown action: {action}'}
        
        # Output result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(json.dumps({'success': False, 'error': 'Invalid JSON input'}))
    except Exception as e:
        logger.error(f"Main error: {e}")
        print(json.dumps({'success': False, 'error': str(e)}))

if __name__ == "__main__":
    main()
