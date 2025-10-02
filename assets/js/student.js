// --- Shared Navigation & Logout ---
function navigateTo(page) {
    window.location.href = page;
}

function logout() {
    console.log('User logged out');
    // In a real app, you would clear session/local storage here
    window.location.href = '../index.html'; // Redirect to a login or home page
}

// --- Sidebar Active Link Handler ---
document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname.split("/").pop();
    if (!currentPath) return;

    const navLinks = document.querySelectorAll("#sidebar-nav a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href").split("/").pop();
        
        // Remove active class from all links first
        link.classList.remove('active');

        // Add active class to the matching link
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});

