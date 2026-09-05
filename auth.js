
// ===========================
// AUTHENTICATION
// ===========================

// Toggle between login and signup forms
document.getElementById('toggle-form')?.addEventListener('click', (e) => {
    e.preventDefault();
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleText = document.getElementById('toggle-form-text');

    if (loginForm.classList.contains('active-form')) {
        loginForm.classList.remove('active-form');
        signupForm.classList.add('active-form');
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-form">Login</a>';
    } else {
        signupForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-form">Sign up</a>';
    }

    // Re-attach event listener to new toggle button
    document.getElementById('toggle-form').addEventListener('click', arguments.callee);
});

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log('Login attempt:', { email });

    // Call your backend API
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('auth_token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    })
    .catch(err => console.error('Login error:', err));
});

// Handle signup form submission
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Passwords do not match');
        return;
    }

    console.log('Signup attempt:', { name, email });

    // Call your backend API
    fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('auth_token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Signup failed: ' + data.error);
        }
    })
    .catch(err => console.error('Signup error:', err));
});

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('auth_token');
}

// Get current user from token
function getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
        // Decode JWT token (if using JWT)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
}

// Logout
function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'landing.html';
}

document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Redirect to login if not authenticated (for protected pages)
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Login with Google OAuth
function loginWithGoogle() {
    // Implement Google OAuth flow
    // This would typically redirect to your backend's OAuth endpoint
    console.log('Google login initiated');
    fetch('/api/auth/google')
        .then(res => res.json())
        .then(data => {
            window.location.href = data.auth_url;
        });
}

// Set plan from URL params
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
        console.log('Selected plan:', plan);
    }
});
