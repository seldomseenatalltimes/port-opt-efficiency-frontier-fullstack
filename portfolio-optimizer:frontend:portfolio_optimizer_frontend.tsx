import React, { useState, useCallback } from 'react';
import { Upload, Play, Download, BarChart3, Table, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const PortfolioOptimizer = () => {
  const [tickers, setTickers] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [minMarketCap, setMinMarketCap] = useState('');
  const [maxMarketCap, setMaxMarketCap] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [maxVolume, setMaxVolume] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('chart');
  const [inputMode, setInputMode] = useState('manual');

  // Mock data for demonstration
  const mockResults = {
    filteredTickers: [
      { ticker: 'AAPL', marketCap: 2800, volume: 52.3, included: true },
      { ticker: 'MSFT', marketCap: 2600, volume: 31.2, included: true },
      { ticker: 'GOOGL', marketCap: 1700, volume: 28.4, included: true },
      { ticker: 'AMZN', marketCap: 1500, volume: 35.6, included: true },
      { ticker: 'TSLA', marketCap: 800, volume: 89.2, included: true }
    ],
    efficientFrontier: [
      { risk: 0.15, return: 0.08 },
      { risk: 0.16, return: 0.095 },
      { risk: 0.18, return: 0.11 },
      { risk: 0.20, return: 0.125 },
      { risk: 0.22, return: 0.14 },
      { risk: 0.25, return: 0.155 },
      { risk: 0.28, return: 0.17 },
      { risk: 0.32, return: 0.18 }
    ],
    optimalPortfolios: {
      minVolatility: {
        risk: 0.15,
        return: 0.08,
        sharpeRatio: 0.53,
        weights: {
          'AAPL': 0.25,
          'MSFT': 0.30,
          'GOOGL': 0.20,
          'AMZN': 0.15,
          'TSLA': 0.10
        }
      },
      maxSharpe: {
        risk: 0.20,
        return: 0.125,
        sharpeRatio: 0.625,
        weights: {
          'AAPL': 0.20,
          'MSFT': 0.25,
          'GOOGL': 0.25,
          'AMZN': 0.20,
          'TSLA': 0.10
        }
      }
    }
  };

  const validateInputs = () => {
    const tickerList = inputMode === 'manual' ? 
      tickers.split(/[,\n]/).map(t => t.trim()).filter(t => t) :
      uploadedFile ? ['FROM_FILE'] : [];
    
    if (tickerList.length === 0) {
      setError('Please provide at least one ticker symbol');
      return false;
    }

    if (minMarketCap && isNaN(parseFloat(minMarketCap))) {
      setError('Minimum market cap must be a valid number');
      return false;
    }

    if (maxMarketCap && isNaN(parseFloat(maxMarketCap))) {
      setError('Maximum market cap must be a valid number');
      return false;
    }

    if (minVolume && isNaN(parseFloat(minVolume))) {
      setError('Minimum volume must be a valid number');
      return false;
    }

    if (maxVolume && isNaN(parseFloat(maxVolume))) {
      setError('Maximum volume must be a valid number');
      return false;
    }

    if (minMarketCap && maxMarketCap && parseFloat(minMarketCap) > parseFloat(maxMarketCap)) {
      setError('Minimum market cap cannot be greater than maximum market cap');
      return false;
    }

    if (minVolume && maxVolume && parseFloat(minVolume) > parseFloat(maxVolume)) {
      setError('Minimum volume cannot be greater than maximum volume');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      setUploadedFile(file);
      setError('');
    } else {
      setError('Please upload a valid .txt file');
    }
  };

  const handleOptimize = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would be an API call:
      // const response = await fetch('/api/optimize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tickers: inputMode === 'manual' ? tickers : uploadedFile,
      //     minMarketCap: parseFloat(minMarketCap) || null,
      //     maxMarketCap: parseFloat(maxMarketCap) || null,
      //     minVolume: parseFloat(minVolume) || null,
      //     maxVolume: parseFloat(maxVolume) || null
      //   })
      // });
      // const data = await response.json();
      
      setResults(mockResults);
    } catch (err) {
      setError('Failed to optimize portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // In real implementation:
      // const response = await fetch('/api/generate_pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(results)
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'portfolio_analysis.pdf';
      // a.click();
      
      alert('PDF download would be triggered here in the full implementation');
    } catch (err) {
      setError('Failed to generate PDF report');
    }
  };

  const EfficientFrontierChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Efficient Frontier</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart data={results.efficientFrontier}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="risk" 
            domain={['dataMin - 0.01', 'dataMax + 0.01']}
            label={{ value: 'Risk (Standard Deviation)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            domain={['dataMin - 0.01', 'dataMax + 0.01']}
            label={{ value: 'Expected Return', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              (value * 100).toFixed(1) + '%', 
              name === 'return' ? 'Expected Return' : 'Risk'
            ]}
          />
          <Scatter name="Efficient Frontier" dataKey="return" fill="#3b82f6" />
          <Scatter 
            name="Min Volatility" 
            data={[results.optimalPortfolios.minVolatility]} 
            dataKey="return" 
            fill="#ef4444" 
            shape="diamond"
          />
          <Scatter 
            name="Max Sharpe" 
            data={[results.optimalPortfolios.maxSharpe]} 
            dataKey="return" 
            fill="#10b981" 
            shape="star"
          />
          <Legend />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  const FilteredTickersTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Filtered Tickers Analysis</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap (B)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Volume (M)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.filteredTickers.map((stock) => (
              <tr key={stock.ticker}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{stock.ticker}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${stock.marketCap.toFixed(1)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{stock.volume.toFixed(1)}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stock.included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stock.included ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {stock.included ? 'Included' : 'Excluded'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const OptimalPortfoliosTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Optimal Portfolios</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Minimum Volatility Portfolio</h4>
          <div className="space-y-2 text-sm">
            <div>Risk: <span className="font-medium">{(results.optimalPortfolios.minVolatility.risk * 100).toFixed(1)}%</span></div>
            <div>Return: <span className="font-medium">{(results.optimalPortfolios.minVolatility.return * 100).toFixed(1)}%</span></div>
            <div>Sharpe Ratio: <span className="font-medium">{results.optimalPortfolios.minVolatility.sharpeRatio.toFixed(3)}</span></div>
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-600 mb-2">Weights:</div>
              {Object.entries(results.optimalPortfolios.minVolatility.weights).map(([ticker, weight]) => (
                <div key={ticker} className="flex justify-between text-xs">
                  <span>{ticker}</span>
                  <span>{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Maximum Sharpe Ratio Portfolio</h4>
          <div className="space-y-2 text-sm">
            <div>Risk: <span className="font-medium">{(results.optimalPortfolios.maxSharpe.risk * 100).toFixed(1)}%</span></div>
            <div>Return: <span className="font-medium">{(results.optimalPortfolios.maxSharpe.return * 100).toFixed(1)}%</span></div>
            <div>Sharpe Ratio: <span className="font-medium">{results.optimalPortfolios.maxSharpe.sharpeRatio.toFixed(3)}</span></div>
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-600 mb-2">Weights:</div>
              {Object.entries(results.optimalPortfolios.maxSharpe.weights).map(([ticker, weight]) => (
                <div key={ticker} className="flex justify-between text-xs">
                  <span>{ticker}</span>
                  <span>{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Optimizer</h1>
          <p className="mt-2 text-gray-600">Optimize your portfolio using Modern Portfolio Theory and the Efficient Frontier</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Configuration</h2>
          
          {/* Input Mode Toggle */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setInputMode('manual')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  inputMode === 'manual' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manual Input
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  inputMode === 'file' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>
          </div>

          {/* Ticker Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Tickers</label>
            {inputMode === 'manual' ? (
              <textarea
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                placeholder="Enter tickers separated by commas or new lines (e.g., AAPL, MSFT, GOOGL)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="mb-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Choose File
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadedFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {uploadedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500">Upload a .txt file with one ticker per line</p>
              </div>
            )}
          </div>

          {/* Filter Criteria */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Market Cap (B)</label>
              <input
                type="number"
                value={minMarketCap}
                onChange={(e) => setMinMarketCap(e.target.value)}
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Market Cap (B)</label>
              <input
                type="number"
                value={maxMarketCap}
                onChange={(e) => setMaxMarketCap(e.target.value)}
                placeholder="No limit"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Volume (M)</label>
              <input
                type="number"
                value={minVolume}
                onChange={(e) => setMinVolume(e.target.value)}
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Volume (M)</label>
              <input
                type="number"
                value={maxVolume}
                onChange={(e) => setMaxVolume(e.target.value)}
                placeholder="No limit"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Optimize Button */}
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Optimize Portfolio
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                    viewMode === 'chart' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart View
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Table className="h-4 w-4 mr-2" />
                  Table View
                </button>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>

            {/* Chart View */}
            {viewMode === 'chart' && (
              <div className="space-y-6">
                <EfficientFrontierChart />
                <OptimalPortfoliosTable />
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="space-y-6">
                <FilteredTickersTable />
                <OptimalPortfoliosTable />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioOptimizer;