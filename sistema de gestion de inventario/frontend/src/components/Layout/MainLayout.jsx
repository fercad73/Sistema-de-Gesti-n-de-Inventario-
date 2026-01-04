import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper" style={{ marginTop: '56px', marginLeft: '250px', transition: 'margin-left 0.3s ease' }}>
        <div className="main-content">
          <Container fluid>
            {children}
          </Container>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default MainLayout;