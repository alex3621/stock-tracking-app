import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Manage({ userId }) {
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

  const handleBuyStock = async (symbol, quantity, price) => {
    try {
      const data = {
        symbol,
        quantity,
        price,
        userId,
      };
  
      const response = await fetch('http://localhost:8000/stock/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server returned an error:', errorText);
        toast.error(errorText || 'Unknown error');
        return;
      }
  
      // Update funds after successful purchase
      toast.success('Stock bought successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Fetch error: ' + error.message);
    }
  };
  
  


  return (
    <div className=" homeBody">
      <h2 className="mb-4">Welcome to the Stock Management Page</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-4">Stock Data</h2>
          {stockData.length > 0 ? (
            <div className="list-group">
              {stockData.map((stock) => (
                <div
                  className="list-group-item list-group-item-action"
                  key={stock.T}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{stock.T}</h5>
                    <small className="text-muted">Price: ${stock.c}</small>
                  </div>
                  <form
                    className="mt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const quantity = parseInt(e.target.quantity.value, 10);
                      if (!isNaN(quantity)) {
                        handleBuyStock(stock.T, quantity, stock.c);
                        e.target.reset();
                      }
                    }}
                  >
                    <div className="input-group">
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        placeholder="Quantity"
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        Buy
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p>No stock data available.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Manage;