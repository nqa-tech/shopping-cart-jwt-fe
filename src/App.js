import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import ProductPage from './components/ProductPage'
import AdminPage from './components/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import CartPage from './components/CartPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/products"
            element={
              <ProductPage />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage />
            }
          />
        </Routes>

      </Router>
    </AuthProvider>
  );
};

export default App;


// {/* <Route
//           path="/cart"
//           element={
//             <PrivateRoute roles={['USER']}>
//               <CartPage />
//             </PrivateRoute>
//           }
//         /> */}