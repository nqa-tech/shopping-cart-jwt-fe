import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductPage = () => {
    const [products, setProducts] = useState([{ id: 1, name: 'd', price: 1, imageUrl: '' }]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-5">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td><img src={product.imageUrl} alt={product.name} width="50" /></td>
                            <td>
                                <button className='btn btn-primary'>Add to cart</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductPage;
