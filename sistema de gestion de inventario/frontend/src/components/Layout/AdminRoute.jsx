import React from 'react';
import PrivateRoute from './PrivateRoute';

const AdminRoute = ({ children }) => {
  return (
    <PrivateRoute requiredRole="admin">
      {children}
    </PrivateRoute>
  );
};

export default AdminRoute;