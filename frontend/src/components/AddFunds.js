import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddFunds({ userId }) {
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/user/addFund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Funds added successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('An error occurred while adding funds');
    }
  };

  return (
    <div className="flex-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Add Funds</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="amount">
                    <Form.Label>Amount:</Form.Label>
                    <Form.Control
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Add Funds
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default AddFunds;