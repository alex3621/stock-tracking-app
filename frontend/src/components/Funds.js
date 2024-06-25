import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Funds({ userId }) {
  const [funds, setFunds] = useState(0);
  const [error, setError] = useState(null);

  const fetchFunds = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/funds?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure funds is a number
        const fundsAmount = parseFloat(data.funds);
        setFunds(isNaN(fundsAmount) ? 0 : fundsAmount);
      } else {
        console.error('Failed to fetch funds');
        setError('Failed to fetch funds');
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
      setError('Error fetching funds');
    }
  };


  useEffect(() => {
    if (userId) {
      fetchFunds();
    }
  }, [userId]);

  if (error) {
    return <div className="funds error">{error}</div>;
  }

  return (
    <div className="funds">
      Funds: ${typeof funds === 'number' ? funds.toFixed(2) : '0.00'}
    </div>
  );
}

export default Funds;
