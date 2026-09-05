
// ===========================
// DASHBOARD
// ===========================

// Require authentication
requireAuth();

// Load user data on page load
window.addEventListener('load', () => {
    loadUserProfile();
    loadDashboardStats();
    setupSectionNavigation();
});

// Load user profile
function loadUserProfile() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('user-name').textContent = user.name || 'User';
        document.getElementById('user-email').textContent = user.email || 'user@example.com';
    }
}

// Load dashboard statistics
function loadDashboardStats() {
    // Call your backend API to get stats
    fetch('/api/dashboard/stats', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById('stat-visitors').textContent = (data.visitors || 0).toLocaleString();
            document.getElementById('stat-revenue').textContent = '$' + (data.revenue || 0).toFixed(2);
            document.getElementById('stat-orders').textContent = (data.orders || 0).toLocaleString();
            document.getElementById('stat-rating').textContent = (data.rating || 4.8) + '/5';
        }
    })
    .catch(err => console.error('Error loading stats:', err));
}

// Setup section navigation
function setupSectionNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Hide all sections
            const sections = document.querySelectorAll('.dashboard-section');
            sections.forEach(s => s.classList.remove('active'));

            // Show selected section
            const sectionId = item.dataset.section + '-section';
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');

                // Load section-specific data
                if (item.dataset.section === 'analytics') {
                    loadAnalytics();
                } else if (item.dataset.section === 'products') {
                    loadProducts();
                } else if (item.dataset.section === 'billing') {
                    loadBilling();
                }
            }
        });
    });
}

// Load analytics
function loadAnalytics() {
    console.log('Loading analytics...');
    fetch('/api/dashboard/analytics', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Render charts with data
            console.log('Analytics data:', data);
        }
    })
    .catch(err => console.error('Error loading analytics:', err));
}

// Load products
function loadProducts() {
    console.log('Loading products...');
    fetch('/api/dashboard/products', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const productsList = document.getElementById('products-list');
            if (data.products && data.products.length > 0) {
                productsList.innerHTML = data.products.map(p => `
                    <div class="product-item">
                        <h4>${p.name}</h4>
                        <p>${p.description}</p>
                        <a href="${p.url}" target="_blank">View Live</a>
                    </div>
                `).join('');
            } else {
                productsList.innerHTML = '<p>No products yet. <a href="#">Create one</a></p>';
            }
        }
    })
    .catch(err => console.error('Error loading products:', err));
}

// Load billing
function loadBilling() {
    console.log('Loading billing info...');
    fetch('/api/dashboard/billing', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById('current-plan').textContent = data.plan || 'Pro Plan';
            document.getElementById('plan-price').textContent = '$' + (data.price || 99) + '/month';
            document.getElementById('renewal-date').textContent = 'Renews on ' + (data.renewal_date || '2026-10-01');
        }
    })
    .catch(err => console.error('Error loading billing:', err));
}

// Select pricing plan
function selectPlan(planName) {
    console.log('Selecting plan:', planName);

    // Create Stripe checkout session
    fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify({ plan: planName })
    })
    .then(res => res.json())
    .then(data => {
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        }
    })
    .catch(err => console.error('Error creating checkout:', err));
}
