document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop();

    let sidebarPath = '';
    
    // Check for student pages
    if (path.includes('/dashboard/') && !path.includes('/dashboard/teacher/') && !path.includes('/dashboard/parent/')) {
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
    // Check for parent pages
    else if (path.includes('/dashboard/parent/')) {
        const parentPages = ['parent.html', 'academic-health.html', 'attendance-report.html', 'communication-parent.html', 'schedule-meeting.html'];
        if (parentPages.includes(currentPage)) {
            sidebarPath = '../../const/leftsidebar-parent.html';
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
    } else if (currentPage === 'my-classes.html') {
        initializeMyClassesPage();
    } else if (currentPage === 'assign-tasks.html') {
        initializeAssignTasksPage();
    } else if (currentPage === 'student-reports.html') {
        initializeStudentReportsPage();
    } else if (currentPage === 'communication.html') {
        initializeCommunicationPage();
    } else if (currentPage === 'parent.html') {
        initializeParentDashboard();
    } else if (currentPage === 'academic-health.html') {
        initializeAcademicHealthPage();
    } else if (currentPage === 'attendance-report.html') {
        initializeAttendanceReportPage();
    } else if (currentPage === 'communication-parent.html') {
        initializeCommunicationParentPage();
    } else if (currentPage === 'schedule-meeting.html') {
        initializeScheduleMeetingPage();
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
        const linkHref = link.getAttribute('href');
        if (linkHref) {
            const linkPage = linkHref.split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('bg-indigo-600', 'text-white', 'font-semibold');
                link.classList.remove('text-slate-600', 'font-medium');
            } else {
                link.classList.remove('bg-indigo-600', 'text-white', 'font-semibold');
                link.classList.add('text-slate-600', 'font-medium');
            }
        }
    });
}


function navigateTo(page) {
    // This function assumes navigation is within the same directory level
    window.location.href = page;
}

function logout() {
    const path = window.location.pathname;
    if (path.includes('/dashboard/teacher/') || path.includes('/dashboard/parent/')) {
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

// --- Teacher Dashboard - My Classes Page Functions ---

const mockStudents = [
    { id: 'S1001', name: 'John Doe', email: 'john.d@example.com', grades: { assign1: '85', midterm: '90', final: 'A' } },
    { id: 'S1002', name: 'Jane Smith', email: 'jane.s@example.com', grades: { assign1: '92', midterm: '88', final: 'A-' } },
    { id: 'S1003', name: 'Peter Jones', email: 'peter.j@example.com', grades: { assign1: '78', midterm: '82', final: 'B' } },
    { id: 'S1004', name: 'Emily White', email: 'emily.w@example.com', grades: { assign1: '95', midterm: '94', final: 'A+' } }
];

function initializeMyClassesPage() {
    renderStudentRoster();
    renderStudentAttendance();
    renderStudentGrades();

    const datePicker = document.getElementById('attendance-date');
    if (datePicker) {
        // Set default date to today
        datePicker.valueAsDate = new Date();
    }
}

function changeTab(event, tabId) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.remove('hidden');

    // Activate the clicked tab button
    event.currentTarget.classList.add('active');
}

function renderStudentRoster() {
    const rosterList = document.getElementById('student-roster-list');
    if (!rosterList) return;
    rosterList.innerHTML = mockStudents.map(student => `
        <tr class="text-sm text-slate-700">
            <td class="p-4 font-medium">${student.name}</td>
            <td class="p-4 text-slate-500">${student.id}</td>
            <td class="p-4">
                <button class="text-indigo-600 hover:underline text-xs font-semibold">Edit</button>
            </td>
        </tr>
    `).join('');
}

function renderStudentAttendance() {
    const attendanceList = document.getElementById('attendance-student-list');
    if (!attendanceList) return;
    attendanceList.innerHTML = mockStudents.map(student => `
        <div class="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <p class="font-medium">${student.name}</p>
            <label class="inline-flex items-center cursor-pointer">
                <span class="mr-3 text-sm font-medium text-slate-900">Present</span>
                <input type="checkbox" value="" class="sr-only peer" checked>
                <div class="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    `).join('');
}


function renderStudentGrades() {
    const gradesList = document.getElementById('grades-student-list');
    if (!gradesList) return;
    gradesList.innerHTML = mockStudents.map(student => `
        <tr class="text-sm text-slate-700">
            <td class="p-4 font-medium">${student.name}</td>
            <td class="p-4"><input type="text" value="${student.grades.assign1}" class="w-20 p-1 border rounded"></td>
            <td class="p-4"><input type="text" value="${student.grades.midterm}" class="w-20 p-1 border rounded"></td>
            <td class="p-4"><input type="text" value="${student.grades.final}" class="w-20 p-1 border rounded"></td>
            <td class="p-4">
                <button class="text-indigo-600 hover:underline text-xs font-semibold">Save</button>
            </td>
        </tr>
    `).join('');
}


function openAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// --- Teacher Dashboard - Assign Tasks Page Functions ---

function initializeAssignTasksPage() {
    renderAssignedTasks();
    const dueDate = document.getElementById('task-due-date');
    if (dueDate) {
        // Set a default due date, e.g., one week from today
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dueDate.valueAsDate = nextWeek;
    }
}

function renderAssignedTasks() {
    const container = document.getElementById('assigned-tasks-list');
    if (!container) return;
    const tasks = [
        { title: 'Algebra Worksheet 1', class: 'Class 10B', dueDate: '2025-10-10', status: 'Graded' },
        { title: 'Essay: The Roman Empire', class: 'Class 9A', dueDate: '2025-10-12', status: 'Pending' },
        { title: 'Geometry Proofs', class: 'Class 10B', dueDate: '2025-10-15', status: 'Pending' },
    ];
    container.innerHTML = tasks.map(task => `
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
                <p class="font-bold text-slate-800">${task.title}</p>
                <p class="text-sm text-slate-500">For ${task.class} | Due: ${task.dueDate}</p>
            </div>
            <div class="flex items-center gap-4">
                 <span class="px-3 py-1 text-xs font-semibold rounded-full ${task.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${task.status}</span>
                <button class="text-indigo-600 hover:underline text-xs font-semibold">View Submissions</button>
            </div>
        </div>
    `).join('');
}

// --- Teacher Dashboard - Student Reports Page Functions ---
let reportChartInstance = null; // To hold the chart instance

function initializeStudentReportsPage() {
    const container = document.getElementById('student-reports-list');
    if (!container) return;

    // We're using a placeholder student ID '1' for now.
    // In a real app, this would loop through all students in the class.
    const student = { id: 'student_1', name: 'Alex Johnson' }; // Example student
    const reportData = localStorage.getItem(`psychometricResult_${student.id}`);
    
    let content = '';
    if (reportData) {
        const result = JSON.parse(reportData);
        content = `
            <div class="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                    <p class="font-bold text-slate-800">${result.name}</p>
                    <p class="text-sm text-slate-500">Last Assessment: ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${result.riskLevel === 'High Risk' ? 'bg-red-200 text-red-800' : result.riskLevel === 'Medium Risk' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}">${result.riskLevel}</span>
                    <button onclick="openReportModal('${student.id}')" class="bg-indigo-600 text-white font-semibold px-4 py-2 text-sm rounded-lg hover:bg-indigo-700">View Full Report</button>
                </div>
            </div>`;
    } else {
        content = `
            <div class="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p class="font-bold text-slate-800">${student.name}</p>
                <p class="text-slate-500">No assessment data found.</p>
            </div>`;
    }
    // This is just a demo for one student. You would loop for all students.
    container.innerHTML = content + `
        <div class="text-center text-slate-400 p-4">More student reports would appear here...</div>
    `;
}

function openReportModal(studentId) {
    const reportData = localStorage.getItem(`psychometricResult_${studentId}`);
    if (!reportData) {
        alert("No report data found for this student.");
        return;
    }
    const result = JSON.parse(reportData);

    document.getElementById('report-modal-student-name').textContent = result.name;
    const riskLevelEl = document.getElementById('report-modal-risk-level');
    riskLevelEl.textContent = result.riskLevel;
    riskLevelEl.className = `text-2xl font-bold ${result.riskLevel === 'High Risk' ? 'text-red-500' : result.riskLevel === 'Medium Risk' ? 'text-amber-500' : 'text-green-500'}`;

    document.getElementById('report-modal-risk-percentage').textContent = `${result.riskPercentage}%`;
    
    const modal = document.getElementById('report-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const ctx = document.getElementById("report-chart").getContext("2d");
    if (reportChartInstance) {
        reportChartInstance.destroy();
    }
    reportChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: result.categoryScores.map(item => item.category),
            datasets: [{
                label: "Risk Score by Category (%)",
                data: result.categoryScores.map(item => item.score),
                backgroundColor: "rgba(79, 70, 229, 0.5)",
                borderColor: "rgba(79, 70, 229, 1)",
                borderWidth: 1
            }],
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } }
        },
    });
}

function closeReportModal() {
    const modal = document.getElementById('report-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function contactParent() {
    alert("Contacting parent feature would be implemented here.");
}

// --- Teacher Dashboard - Communication Page Functions ---

function initializeCommunicationPage() {
    renderCommunicationStudentList();
}

function renderCommunicationStudentList() {
    const container = document.getElementById('communication-student-list');
    if (!container) return;
    
    container.innerHTML = mockStudents.map(student => `
        <div onclick="selectStudentForChat('${student.id}')" class="flex items-center gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer">
            <img src="https://placehold.co/40x40/E0E7FF/4338CA?text=${student.name.charAt(0)}" alt="${student.name}" class="w-10 h-10 rounded-full">
            <div>
                <p class="font-bold text-slate-800">${student.name}</p>
                <p class="text-sm text-slate-500">Parent: John Doe Sr.</p>
            </div>
        </div>
    `).join('');
}

function selectStudentForChat(studentId) {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return;

    const chatView = document.getElementById('communication-chat-view');
    if (!chatView) return;

    chatView.innerHTML = `
        <!-- Chat Header -->
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-lg">${student.name}</h3>
                <p class="text-sm text-slate-500">Parent Contact: parent.${student.name.split(' ')[0].toLowerCase()}@example.com</p>
            </div>
            <button class="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 text-sm">Schedule Meeting</button>
        </div>

        <!-- Message History -->
        <div class="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
            <!-- Received Message -->
            <div class="flex items-start gap-3">
                <img src="https://placehold.co/32x32/E0E7FF/4338CA?text=P" alt="Parent" class="w-8 h-8 rounded-full">
                <div class="bg-white p-3 rounded-lg max-w-md shadow-sm border border-slate-200">
                    <p class="text-sm">Hello, I saw the alert about John's recent grades. Can we discuss this?</p>
                </div>
            </div>
            <!-- Sent Message -->
            <div class="flex items-start gap-3 flex-row-reverse">
                <img src="https://placehold.co/32x32/FEF3C7/92400E?text=T" alt="Teacher" class="w-8 h-8 rounded-full">
                <div class="bg-indigo-600 text-white p-3 rounded-lg max-w-md shadow-sm">
                    <p class="text-sm">Of course. I'm available tomorrow afternoon. I've also assigned him some extra resources on the portal that might help.</p>
                </div>
            </div>
        </div>

        <!-- Message Input -->
        <div class="p-4 bg-white border-t border-slate-200">
            <div class="relative">
                <input type="text" placeholder="Type your message..." class="w-full px-4 py-3 pr-16 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    `;
}

// --- Parent Dashboard Functions ---

function initializeParentDashboard() {
    renderAcademicHealthDial(); // Re-uses the student's dial function
    renderConversationStarters();
    renderCelebrateWins();
}

function initializeAcademicHealthPage() {
    const ctx = document.getElementById('parentGradeChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: "John's Overall Grade",
                data: [65, 70, 75, 72, 80, 85], // Same data as student for demo
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

function initializeAttendanceReportPage() {
    const container = document.getElementById('attendance-report-container');
    if (!container) return;
    const attendance = [
        { date: '2025-10-01', status: 'Present' },
        { date: '2025-09-30', status: 'Present' },
        { date: '2025-09-29', status: 'Absent' },
        { date: '2025-09-28', status: 'Present' },
    ];
    container.innerHTML = attendance.map(item => `
        <div class="flex items-center justify-between p-3 rounded-lg ${item.status === 'Present' ? 'bg-green-50' : 'bg-red-50'}">
            <p class="font-medium text-slate-700">${item.date}</p>
            <span class="font-semibold ${item.status === 'Present' ? 'text-green-700' : 'text-red-700'}">${item.status}</span>
        </div>
    `).join('');
}

function initializeCommunicationParentPage() {
    const chatView = document.getElementById('parent-chat-view');
    if (!chatView) return;
    // This renders the initial view of the chat for the parent.
    chatView.innerHTML = `
        <div class="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
            <!-- Sent Message -->
            <div class="flex items-start gap-3 flex-row-reverse">
                <img src="https://placehold.co/32x32/E0E7FF/4338CA?text=P" alt="Parent" class="w-8 h-8 rounded-full">
                 <div class="bg-indigo-600 text-white p-3 rounded-lg max-w-md shadow-sm">
                    <p class="text-sm">Hello, I saw the alert about John's recent grades. Can we discuss this?</p>
                </div>
            </div>
            <!-- Received Message -->
             <div class="flex items-start gap-3">
                <img src="https://placehold.co/32x32/FEF3C7/92400E?text=T" alt="Teacher" class="w-8 h-8 rounded-full">
                <div class="bg-white p-3 rounded-lg max-w-md shadow-sm border border-slate-200">
                    <p class="text-sm">Of course. I'm available tomorrow afternoon. I've also assigned him some extra resources on the portal that might help.</p>
                </div>
            </div>
        </div>
        <div class="p-4 bg-white border-t border-slate-200">
            <div class="relative">
                <input type="text" placeholder="Type your message to Mr. Keton..." class="w-full px-4 py-3 pr-16 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    `;
}


function initializeScheduleMeetingPage() {
    const datePicker = document.getElementById('meeting-date');
    if (datePicker) {
        // Set a default date, e.g., tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        datePicker.valueAsDate = tomorrow;
    }
}


function renderConversationStarters() {
    const container = document.getElementById('conversation-starters-list');
    if (!container) return;
    const starters = [
        "We noticed John's attendance was low in Math. A good way to talk about this is to ask, 'How are things going in your math class lately?'",
        "John's grade in History has improved! Try saying, 'I saw your new History grade, that's fantastic work!'"
    ];
    container.innerHTML = starters.map(s => `
        <div class="bg-slate-100 p-3 rounded-lg text-sm text-slate-700">
            <p>${s}</p>
        </div>
    `).join('');
}

function renderCelebrateWins() {
    const container = document.getElementById('celebrate-wins-list');
    if (!container) return;
    const wins = [
        "Great news! John's score in History has improved by 10% this month!",
        "John received positive feedback on his recent English essay."
    ];
     container.innerHTML = wins.map(t => `
        <div class="bg-green-100 border-l-4 border-green-500 text-green-800 p-3 rounded-r-lg">
            <p class="font-semibold text-sm">${t}</p>
        </div>
    `).join('');
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

