// --- Shared Navigation & Logout ---
function navigateTo(page) {
    // Add a class to trigger the fade-out animation
    document.body.classList.add('body-fade-out');
    
    // Wait for the animation to finish, then change the page
    setTimeout(() => {
        window.location.href = page;
    }, 300); // This duration must match the animation time in your style.css
}

function logout() {
    console.log('User logged out');
    navigateTo('../index.html'); // Use the transition for logging out
}

// --- Page Load Animation ---
document.addEventListener("DOMContentLoaded", function() {
    // This class triggers the fade-in animation defined in your style.css
    document.body.classList.add('body-fade-in');
});