import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Manage({ userId }) {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 30;

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
        console.log(data.data);
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

  // Filtered stock data based on search query
  const filteredStockData = stockData.filter(stock =>
    stock.T.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStockData.slice(indexOfFirstStock, indexOfLastStock);

  const totalPages = Math.ceil(filteredStockData.length / stocksPerPage);

  const scrollToTop = () => {
    console.log('Scrolling to top...');
    document.querySelector('.homeBody').scrollTo(0, 0);
  };

  const paginate = (pageNumber) => {
    console.log('Paginate called with page number:', pageNumber);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  return (
    <div  className="homeBody">
      <h2 className="mb-4">Welcome to the Stock Management Page</h2>
      
      <h2 className="mb-4">Buy Stocks</h2>
      <div className="row justify-content-center mb-3">
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Search by symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="dynamic-content">
          {currentStocks.length > 0 ? (
            <div className="list-group">
              {currentStocks.map((stock) => (
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
        </div>
      )}
      
      {!loading && filteredStockData.length > stocksPerPage && (
        <nav aria-label="Stock pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(number + 1)}>{number + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default Manage;
