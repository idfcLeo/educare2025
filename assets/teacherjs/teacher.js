// --- Shared Navigation & Logout ---
function navigateTo(page) {
    document.body.classList.add('body-fade-out');
    setTimeout(() => { window.location.href = page; }, 300);
}

function logout() {
    console.log('User logged out');
    navigateTo('../../index.html');
}

// --- Page Load & Conditional Rendering ---
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('body-fade-in');
    
    // Run functions based on the elements present on the current page
    if (document.getElementById('at-risk-students-list')) { // For Teacher Dashboard
        renderAtRiskStudents();
        renderPositiveTrends();
        renderCohortChart();
    }
    if (document.getElementById('student-reports-list')) { // For Student Reports
        renderStudentReports();
    }
    if (document.getElementById('student-roster-list')) { // For "My Classes"
        renderClassContent();
    }
    if (document.getElementById('communication-student-list')) { // For Communication
        renderStudentConversationList();
    }
    if (document.getElementById('assigned-tasks-list')) { // For Assign Tasks
        renderAssignedTasks();
        const createTaskForm = document.getElementById('create-task-form');
        if(createTaskForm) {
            createTaskForm.addEventListener('submit', handleTaskFormSubmit);
        }
    }
});

// --- Teacher Dashboard Logic ---
const atRiskStudents = [
    { name: 'John Doe', subject: 'Mathematics', reason: 'Low test scores', plan: ['Schedule 1-on-1 tutoring.', 'Provide extra practice worksheets.', 'Send progress update to parents.'] },
    { name: 'Jane Smith', subject: 'Science', reason: 'Missing assignments', plan: ['Check for understanding of concepts.', 'Break down large assignments into smaller tasks.', 'Set up a weekly check-in.'] },
    { name: 'Peter Jones', subject: 'English', reason: 'Low participation', plan: ['Encourage participation in group discussions.', 'Assign a short presentation on a topic of interest.', 'Provide positive reinforcement.'] }
];
const positiveTrends = [
    { name: 'Alice Williams', subject: 'History', trend: 'Improved her last test score by 15%.' },
    { name: 'Michael Brown', subject: 'Science', trend: 'Has submitted all assignments on time this month.' }
];

function renderAtRiskStudents() {
    const atRiskList = document.getElementById('at-risk-students-list');
    if (!atRiskList) return;
    atRiskList.innerHTML = '';
    atRiskStudents.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-red-50 rounded-lg';
        div.innerHTML = `
            <div>
                <p class="font-semibold text-gray-800">${student.name}</p>
                <p class="text-sm text-red-600">Issue in: ${student.subject} (${student.reason})</p>
            </div>
            <button onclick="openModal(${index})" class="bg-red-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-red-600 transition">View Plan</button>
        `;
        atRiskList.appendChild(div);
    });
}

function renderPositiveTrends() {
    const positiveTrendsList = document.getElementById('positive-trends-list');
    if (!positiveTrendsList) return;
    positiveTrendsList.innerHTML = '';
    positiveTrends.forEach(student => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 bg-green-50 rounded-lg';
        div.innerHTML = `<i class="fas fa-arrow-trend-up text-green-500"></i><div><p class="font-semibold text-gray-800">${student.name}</p><p class="text-sm text-green-600">${student.trend}</p></div>`;
        positiveTrendsList.appendChild(div);
    });
}

function openModal(index) {
    const modal = document.getElementById('intervention-modal');
    const student = atRiskStudents[index];
    document.getElementById('modal-student-name').textContent = `Intervention Plan for ${student.name}`;
    const planList = document.getElementById('intervention-plan-list');
    planList.innerHTML = '';
    student.plan.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        planList.appendChild(li);
    });
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('intervention-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function renderCohortChart() {
    const ctx = document.getElementById('cohortAnalysisChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mathematics', 'Science', 'English', 'History'],
            datasets: [{ label: 'Average Score', data: [78, 85, 82, 88], backgroundColor: 'rgba(79, 70, 229, 0.8)', borderRadius: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}

// --- Student Reports Logic ---
const studentReportsData = [
    { name: 'John Doe', riskLevel: 'Moderate', riskPercentage: 55, scores: { Motivation: 60, 'Time Mgmt': 40, 'Support System': 75, 'Stress Levels': 50, 'Environment': 45 }},
    { name: 'Jane Smith', riskLevel: 'Low', riskPercentage: 25, scores: { Motivation: 85, 'Time Mgmt': 70, 'Support System': 90, 'Stress Levels': 80, 'Environment': 75 }},
    { name: 'Peter Jones', riskLevel: 'High', riskPercentage: 80, scores: { Motivation: 30, 'Time Mgmt': 25, 'Support System': 50, 'Stress Levels': 20, 'Environment': 35 }}
];
let reportChartInstance = null;

function renderStudentReports() {
    const reportsListContainer = document.getElementById('student-reports-list');
    if (!reportsListContainer) return;
    reportsListContainer.innerHTML = '';
    studentReportsData.forEach((report, index) => {
        const riskColor = getRiskColor(report.riskLevel);
        const div = document.createElement('div');
        div.className = `flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 ${riskColor.border}`;
        div.innerHTML = `<div><p class="font-semibold text-gray-800">${report.name}</p><p class="text-sm ${riskColor.text}">Risk Level: ${report.riskLevel}</p></div><button onclick="openReportModal(${index})" class="bg-indigo-600 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-indigo-700 transition">View Full Report</button>`;
        reportsListContainer.appendChild(div);
    });
}

function openReportModal(index) {
    const modal = document.getElementById('report-modal');
    const report = studentReportsData[index];
    const riskColor = getRiskColor(report.riskLevel);
    document.getElementById('report-modal-student-name').textContent = report.name;
    const modalRiskLevel = document.getElementById('report-modal-risk-level');
    const modalRiskPercentage = document.getElementById('report-modal-risk-percentage');
    modalRiskLevel.textContent = report.riskLevel;
    modalRiskPercentage.textContent = `${report.riskPercentage}%`;
    modalRiskLevel.className = `text-2xl font-bold ${riskColor.text}`;
    modalRiskPercentage.className = `text-2xl font-bold ${riskColor.text}`;
    renderReportChart(report.scores);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
    document.getElementById('report-modal').classList.remove('flex');
}

function renderReportChart(scores) {
    if (reportChartInstance) reportChartInstance.destroy();
    const chartCanvas = document.getElementById('report-chart');
    reportChartInstance = new Chart(chartCanvas, {
        type: 'radar',
        data: { labels: Object.keys(scores), datasets: [{ label: 'Category Score', data: Object.values(scores), backgroundColor: 'rgba(79, 70, 229, 0.2)', borderColor: 'rgba(79, 70, 229, 1)' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } }
    });
}

function contactParent() {
    alert('Contacting parent for ' + document.getElementById('report-modal-student-name').textContent + '...');
}

function getRiskColor(riskLevel) {
    switch (riskLevel) {
        case 'High': return { text: 'text-red-600', border: 'border-red-400' };
        case 'Moderate': return { text: 'text-yellow-600', border: 'border-yellow-400' };
        default: return { text: 'text-green-600', border: 'border-green-400' };
    }
}

// --- My Classes Logic ---
const classData = {
    '10B-Math': { students: [{ id: '10B-001', name: 'Alice Williams', grades: { 'Assignment 1': 'A', 'Mid-Term': 'B+', 'Final': '' } }, { id: '10B-002', name: 'Michael Brown', grades: { 'Assignment 1': 'B', 'Mid-Term': 'A-', 'Final': '' } }], attendance: {} },
    '9A-Hist': { students: [{ id: '9A-001', name: 'David Garcia', grades: { 'Essay 1': 'B+', 'Mid-Term': 'B', 'Final': '' } }], attendance: {} }
};

function renderClassContent() {
    const currentClass = classData['10B-Math']; 
    renderStudentRoster(currentClass.students);
    renderAttendanceList(currentClass.students);
    renderGradesList(currentClass.students);
}

function renderStudentRoster(students) {
    const list = document.getElementById('student-roster-list');
    if(!list) return;
    list.innerHTML = '';
    students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-4">${s.name}</td><td class="p-4">${s.id}</td><td class="p-4"><button class="text-red-500">Remove</button></td>`;
        list.appendChild(tr);
    });
}

function renderAttendanceList(students) {
    const list = document.getElementById('attendance-student-list');
    if(!list) return;
    list.innerHTML = '';
    students.forEach(s => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center';
        div.innerHTML = `<p>${s.name}</p><div><input type="radio" name="att-${s.id}" checked> P <input type="radio" name="att-${s.id}"> A <input type="radio" name="att-${s.id}"> T</div>`;
        list.appendChild(div);
    });
}

function renderGradesList(students) {
    const list = document.getElementById('grades-student-list');
    if(!list) return;
    list.innerHTML = '';
    students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-4">${s.name}</td><td class="p-2"><input value="${s.grades['Assignment 1'] || ''}"></td><td class="p-2"><input value="${s.grades['Mid-Term'] || ''}"></td><td class="p-2"><input value="${s.grades['Final'] || ''}"></td><td class="p-4"><button>Save</button></td>`;
        list.appendChild(tr);
    });
}

function changeTab(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function openAddStudentModal() {
    document.getElementById('add-student-modal').classList.remove('hidden');
}

function closeAddStudentModal() {
    document.getElementById('add-student-modal').classList.add('hidden');
}

// --- Communication Center Logic ---
const communicationData = [
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: 'Okay, thank you!', unread: 0, messages: [ { sender: 'John Doe', text: 'I had a question about the homework.' }, { sender: 'Teacher', text: 'Of course, what is it?' }, { sender: 'John Doe', text: 'Nevermind, I figured it out.' }, { sender: 'John Doe', text: 'Okay, thank you!' } ]},
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/40?img=2', lastMessage: 'Can I get an extension?', unread: 2, messages: [ { sender: 'Jane Smith', text: 'I am not feeling well.' }, { sender: 'Jane Smith', text: 'Can I get an extension?' } ]},
    { id: 3, name: 'Peter Jones', avatar: 'https://i.pravatar.cc/40?img=3', lastMessage: 'See you tomorrow.', unread: 0, messages: [ { sender: 'Teacher', text: 'Your project was excellent.'}, { sender: 'Peter Jones', text: 'Thank you so much!'}, { sender: 'Teacher', text: 'You\'re welcome.' }, { sender: 'Peter Jones', text: 'See you tomorrow.' } ]}
];

function renderStudentConversationList() {
    const studentList = document.getElementById('communication-student-list');
    if (!studentList) return;
    studentList.innerHTML = '';
    communicationData.forEach(student => {
        const div = document.createElement('div');
        div.className = 'p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center space-x-3';
        div.setAttribute('onclick', `selectConversation(${student.id})`);
        div.id = `conversation-${student.id}`;
        div.innerHTML = `
            <img src="${student.avatar}" alt="${student.name}" class="w-10 h-10 rounded-full">
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-gray-800 truncate">${student.name}</p>
                    ${student.unread > 0 ? `<span class="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${student.unread}</span>` : ''}
                </div>
                <p class="text-sm text-gray-500 truncate">${student.lastMessage}</p>
            </div>
        `;
        studentList.appendChild(div);
    });
}

function selectConversation(studentId) {
    document.querySelectorAll('#communication-student-list > div').forEach(el => el.classList.remove('bg-indigo-50'));
    document.getElementById(`conversation-${studentId}`).classList.add('bg-indigo-50');
    
    const student = communicationData.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('chat-placeholder').classList.add('hidden');
    const chatContent = document.getElementById('chat-content');
    chatContent.classList.remove('hidden');
    
    chatContent.innerHTML = `
        <div class="p-4 border-b border-gray-200 flex items-center space-x-3">
            <img src="${student.avatar}" alt="${student.name}" class="w-10 h-10 rounded-full">
            <div>
                <h3 class="font-semibold text-lg">${student.name}</h3>
                <p class="text-xs text-green-500">Online</p>
            </div>
        </div>
        <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
            ${student.messages.map(msg => `
                <div class="flex ${msg.sender === 'Teacher' ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'Teacher' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}">
                        ${msg.text}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="p-4 bg-white border-t border-gray-200">
            <div class="flex items-center gap-2">
                <input type="text" placeholder="Type a message..." class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button class="bg-indigo-600 text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-indigo-700 transition">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
}


// --- Assign Tasks Logic ---
let assignedTasksData = [
    { title: 'Complete Algebra Worksheet 1-5', class: 'Class 10B - Mathematics', dueDate: '2025-10-10' },
    { title: 'Read Chapter 3: The Roman Empire', class: 'Class 9A - History', dueDate: '2025-10-12' },
];

function renderAssignedTasks() {
    const taskList = document.getElementById('assigned-tasks-list');
    if (!taskList) return;
    taskList.innerHTML = '';
    assignedTasksData.forEach(task => {
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50';
        div.innerHTML = `<div class="flex justify-between items-center"><div><p class="font-semibold text-gray-800">${task.title}</p><p class="text-sm text-gray-500">${task.class} | <span class="font-medium text-red-600">Due: ${task.dueDate}</span></p></div><div><button class="text-sm text-red-500 hover:text-red-700 font-semibold">Delete</button></div></div>`;
        taskList.appendChild(div);
    });
}

function handleTaskFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('task-title').value;
    const taskClass = document.getElementById('task-class').value;
    const dueDate = document.getElementById('task-due-date').value;
    if (title && taskClass && dueDate) {
        assignedTasksData.unshift({ title, class: taskClass, dueDate });
        renderAssignedTasks();
        event.target.reset();
    }
}

