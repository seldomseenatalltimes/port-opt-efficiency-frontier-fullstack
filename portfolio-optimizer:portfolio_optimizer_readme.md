# Portfolio Optimizer - Full Stack Application

A comprehensive portfolio optimization application built with React frontend and FastAPI backend that uses Modern Portfolio Theory to analyze and optimize investment portfolios.

## Features

- **Interactive Portfolio Optimization**: Upload ticker lists or input manually
- **Advanced Filtering**: Filter stocks by market capitalization and trading volume
- **Efficient Frontier Visualization**: Interactive charts showing optimal risk-return combinations
- **Optimal Portfolio Analysis**: Find minimum volatility and maximum Sharpe ratio portfolios
- **Export Functionality**: Generate PDF reports of analysis results
- **Real-time Data**: Fetch live market data using Yahoo Finance API

## Technology Stack

### Frontend
- **React 18** with hooks
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **FastAPI** with Python 3.8+
- **yfinance** for market data
- **pandas & numpy** for data processing
- **scipy** for optimization algorithms
- **matplotlib** for PDF report generation

## Prerequisites

### System Requirements
- **Node.js** 16+ and npm/yarn
- **Python** 3.8+
- **pip** package manager

### Development Tools (Optional)
- VS Code or your preferred IDE
- Git for version control

## Installation & Setup

### 1. Backend Setup (FastAPI)

#### Clone and Navigate to Backend Directory
```bash
# Create project directory
mkdir portfolio-optimizer
cd portfolio-optimizer

# Create backend directory
mkdir backend
cd backend
```

#### Install Python Dependencies
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn pandas numpy yfinance scipy matplotlib reportlab python-multipart
```

#### Create Backend Files
1. Save the **Portfolio Optimizer - Python Backend (FastAPI)** code as `main.py`
2. Create additional files as needed (see Project Structure below)

#### Start the Backend Server
```bash
# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server will be available at:
# - Local: http://localhost:8000
# - API Documentation: http://localhost:8000/docs
# - Alternative docs: http://localhost:8000/redoc
```

### 2. Frontend Setup (React)

#### Navigate to Frontend Directory (from project root)
```bash
cd ..  # Go back to project root
mkdir frontend
cd frontend
```

#### Initialize React Application
```bash
# Create React app
npx create-react-app portfolio-optimizer-frontend
cd portfolio-optimizer-frontend

# Install additional dependencies
npm install recharts lucide-react axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Configure Tailwind CSS
Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Add Frontend Code
1. Replace contents of `src/App.js` with the **Portfolio Optimizer - React Frontend** code
2. Update imports and component structure as needed

#### Start the Frontend Development Server
```bash
# Start React development server
npm start

# Application will be available at:
# http://localhost:3000
```

## Project Structure

```
portfolio-optimizer/
├── backend/
│   ├── venv/                 # Python virtual environment
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models (optional)
│   ├── services.py          # Business logic (optional)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main application component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

The FastAPI backend provides the following endpoints:

### POST `/api/optimize`
Optimizes portfolio based on provided tickers and filters.

**Request Body:**
```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL"],
  "min_market_cap": 100,
  "max_market_cap": 3000,
  "min_volume": 10,
  "max_volume": 100
}
```

**Response:**
```json
{
  "filtered_tickers": [...],
  "efficient_frontier": [...],
  "optimal_portfolios": {...},
  "message": "Portfolio optimization completed successfully"
}
```

### POST `/api/generate_pdf`
Generates PDF report from optimization results.

**Request Body:**
```json
{
  "results": { /* optimization results */ }
}
```

## Configuration

### Environment Variables

Create `.env` files for configuration:

#### Backend `.env`
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# External APIs
ALPHA_VANTAGE_API_KEY=your_api_key_here  # Optional

# Risk-free rate for Sharpe ratio calculation
RISK_FREE_RATE=0.02
```

#### Frontend `.env`
```env
# API Base URL
REACT_APP_API_BASE_URL=http://localhost:8000

# Application Configuration
REACT_APP_ENVIRONMENT=development
```

## Usage Instructions

### 1. Basic Portfolio Optimization

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open** http://localhost:3000 in your browser
3. **Input tickers** either manually or via file upload:
   - Manual: Enter comma-separated tickers (e.g., "AAPL, MSFT, GOOGL")
   - File: Upload a `.txt` file with one ticker per line
4. **Set filters** (optional):
   - Market Cap: Minimum/maximum in billions
   - Volume: Minimum/maximum average daily volume in millions
5. **Click "Optimize Portfolio"** to run the analysis
6. **View results** in chart or table format
7. **Download PDF report** for detailed analysis

### 2. File Upload Format

Create a `.txt` file with tickers:
```
AAPL
MSFT
GOOGL
AMZN
TSLA
META
NVDA
```

### 3. Understanding Results

- **Efficient Frontier**: Curve showing optimal risk-return combinations
- **Minimum Volatility Portfolio**: Lowest risk portfolio
- **Maximum Sharpe Ratio Portfolio**: Best risk-adjusted returns
- **Portfolio Weights**: Percentage allocation for each stock

## Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Port already in use
lsof -ti:8000 | xargs kill -9

# Python package issues
pip install --upgrade pip
pip install -r requirements.txt
```

#### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies  
rm -rf node_modules package-lock.json
npm install

# Tailwind CSS not working
npm run build:css
```

#### API Connection Issues
- Verify backend is running on http://localhost:8000
- Check CORS settings in FastAPI
- Ensure firewall/antivirus isn't blocking ports

### Development Tips

1. **Use API documentation**: Visit http://localhost:8000/docs for interactive API testing
2. **Monitor logs**: Check both frontend and backend console outputs
3. **Data validation**: Ensure ticker symbols are valid and markets are open
4. **Rate limiting**: Yahoo Finance may limit requests; implement caching if needed

## Production Deployment

### Backend Deployment
```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files (example with nginx)
# Copy build/ contents to nginx web directory
```

### Environment Considerations
- Set appropriate CORS origins for production
- Use environment variables for sensitive configuration
- Implement proper error handling and logging
- Consider rate limiting and caching strategies

## Support & Contributing

### Getting Help
- Check the API documentation at `/docs`
- Review error messages in browser console and server logs
- Ensure all dependencies are properly installed

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is for educational and research purposes. Please ensure compliance with financial data provider terms of service when using market data APIs.