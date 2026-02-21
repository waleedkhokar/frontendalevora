const API_URL = 'http://localhost:5000/api';

// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// Fetch single product
export const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

// Add to cart (requires authentication)
export const addToCart = async (productId, quantity, token) => {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { error: 'Failed to add to cart' };
    }
};