import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

function Home({ userId }) {
  const [totalAssets, setTotalAssets] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [baseFund, setBaseFund] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available funds
        const fundsResponse = await fetch(`http://localhost:8000/user/funds?user_id=${userId}`);
        const fundsData = await fundsResponse.json();
        setAvailableFunds(parseFloat(fundsData.funds) || 0);

        // Fetch base fund
        const baseFundResponse = await fetch(`http://localhost:8000/user/base_fund?user_id=${userId}`);
        const baseFundData = await baseFundResponse.json();
        setBaseFund(parseFloat(baseFundData.base_fund) || 0);

        // Fetch stocks owned by the user
        const stocksResponse = await fetch(`http://localhost:8000/stock/stockList?user_id=${userId}`);
        const stocksData = await stocksResponse.json();
        setStocks(stocksData.stocks);

        // Calculate total assets
        const stocksValue = stocksData.stocks.reduce((total, stock) => 
          total + (stock.quantity * parseFloat(stock.currentPrice)), 0);
        setTotalAssets(stocksValue + parseFloat(fundsData.funds) || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);
  };

  const difference = totalAssets - baseFund;
  const percentageChange = baseFund !== 0 ? (difference / baseFund) : 0;

  return (
    <div className="flex-container">
      <Container>
        <Row className="mb-4">
          <Col>
            <Card className="bg-info text-white">
              <Card.Body>
                <Card.Title>Total Assets</Card.Title>
                <Card.Text className="display-4">{formatCurrency(totalAssets)}</Card.Text>
                <Card.Text className={difference >= 0 ? 'text-success' : 'text-danger'}>
          {difference >= 0 ? 'Gain' : 'Loss'}: {formatCurrency(Math.abs(difference))} ({formatPercentage(percentageChange)})
        </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Available Funds</Card.Title>
                <Card.Text className="h3">{formatCurrency(availableFunds)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Invested Amount</Card.Title>
                <Card.Text className="h3">{formatCurrency(totalAssets - availableFunds)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Your Stocks</Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Quantity</th>
                      <th>Current Price</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock.symbol}>
                        <td>{stock.symbol}</td>
                        <td>{stock.quantity}</td>
                        <td>{formatCurrency(parseFloat(stock.currentPrice))}</td>
                        <td>{formatCurrency(stock.quantity * parseFloat(stock.currentPrice))}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;