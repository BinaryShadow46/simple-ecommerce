document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadOrderSummary();
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', placeOrder);
    }
});

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    orderItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    document.getElementById('order-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}

function placeOrder(e) {
    e.preventDefault();
    
    // In a real application, you would send this data to a server
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        card: document.getElementById('card').value,
        expiry: document.getElementById('expiry').value,
        cvv: document.getElementById('cvv').value
    };
    
    // Validate form (basic validation)
    if (!validateForm(formData)) {
        alert('Please fill in all fields correctly');
        return;
    }
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Show success message
    alert('Thank you for your order! Your order has been placed successfully.');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

function validateForm(data) {
    // Basic validation
    if (!data.name || !data.email || !data.address || !data.city || !data.zip || !data.card || !data.expiry || !data.cvv) {
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Card number validation (simple check)
    if (data.card.replace(/\s/g, '').length !== 16) {
        return false;
    }
    
    return true;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}
