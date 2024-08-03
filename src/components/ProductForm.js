import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductForm = ({ showModal, setShowModal, modalTitle, formData, handleInputChange, handleFocus, handleImageChange, handleAddPhone, errors }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddPhone}>
          <Form.Group>
            <Form.Label>Mã Sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="maSanPham"
              value={formData.maSanPham}
              onChange={handleInputChange}
              onFocus={handleFocus}
              isInvalid={!!errors.maSanPham}
            />
            <Form.Control.Feedback type="invalid">{errors.maSanPham}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tên Sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="tenSanPham"
              value={formData.tenSanPham}
              onChange={handleInputChange}
              onFocus={handleFocus}
              isInvalid={!!errors.tenSanPham}
            />
            <Form.Control.Feedback type="invalid">{errors.tenSanPham}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Hình sản phẩm</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              isInvalid={!!errors.hinhSanPham}
            />
            <Form.Control.Feedback type="invalid">{errors.hinhSanPham}</Form.Control.Feedback>
            {formData.hinhSanPham && (
              <img src={formData.hinhSanPham} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Giá</Form.Label>
            <Form.Control
              type="number"
              name="gia"
              value={formData.gia}
              onChange={handleInputChange}
              onFocus={handleFocus}
              isInvalid={!!errors.gia}
            />
            <Form.Control.Feedback type="invalid">{errors.gia}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="btn btn-success">
            Lưu
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductForm;
