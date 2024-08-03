import axios from 'axios';

export const saveOrder = async (order, token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const response = await axios.post('http://localhost:8081/api/orders', order, { headers });
  return response.data;
};
