import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return (
    <Route
      element={isAuthenticated ? children : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
