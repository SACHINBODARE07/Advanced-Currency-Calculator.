import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConversionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching conversion history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Conversion History</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Target</th>
              <th>Rate Source</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>{item.sourceAmount} {item.sourceCurrency}</td>
                <td>{item.targetAmount} {item.targetCurrency}</td>
                <td>{item.rateSource}</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConversionHistory;

