import React from 'react';

const ProductList = ({ phones, handleEditPhone, handleDeletePhone, handleAddToCart, getUserRole }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="row">
      {phones && phones.length > 0 ? (
        phones.map((phone, index) => (
          phone && phone.id ? (
            <div className="col-md-3 mb-4" key={phone.id}>
              <div className="card">
                <img src={phone.hinhSanPham} className="card-img-top" alt="Hình sản phẩm" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{phone.tenSanPham}</h5>
                  <p className="card-text">Mã sản phẩm: {phone.maSanPham}</p>
                  <p className="card-text">Giá: {formatCurrency(phone.gia)}</p>
                  {getUserRole() === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleEditPhone(phone)}
                        className="btn btn-primary mr-2">
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeletePhone(phone.id)}
                        className="btn btn-danger">
                        Xóa
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(phone)}
                      className="btn btn-secondary">
                      Đặt hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-12" key={`invalid-${index}`}>
              <div className="alert alert-warning" role="alert">
                Dữ liệu không hợp lệ
              </div>
            </div>
          )
        ))
      ) : (
        <div className="col-md-12">
          <div className="alert alert-info" role="alert">
            Không có sản phẩm nào.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
