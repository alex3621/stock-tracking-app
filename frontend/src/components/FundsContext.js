
import React, { createContext, useContext, useState } from 'react';

const FundsContext = createContext();

export const FundsProvider = ({ children }) => {
  const [funds, setFunds] = useState(0);

  const updateFunds = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/user/funds?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const fundsAmount = parseFloat(data.funds);
        setFunds(isNaN(fundsAmount) ? 0 : fundsAmount);
      } else {
        console.error('Failed to fetch funds');
        setFunds(0);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
      setFunds(0);
    }
  };

  return (
    <FundsContext.Provider value={{ funds, updateFunds }}>
      {children}
    </FundsContext.Provider>
  );
};

export const useFunds = () => useContext(FundsContext);
