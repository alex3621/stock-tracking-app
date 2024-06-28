import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';

function Sell({ userId }) {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStocks();
  }, [userId]);

  const fetchUserStocks = async () => {
    try {
      const response = await fetch(`http://localhost:8000/stock/stockList?user_id=${userId}`);
      const data = await response.json();
      setStocks(data.stocks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stocks:', error);
      setMessage('Failed to load user stocks');
      setLoading(false);
    }
  };

  const handleStockSelect = (e) => {
    setSelectedStock(e.target.value);
    setQuantity(1); 
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 0));
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedStock || quantity <= 0) {
      setMessage('Please select a stock and enter a valid quantity');
      return;
    }

    try {
      const response = await $.ajax({
        url: 'http://localhost:8000/stock/sell',
        method: 'POST',
        dataType: 'json',
        data: {
          user_id: userId,
          symbol: selectedStock,
          quantity: quantity
        },
      });

      if (response.success) {
        toast.success('Stock sold successfully!');
        fetchUserStocks();
        setSelectedStock('');
        setQuantity(1);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(response.message || 'Failed to sell stock');
      }
    } catch (error) {
      console.error('Error selling stock:', error);
      setMessage('An error occurred while selling the stock');
    }
  };

  return (
    <div className="flex-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title className="text-center mb-4">Sell Stocks</Card.Title>
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : stocks.length > 0 ? (
                  <Form onSubmit={handleSell}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Stock</Form.Label>
                      <Form.Control as="select" value={selectedStock} onChange={handleStockSelect}>
                        <option value="">Choose a stock</option>
                        {stocks.map((stock) => (
                          <option key={stock.symbol} value={stock.symbol}>
                            {stock.symbol} - Owned: {stock.quantity}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={selectedStock ? stocks.find(s => s.symbol === selectedStock)?.quantity : 1}
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Sell Stock
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <Alert variant="info">You don't own any stocks to sell.</Alert>
                )}
                {message && (
                  <Alert variant={message.includes('success') ? 'success' : 'danger'} className="mt-3">
                    {message}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default Sell;
