// Simple redirect nav
function goTo(page) {
    window.location.href = page;
}

// Example login JS
document.addEventListener("DOMContentLoaded", function() {
    // Add JS for other forms/pages here

    // Sample login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login attempted!');
            // Integrate your backend API here
        });
    }

    // Sample signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Signup attempted!');
            // Integrate your backend API here
        });
    }
    // Repeat similar for other forms
});
