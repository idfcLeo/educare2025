document.addEventListener('DOMContentLoaded', () => {
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

    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        fetch('teacher_sidebar.html')
            .then(response => response.ok ? response.text() : Promise.reject('Sidebar not found'))
            .then(data => {
                sidebarPlaceholder.innerHTML = data;
                activateSidebarLink();
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
});
