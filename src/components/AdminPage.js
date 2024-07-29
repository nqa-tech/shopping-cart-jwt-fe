import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', imageUrl: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/admin/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        try {
            const response = await axios.post('/api/admin/products', newProduct);
            setProducts([...products, response.data]);
            setNewProduct({ name: '', price: '', imageUrl: '' });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/api/admin/products/${id}`);
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Page</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Image URL"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
                <button className="btn btn-primary mt-2" onClick={handleAddProduct}>Add Product</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td><img src={product.imageUrl} alt={product.name} width="50" /></td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
