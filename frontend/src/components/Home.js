import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
function Home({ userId }) {
  const [totalAssets, setTotalAssets] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [baseFund, setBaseFund] = useState(0);
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

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

//pie chart logic
const preparePieChartData = () => {
    const labels = stocks.map(stock => stock.symbol);
    const data = stocks.map(stock => stock.quantity * parseFloat(stock.currentPrice));
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
            '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
          ],
          borderColor: 'white',
          borderWidth: 2
        }
      ]
    };
  };

  return (
    <div className="flex-container" style={{ paddingTop: '400px' }}>
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
        <Row className="mb-4">
          <Col>
            <Card className="portfolio-distribution-card">
              <Card.Body>
                <Card.Title>Portfolio Distribution</Card.Title>
                <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
                  <Pie data={preparePieChartData()} options={pieChartOptions} />
                </div>
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