import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ShoppingCart from './ShoppingCart';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { saveCart, getCart, clearCart } from '../utils/cartStorage';

const Phone = () => {
  const token = localStorage.getItem('auth_token');
  const [phones, setPhones] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    maSanPham: '',
    tenSanPham: '',
    hinhSanPham: '',
    gia: 0
  });

  const [cart, setCart] = useState(getCart());
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Thêm sản phẩm');
  const [showCart, setShowCart] = useState(false);

  const getAuthHeader = useCallback(() => {
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const getPhones = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/phones', { headers: getAuthHeader() });
      if (res.data && Array.isArray(res.data)) {
        setPhones(res.data);
      } else {
        setPhones([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    getPhones();
  }, [getPhones]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, hinhSanPham: URL.createObjectURL(file) });
      setErrors({ ...errors, hinhSanPham: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.maSanPham) newErrors.maSanPham = 'Mã sản phẩm không được để trống';
    if (!formData.tenSanPham) newErrors.tenSanPham = 'Tên sản phẩm không được để trống';
    if (!formData.hinhSanPham) newErrors.hinhSanPham = 'Hình sản phẩm không được để trống';
    if (formData.gia <= 0) newErrors.gia = 'Giá sản phẩm phải lớn hơn 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPhone = async (e) => {
    e.preventDefault();

    const userRole = getUserRole();
    if (userRole !== 'admin') {
      toast.error('Bạn không có quyền thực hiện thao tác này.');
      return;
    }

    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    try {
      if (formData.id === 0) {
        const res = await axios.post('http://localhost:8081/api/phones', formData, { headers: getAuthHeader() });
        setPhones([...phones, res.data]);
        toast.success('Thêm sản phẩm thành công!');
      } else {
        await axios.put(`http://localhost:8081/api/phones/${formData.id}`, formData, { headers: getAuthHeader() });
        const updatedPhones = phones.map(phone =>
          phone.id === formData.id ? formData : phone
        );
        setPhones(updatedPhones);
        toast.success('Cập nhật sản phẩm thành công!');
      }
      clearForm();
      getPhones();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding/editing data:', error);
      if (error.response) {
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Request:', error.request);
        toast.error('Không thể kết nối tới server.');
      } else {
        console.error('Error', error.message);
        toast.error(`Lỗi: ${error.message}`);
      }
    }
  };

  const handleDeletePhone = async (id) => {
    const userRole = getUserRole();

    if (userRole !== 'admin') {
      toast.error('Bạn không có quyền thực hiện thao tác này.');
      return;
    }

    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa thông tin này không?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8081/api/phones/${id}`, { headers: getAuthHeader() });
              setPhones(phones.filter(phone => phone.id !== id));
              toast.success('Xóa sản phẩm thành công!');
            } catch (error) {
              console.error('Error deleting data:', error);
              toast.error('Xóa sản phẩm thất bại.');
            }
          }
        },
        {
          label: 'Không',
          onClick: () => { }
        }
      ]
    });
  };

  const handleEditPhone = (phone) => {
    setFormData({
      id: phone.id,
      maSanPham: phone.maSanPham,
      tenSanPham: phone.tenSanPham,
      hinhSanPham: phone.hinhSanPham,
      gia: phone.gia
    });
    setModalTitle('Sửa sản phẩm');
    setShowModal(true);
  };

  const clearForm = () => {
    setFormData({
      id: 0,
      maSanPham: '',
      tenSanPham: '',
      hinhSanPham: '',
      gia: 0
    });
    setErrors({});
    setModalTitle('Thêm sản phẩm');
  };

  const handleAddToCart = (phone) => {
    const existingItem = cart.find(item => item.id === phone.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === phone.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.gia } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...phone, quantity: 1, total: phone.gia }]);
    }
    saveCart(cart);
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity, total: quantity * item.gia } : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
  };

  const handleCheckout = async () => {
    const user = jwtDecode(token);
  
    // Trích xuất id từ sub trong payload
    const parseSub = (sub) => {
      const matches = sub.match(/id=(\d+)/);
      return matches ? parseInt(matches[1], 10) : null;
    };
  
    const maKhachHang = parseSub(user.sub); // Sử dụng hàm parseSub để lấy id
  
    const orderDTO = {
      maDonHang: `DH${Date.now()}`,
      trangThai: "PENDING",
      tongTien: cart.reduce((total, item) => total + item.total, 0),
      maKhachHang: maKhachHang, // Sử dụng id của người dùng
      items: cart.map(item => ({
        maSanPham: item.id,
        tenSanPham: item.tenSanPham,
        giaSanPham: item.gia,
        soLuong: item.quantity,
        tongTien: item.total
      }))
    };
  
    console.log('Order data:', JSON.stringify(orderDTO, null, 2)); // Log dữ liệu gửi lên
  
    try {
      await axios.post('http://localhost:8081/api/orders', orderDTO, { headers: getAuthHeader() });
      setCart([]);
      clearCart();
      setShowCart(false);
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error processing order:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        toast.error(`Đặt hàng thất bại: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('Không thể kết nối tới server.');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Lỗi: ${error.message}`);
      }
    }
  };

  const getUserRole = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const sub = decodedToken.sub;
      if (sub) {
        const role = extractRole(sub);
        console.log('Role:', role)
        return role;
      }
    }
    return null;
  };

  const extractRole = (sub) => {
    const rolePattern = /role=([^,]*)/;
    const match = sub.match(rolePattern);
    if (match) {
      return match[1].trim();
    }
    return null;
  };

  return (
    <div className="container-fluid mx-auto mt-5">
      <ToastContainer />
      <div className="row mb-4">
        <div className="col-md-12 d-flex justify-content-end">
          {getUserRole() === 'admin' && (
            <button
              className="btn btn-success"
              onClick={() => {
                setShowModal(true);
                setModalTitle('Thêm sản phẩm');
                clearForm();
              }}
            >
              Thêm sản phẩm
            </button>
          )}
          {getUserRole() !== 'admin' && (
            <button
              className="btn btn-primary ml-2"
              onClick={() => setShowCart(true)}
            >
              Giỏ hàng ({cart.length})
            </button>
          )}
        </div>
      </div>
      <ProductList
        phones={phones}
        handleEditPhone={handleEditPhone}
        handleDeletePhone={handleDeletePhone}
        handleAddToCart={handleAddToCart}
        getUserRole={getUserRole}
      />
      <ProductForm
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle={modalTitle}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFocus={handleFocus}
        handleImageChange={handleImageChange}
        handleAddPhone={handleAddPhone}
        errors={errors}
      />
      <ShoppingCart
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Phone;
