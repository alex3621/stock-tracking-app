import React, { useState, useEffect } from 'react';

function Manage() {
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

  const handleBuyStock = (symbol, quantity) => {
    console.log(`Buying ${quantity} shares of ${symbol}`);
  };


  return (
    <div className="homeBody">
      <h2>Welcome to the Stock Management Page</h2>
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const quantity = parseInt(e.target.quantity.value, 10);
                      if (!isNaN(quantity)) {
                        handleBuyStock(stock.T, quantity);
                        e.target.reset();
                      }
                    }}
                  >
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      required
                    />
                    <button type="submit">Buy</button>
                  </form>
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

export default Manage;