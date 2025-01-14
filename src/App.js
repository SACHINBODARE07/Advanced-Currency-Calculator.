import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CurrencyConverter from './components/CurrencyConverter';
import ConversionHistory from './components/ConversionHistory';

function App() {
  const [rates, setRates] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:7000/api/rates');
        setRates(response.data.rates);
        setLastUpdate(new Date(response.data.lastUpdate));
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Advanced Currency Calculator</h1>
      {isLoading ? (
        <p className="text-center">Loading currency rates...</p>
      ) : (
        <>
          <CurrencyConverter rates={rates} lastUpdate={lastUpdate} />
          <ConversionHistory />
        </>
      )}
    </div>
  );
}

export default App;

