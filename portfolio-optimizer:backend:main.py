"""
Portfolio Optimization Backend API
FastAPI application for portfolio optimization using Modern Portfolio Theory
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import yfinance as yf
from scipy.optimize import minimize
import matplotlib.pyplot as plt
import matplotlib.backends.backend_pdf as pdf_backend
from io import BytesIO
import tempfile
import os
from datetime import datetime, timedelta
import asyncio
import json

app = FastAPI(
    title="Portfolio Optimizer API",
    description="API for portfolio optimization using Modern Portfolio Theory",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class OptimizationRequest(BaseModel):
    tickers: Optional[List[str]] = None
    file_content: Optional[str] = None  # Base64 encoded file content
    min_market_cap: Optional[float] = None
    max_market_cap: Optional[float] = None
    min_volume: Optional[float] = None
    max_volume: Optional[float] = None
    
    @validator('tickers', pre=True)
    def parse_tickers(cls, v):
        if isinstance(v, str):
            return [ticker.strip().upper() for ticker in v.replace('\n', ',').split(',') if ticker.strip()]
        return v

class StockInfo(BaseModel):
    ticker: str
    market_cap: float
    volume: float
    included: bool

class OptimalPortfolio(BaseModel):
    risk: float
    return_: float = None  # Using return_ to avoid Python keyword
    sharpe_ratio: float
    weights: Dict[str, float]
    
    class Config:
        fields = {'return_': 'return'}

class OptimizationResponse(BaseModel):
    filtered_tickers: List[StockInfo]
    efficient_frontier: List[Dict[str, float]]
    optimal_portfolios: Dict[str, OptimalPortfolio]
    message: str

class PDFRequest(BaseModel):
    results: Dict[str, Any]

class PortfolioOptimizer:
    def __init__(self):
        self.risk_free_rate = 0.02  # 2% risk-free rate
        
    def get_stock_data(self, tickers: List[str], period: str = "2y") -> Dict[str, Any]:
        """Fetch stock data and calculate market cap and volume metrics"""
        stock_data = {}
        
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                
                # Get historical data
                hist = stock.history(period=period)
                if hist.empty:
                    continue
                    
                # Get stock info
                info = stock.info
                
                # Calculate metrics
                market_cap = info.get('marketCap', 0) / 1e9  # Convert to billions
                avg_volume = hist['Volume'].mean() / 1e6  # Convert to millions
                
                stock_data[ticker] = {
                    'market_cap': market_cap,
                    'volume': avg_volume,
                    'prices': hist['Close'],
                    'info': info
                }
                
            except Exception as e:
                print(f"Error fetching data for {ticker}: {e}")
                continue
                
        return stock_data
    
    def filter_stocks(self, stock_data: Dict[str, Any], filters: Dict[str, float]) -> List[StockInfo]:
        """Filter stocks based on market cap and volume criteria"""
        filtered_stocks = []
        
        for ticker, data in stock_data.items():
            market_cap = data['market_cap']
            volume = data['volume']
            
            included = True
            
            # Apply filters
            if filters.get('min_market_cap') and market_cap < filters['min_market_cap']:
                included = False
            if filters.get('max_market_cap') and market_cap > filters['max_market_cap']:
                included = False
            if filters.get('min_volume') and volume < filters['min_volume']:
                included = False
            if filters.get('max_volume') and volume > filters['max_volume']:
                included = False
                
            filtered_stocks.append(StockInfo(
                ticker=ticker,
                market_cap=market_cap,
                volume=volume,
                included=included
            ))
            
        return filtered_stocks
    
    def calculate_returns_and_covariance(self, stock_data: Dict[str, Any], included_tickers: List[str]) -> tuple:
        """Calculate expected returns and covariance matrix"""
        # Create price dataframe
        prices_df = pd.DataFrame()
        for ticker in included_tickers:
            prices_df[ticker] = stock_data[ticker]['prices']
            
        # Calculate daily returns
        returns = prices_df.pct_change().dropna()
        
        # Annualize returns and covariance
        expected_returns = returns.mean() * 252
        cov_matrix = returns.cov() * 252
        
        return expected_returns, cov_matrix
    
    def portfolio_performance(self, weights: np.ndarray, expected_returns: pd.Series, cov_matrix: pd.DataFrame):
        """Calculate portfolio performance metrics"""
        portfolio_return = np.sum(weights * expected_returns)
        portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        sharpe_ratio = (portfolio_return - self.risk_free_rate) / portfolio_risk
        return portfolio_return, portfolio_risk, sharpe_ratio
    
    def generate_efficient_frontier(self, expected_returns: pd.Series, cov_matrix: pd.DataFrame, num_portfolios: int = 100):
        """Generate efficient frontier"""
        n_assets = len(expected_returns)
        results = np.zeros((3, num_portfolios))
        weights_array = np.zeros((num_portfolios, n_assets))
        
        # Define constraints and bounds
        constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
        bounds = tuple((0, 1) for _ in range(n_assets))
        
        # Generate target returns
        min_ret = expected_returns.min()
        max_ret = expected_returns.max()
        target_returns = np.linspace(min_ret, max_ret, num_portfolios)
        
        for i, target in enumerate(target_returns):
            # Add return constraint
            cons = [constraints, {'type': 'eq', 'fun': lambda x, target=target: self.portfolio_performance(x, expected_returns, cov_matrix