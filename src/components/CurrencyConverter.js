import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CurrencyConverter({ rates, lastUpdate }) {
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    if (rates && Object.keys(rates).length > 0) {
      setCurrencies(Object.keys(rates));
    }
  }, [rates]);

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/convert', {
        sourceCurrency,
        targetCurrency,
        amount: parseFloat(amount),
      });
      setResult(response.data.result);

      // Save conversion history
      await axios.post('http://localhost:7000/api/history', {
        sourceCurrency,
        sourceAmount: parseFloat(amount),
        targetCurrency,
        targetAmount: parseFloat(response.data.result),
        notes: '',
      });
    } catch (error) {
      console.error('Error converting currency:', error);
      alert('Error converting currency. Please try again.');
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">Currency Converter</h2>
        <div className="mb-3">
          <label htmlFor="sourceCurrency" className="form-label">Source Currency</label>
          <select
            id="sourceCurrency"
            className="form-select"
            value={sourceCurrency}
            onChange={(e) => setSourceCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="targetCurrency" className="form-label">Target Currency</label>
          <select
            id="targetCurrency"
            className="form-select"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleConvert}>Convert</button>
        {result && (
          <div className="mt-3">
            <strong>Result:</strong> {amount} {sourceCurrency} = {result} {targetCurrency}
          </div>
        )}
        <div className="mt-3">
          <small>
            Rate source: European Central Bank<br />
            Last updated: {lastUpdate && lastUpdate.toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;

