import React from 'react';

const CartPage = () => {
    const cartItems = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
    ];

    return (
        <div className="container mt-5">
            <h2>Your Cart</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td><img src={item.imageUrl} alt={item.name} width="50" /></td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={alert('Checkout Succesful!')}>Checkout</button>
            </div>
        </div>
    );
};

export default CartPage;
