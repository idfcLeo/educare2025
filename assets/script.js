document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop();

    let sidebarPath = '';
    
    // Check for student pages
    if (path.includes('/dashboard/') && !path.includes('/dashboard/teacher/')) {
        const studentPages = ['student.html', 'classes.html', 'attendance.html', 'resources.html', 'learning-plan.html'];
        if (studentPages.includes(currentPage)) {
            sidebarPath = '../const/leftsidebar.html';
        }
    } 
    // Check for teacher pages
    else if (path.includes('/dashboard/teacher/')) {
        const teacherPages = ['teacher.html', 'my-classes.html', 'assign-tasks.html', 'student-reports.html', 'communication.html'];
        if (teacherPages.includes(currentPage)) {
            sidebarPath = '../../const/leftsidebar-teacher.html';
        }
    }

    if (sidebarPath) {
        loadSidebar(sidebarPath, currentPage);
    }

    // Page-specific initializations
    if (currentPage === 'student.html') {
        renderGradesChart();
        renderAcademicHealthDial();
        renderGoals();
        renderAchievements();
    } else if (currentPage === 'teacher.html') {
        renderAtRiskStudents();
        renderCohortAnalysisChart();
        renderPositiveTrends();
    } else if (currentPage === 'index.html') {
        setupLoginDropdown();
    }
});

function loadSidebar(path, currentPage) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;
                setActiveLink(currentPage);
            }
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            const sidebarContainer = document.getElementById('sidebar-container');
            if(sidebarContainer) {
                sidebarContainer.innerHTML = '<p class="text-red-500">Error loading navigation.</p>';
            }
        });
}


function setActiveLink(currentPage) {
    const navLinks = document.querySelectorAll('#sidebar-nav a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('bg-indigo-600', 'text-white', 'font-semibold');
            link.classList.remove('text-slate-600', 'font-medium');
        } else {
            link.classList.remove('bg-indigo-600', 'text-white', 'font-semibold');
            link.classList.add('text-slate-600', 'font-medium');
        }
    });
}

function navigateTo(page) {
    // This function assumes navigation is within the same directory level
    window.location.href = page;
}

function logout() {
    const path = window.location.pathname;
    if (path.includes('/dashboard/teacher/')) {
        window.location.href = '../../index.html';
    } else if (path.includes('/dashboard/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// --- Student Dashboard Functions ---

function renderGradesChart() {
    const ctx = document.getElementById('gradesChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Overall Grade',
                data: [65, 70, 75, 72, 80, 85],
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderAcademicHealthDial() {
    const container = document.querySelector('.dial-container');
    if (!container) return;

    // Clear previous
    container.innerHTML = `
        <div class="dial">
             <div class="dial-needle"></div>
        </div>
        <div class="dial-label">Good</div>
    `;

    const riskLevel = "Good"; // Example: Can be 'Good', 'Moderate', 'High'
    const needle = container.querySelector('.dial-needle');
    const label = container.querySelector('.dial-label');
    
    let rotation = -90;
    if (riskLevel === "Moderate") rotation = 0;
    if (riskLevel === "High") rotation = 90;

    needle.style.transform = `rotate(${rotation}deg)`;
    label.textContent = riskLevel;
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    if (!goalsList) return;
    const goals = ['Complete Math Assignment', 'Review History Notes', 'Practice Chemistry Problems'];
    goalsList.innerHTML = goals.map(goal => `
        <div class="flex items-center bg-slate-100 p-2 rounded-lg">
            <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <span class="ml-3 text-sm font-medium text-slate-700">${goal}</span>
        </div>
    `).join('');
}

function addGoal() {
    const input = document.getElementById('new-goal-input');
    const goalsList = document.getElementById('goals-list');
    if (input && goalsList && input.value.trim() !== '') {
        const newGoal = document.createElement('div');
        newGoal.className = "flex items-center bg-slate-100 p-2 rounded-lg";
        newGoal.innerHTML = `
            <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <span class="ml-3 text-sm font-medium text-slate-700">${input.value.trim()}</span>
        `;
        goalsList.appendChild(newGoal);
        input.value = '';
    }
}


function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;
    const achievements = [
        { icon: '🏆', title: 'Top Performer' },
        { icon: '✅', title: 'Perfect Attendance' },
        { icon: '💡', title: 'Creative Thinker' }
    ];
    achievementsList.innerHTML = achievements.map(ach => `
        <div class="text-center">
            <div class="text-3xl">${ach.icon}</div>
            <p class="text-xs text-slate-500 mt-1">${ach.title}</p>
        </div>
    `).join('');
}

// --- Teacher Dashboard Functions ---

function renderAtRiskStudents() {
    const container = document.getElementById('at-risk-students-list');
    if (!container) return;
    const students = [
        { name: 'John Doe', risk: 'High', reason: 'Low Attendance' },
        { name: 'Jane Smith', risk: 'Medium', reason: 'Falling Grades' },
        { name: 'Peter Jones', risk: 'High', reason: 'Multiple Factors' }
    ];
    container.innerHTML = students.map(s => `
        <div class="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <div>
                <p class="font-bold">${s.name}</p>
                <p class="text-sm text-slate-600">${s.reason}</p>
            </div>
            <div class="flex items-center gap-4">
                <span class="px-3 py-1 text-xs font-semibold rounded-full ${s.risk === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}">${s.risk} Risk</span>
                <button onclick="openModal('${s.name}')" class="bg-indigo-600 text-white font-semibold px-4 py-2 text-sm rounded-lg hover:bg-indigo-700">View Plan</button>
            </div>
        </div>
    `).join('');
}

function renderCohortAnalysisChart() {
    const ctx = document.getElementById('cohortAnalysisChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Math', 'Science', 'History', 'English', 'Art'],
            datasets: [{
                label: 'Average Score',
                data: [78, 85, 72, 88, 92],
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderPositiveTrends() {
    const container = document.getElementById('positive-trends-list');
    if (!container) return;
    const trends = [
        '<strong>Emily White</strong> has improved her Math score by 15%.',
        '<strong>Michael Brown</strong> achieved perfect attendance this month.',
        '<strong>Class 10B</strong>\'s average engagement score is up by 10%.'
    ];
    container.innerHTML = trends.map(t => `
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-r-lg">
            <p class="text-sm">${t}</p>
        </div>
    `).join('');
}

function openModal(studentName) {
    document.getElementById('modal-student-name').textContent = `Plan for ${studentName}`;
    const planList = document.getElementById('intervention-plan-list');
    planList.innerHTML = `
        <li>Schedule a 5-minute check-in.</li>
        <li>Recommend the 'Chemical Bonding' online module.</li>
        <li>Send a pre-written positive encouragement email.</li>
    `;
    document.getElementById('intervention-modal').classList.remove('hidden');
    document.getElementById('intervention-modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('intervention-modal').classList.add('hidden');
    document.getElementById('intervention-modal').classList.remove('flex');
}

// --- Home Page Functions ---

function setupLoginDropdown() {
    const loginButton = document.getElementById('login-button');
    const loginDropdown = document.getElementById('login-dropdown');

    if (loginButton && loginDropdown) {
        loginButton.addEventListener('click', () => {
            loginDropdown.classList.toggle('hidden');
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', function(event) {
            if (!loginButton.contains(event.target) && !loginDropdown.contains(event.target)) {
                loginDropdown.classList.add('hidden');
            }
        });
    }
}

