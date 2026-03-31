<<<<<<< HEAD
# AI Trading Assistant

This is an AI-powered stock market trading and advisory platform. The project is organized into three main modules: Backend, Frontend, and AI Integration.

---

# TradeMind AI – Backend

## Overview

The backend powers the core functionality of TradeMind AI by handling stock data retrieval, user interactions, API services, and communication with AI prediction models.

---

# Key Features

## 1. Stock Data API

Provides endpoints to fetch stock information for analysis and prediction.

**Capabilities**

* Retrieve historical stock data
* Fetch real-time market updates
* Support multiple stock symbols

---

## 2. Prediction Request Handling

The backend receives prediction requests from the frontend and forwards the processed data to the AI models.

**Capabilities**

* Accept stock prediction requests
* Validate input parameters
* Return model predictions through APIs

---

## 3. User Risk Profiling

Collects and processes user information to determine risk tolerance and investment preferences.

**Capabilities**

* Risk tolerance classification
* Investor profile generation
* Input validation for financial parameters

---

## 4. Data Processing Layer

Handles preprocessing of stock market data before sending it to AI models.

**Capabilities**

* Data cleaning
* Missing value handling
* Feature preparation

---

## 5. AI Model Integration

Acts as a bridge between the AI models and the frontend.

**Capabilities**

* Send processed data to models
* Receive predictions
* Format results for frontend use

---

# Tech Stack

* Python
* FastAPI / Flask
* Pandas
* NumPy
* REST APIs

---

# Running the Backend

Install dependencies

pip install -r requirements.txt

Start the server

uvicorn main:app --reload

Server runs on:

http://localhost:8000

---

# API Examples

Get stock data

GET /api/stocks/{symbol}

Predict stock price

POST /api/predict

Generate risk profile

POST /api/risk-profile

---

# Future Features

* Real-time market streaming
* Portfolio tracking APIs
* User authentication system
* Advanced analytics endpoints

=======
# TradeMind AI - Frontend Application

## Overview

TradeMind AI is a modern, AI-powered trading companion application designed to help users make informed investment decisions. The application features a sleek dark/light theme interface with comprehensive portfolio management, market analysis, and personalized AI-driven insights.

## Features

### 🎨 Theme System
- **Dark Mode**: Sleek, modern dark theme with purple accents perfect for extended trading sessions
- **Light Mode**: Clean, professional light theme with dark purple headings for daytime use
- **Theme Toggle**: Easy switching between modes with persistent preference storage
- **Consistent Design**: Both themes maintain the same purple accent color (#7c3aed) for brand consistency

### 📊 Dashboard
**Purpose**: Central hub for quick portfolio overview and market insights

**Features**:
- **Portfolio Overview Cards**:
  - Total portfolio value with percentage change
  - Total gain/loss tracking
  - Available cash balance
  - Risk level indicator
  
- **Portfolio Performance Chart**: 30-day historical performance visualization with purple gradient area chart

- **AI Insights Panel**: Real-time personalized recommendations including:
  - Investment opportunities (green)
  - Warnings and alerts (yellow/red)
  - Trading tips (purple)
  - Stock-specific insights with badges

- **Trending Stocks**: Live market movers with:
  - Symbol and company name
  - Current price
  - Percentage change (color-coded)
  - Sector badges

- **Market News**: Curated news feed with:
  - Sentiment analysis (positive/negative/neutral)
  - Source and timestamp
  - Relevant summaries

**When to Use**: Check daily for portfolio performance, market trends, and AI-generated insights

---

### 💬 AI Trading Advisor
**Purpose**: Interactive AI assistant for personalized trading guidance

**Features**:
- **Chat Interface**: Natural conversation with AI advisor
- **Personalized Analysis**: Recommendations based on:
  - Your risk tolerance (moderate/conservative/aggressive)
  - Investment goals (growth/income/balanced)
  - Trading style (day/swing/position/long-term)
  
- **Stock Analysis**: Ask about specific stocks (AAPL, NVDA, TSLA, etc.) and receive:
  - Current price and momentum analysis
  - Strengths and risks
  - Technical indicators
  - Position sizing recommendations
  
- **Portfolio Guidance**: Get advice on:
  - Diversification strategies
  - Rebalancing suggestions
  - Risk management
  - Entry/exit timing
  
- **Quick Questions**: Pre-built queries for common scenarios
- **Sentiment Badges**: Visual indicators for bullish/bearish/neutral recommendations

**When to Use**: 
- Before making trading decisions
- When researching new stocks
- For portfolio rebalancing advice
- To understand market movements

---

### 💼 Portfolio
**Purpose**: Comprehensive portfolio management and tracking

**Features**:
- **Summary Cards**:
  - Total portfolio value
  - Total gain/loss with percentage
  - Available cash
  - Buying power (with margin)
  
- **Portfolio Allocation Chart**: Pie chart showing distribution across holdings

- **Performance Bar Chart**: Visual comparison of returns by position

- **Holdings Table**: Detailed view with:
  - Symbol and company name
  - Number of shares
  - Average cost basis
  - Current price
  - Total value
  - Gain/loss (color-coded)
  - Return percentage badges
  - Quick trade actions
  
- **AI Portfolio Analysis**: Personalized insights on:
  - Sector concentration
  - Portfolio beta
  - Rebalancing suggestions

**When to Use**:
- Daily portfolio monitoring
- Before adding new positions
- For rebalancing decisions
- Tax planning and reporting

---

### 📈 Market Analysis
**Purpose**: Deep-dive research and technical analysis tools

**Features**:
- **Stock Search**: Quick search across all available stocks

- **Stock List Sidebar**: Browse trending stocks with:
  - Real-time prices
  - Percentage changes
  - Quick selection

- **Stock Header**: Detailed current information:
  - Large price display
  - Daily change
  - Sector classification
  - Quick actions (watchlist, trade)

- **Interactive Price Chart**: 
  - Multiple timeframes (1D, 1W, 1M, 3M, 1Y)
  - Color-coded trends (green for up, red for down)
  - Gradient area visualization

- **Analysis Tabs**:
  
  **Overview Tab**:
  - Market cap
  - P/E ratio
  - Volume
  - Sector information
  - Company description
  
  **Technicals Tab**:
  - RSI indicator with overbought/oversold signals
  - 50-day and 200-day moving averages
  - Volume analysis
  - Volatility metrics
  - Beta coefficient
  
  **Fundamentals Tab**:
  - P/E ratio
  - EPS (earnings per share)
  - Analyst ratings breakdown (Buy/Hold/Sell)
  - Price target and upside potential
  
  **AI Analysis Tab**:
  - Buy/Hold/Watch recommendation
  - Risk assessment based on your profile
  - Suggested entry/exit points
  - Stop loss recommendations
  - Position sizing guidance

**When to Use**:
- Researching new investment opportunities
- Technical analysis before trades
- Comparing multiple stocks
- Understanding market trends

---

### ⚙️ Settings
**Purpose**: Customize your trading profile and preferences

**Features**:
- **Profile Information**:
  - Name and email
  - Trading experience level
  
- **Investment Goals**:
  - Income generation
  - Capital growth
  - Balanced approach
  - Capital preservation
  - Time horizon selection
  
- **Trading Style**:
  - Day trading
  - Swing trading
  - Position trading
  - Long-term investing
  
- **Risk Tolerance**:
  - Interactive slider (Conservative to Aggressive)
  - Real-time risk profile description
  - Maximum acceptable loss per trade
  - Portfolio beta targeting
  
- **Notifications**:
  - Price alerts
  - AI insights
  - Market news
  - Portfolio updates
  
- **Profile Summary Sidebar**: Quick view of:
  - Current settings
  - Portfolio value
  - AI personalization status

**When to Use**:
- Initial account setup
- When investment goals change
- Adjusting risk tolerance
- Managing notification preferences

---

## Technical Stack

### Frontend Framework
- **React 18** with TypeScript
- **React Router** for navigation
- **Vite** for fast development and building

### UI Components
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization

### State Management
- React hooks (useState, useEffect)
- LocalStorage for theme persistence

### Styling System
- CSS Variables for theming
- Dark/Light mode support
- Responsive design (mobile-first)
- Purple accent color (#7c3aed)

---

## Color Palette

### Dark Mode
- Background: `#0d0d1a`
- Cards: `#1a1a2e`
- Text: `#f0f0f5`
- Headings: `#a78bfa` (light purple)
- Primary: `#7c3aed` (purple)
- Success: `#10b981` (green)
- Danger: `#ef4444` (red)

### Light Mode
- Background: `#f8f9fc`
- Cards: `#ffffff`
- Text: `#0f172a`
- Headings: `#4c1d95` (dark purple)
- Primary: `#7c3aed` (purple)
- Success: `#10b981` (green)
- Danger: `#ef4444` (red)

---

## User Workflow

### New User Journey
1. **Settings**: Set up profile, goals, and risk tolerance
2. **Dashboard**: Get familiar with portfolio overview
3. **AI Advisor**: Ask questions and learn about the platform
4. **Market Analysis**: Research potential investments
5. **Portfolio**: Monitor and manage positions

### Daily Active User
1. **Dashboard**: Quick morning check of portfolio and news
2. **AI Advisor**: Get daily insights and recommendations
3. **Market Analysis**: Research specific opportunities
4. **Portfolio**: Review performance and rebalance if needed

### Pre-Trade Workflow
1. **Market Analysis**: Research the stock thoroughly
2. **AI Advisor**: Ask for personalized recommendation
3. **Settings**: Verify risk tolerance aligns with trade
4. **Portfolio**: Check available cash and diversification
5. **Execute Trade**: Use trade button from any screen

---

## Key Benefits

### For Beginners
- **Guided Experience**: AI advisor explains concepts in simple terms
- **Risk Management**: Built-in safeguards based on profile
- **Educational**: Learn while trading with AI insights
- **Visual Learning**: Charts and graphs make data easy to understand

### For Experienced Traders
- **Advanced Analysis**: Technical indicators and fundamentals
- **Quick Actions**: Fast navigation and trade execution
- **Customization**: Tailor experience to trading style
- **Comprehensive Data**: All information in one place

### For All Users
- **Personalization**: AI adapts to individual goals and risk tolerance
- **Real-time Updates**: Live market data and insights
- **Beautiful Design**: Modern, professional interface
- **Accessibility**: Works on desktop, tablet, and mobile

---

## Getting Started

### Installation
```bash
cd trademind-ai/frontend
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Project Structure

```
trademind-ai/frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx          # Main dashboard
│   │   │   ├── AIAdvisor.tsx          # AI chat interface
│   │   │   ├── Portfolio.tsx          # Portfolio management
│   │   │   ├── MarketAnalysis.tsx     # Stock research
│   │   │   ├── Settings.tsx           # User preferences
│   │   │   ├── Layout.tsx             # App shell with navigation
│   │   │   └── ui/                    # Reusable UI components
│   │   ├── data/
│   │   │   └── mockData.ts            # Sample data
│   │   ├── routes.ts                  # Route configuration
│   │   └── App.tsx                    # Root component
│   ├── styles/
│   │   ├── theme.css                  # Theme variables
│   │   ├── tailwind.css               # Tailwind imports
│   │   └── index.css                  # Global styles
│   └── main.tsx                       # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## Future Enhancements

- Real-time market data integration
- Live trading execution
- Advanced charting tools
- Social trading features
- Mobile app version
- Backtesting capabilities
- Portfolio optimization algorithms
- Multi-currency support

---

## Support

For questions or issues, please refer to the documentation or contact support.

---

**Built with ❤️ for smarter trading decisions**
>>>>>>> origin/frontend
