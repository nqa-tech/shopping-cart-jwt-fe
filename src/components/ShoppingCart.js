import React from 'react';
import { Offcanvas, Button, Form } from 'react-bootstrap';

const ShoppingCart = ({ showCart, setShowCart, cart, handleQuantityChange, handleRemoveItem, handleCheckout }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Giỏ hàng</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length > 0 ? (
          cart.map(item => (
            <div key={item.id} className="mb-3">
              <h5>{item.tenSanPham}</h5>
              <img src={item.hinhSanPham} alt="Hình sản phẩm" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
              <p>Giá: {formatCurrency(item.gia)}</p>
              <Form.Group controlId={`quantity-${item.id}`}>
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                />
              </Form.Group>
              <p>Thành tiền: {formatCurrency(item.total)}</p>
              <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>
                Xóa
              </Button>
              <hr />
            </div>
          ))
        ) : (
          <p>Giỏ hàng trống</p>
        )}
        {cart.length > 0 && (
          <Button variant="success" onClick={handleCheckout}>
            Thanh toán
          </Button>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ShoppingCart;
