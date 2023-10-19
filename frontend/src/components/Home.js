import React, { useState, useEffect } from 'react';

function Home() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/stock/fetchData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data)
        setStockData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="homeBody">
      <h2>Welcome to the Home Page</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Stock Data</h2>
          {stockData.length > 0 ? (
            <ul className="stock-list">
              {stockData.map((stock) => (
                <li className="stock-item" key={stock.T}>
                  <p className="stock-symbol">Symbol: {stock.T}</p>
                  <p className="stock-price">Price: {stock.c}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No stock data available.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
