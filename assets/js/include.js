document.addEventListener('DOMContentLoaded', () => {
    // Function to activate the correct sidebar link based on the current page
    const activateSidebarLink = () => {
        const currentPath = window.location.pathname.split("/").pop();
        if (!currentPath) return;

        const navLinks = document.querySelectorAll("#sidebar-nav a");
        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href").split("/").pop();
            link.classList.remove('active');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };

    // Find the placeholder div in your HTML and fetch the sidebar content
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        // The path is relative to the HTML file that's loading the script
        fetch('student_sidebar.html')
            .then(response => {
                if (!response.ok) throw new Error('Sidebar HTML not found');
                return response.text();
            })
            .then(data => {
                sidebarPlaceholder.innerHTML = data;
                // Now that the sidebar is loaded, run the function to highlight the active link
                activateSidebarLink();
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
});