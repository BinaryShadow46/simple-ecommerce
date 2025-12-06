// Load featured products on home page
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();
});

async function loadFeaturedProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const featuredProducts = data.products.filter(product => product.featured);
        
        const productsGrid = document.getElementById('featured-products');
        if (productsGrid) {
            productsGrid.innerHTML = featuredProducts.slice(0, 4).map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to add-to-cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function addToCart(productId) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            if (!product) return;
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('Product added to cart!');
        });
}
