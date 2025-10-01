// Global variables to store student details and responses
let studentDetails = {};
let responses = [];

// Function to start the assessment
function startAssessment() {
  const name = document.getElementById("student-name").value;
  const age = document.getElementById("student-age").value;
  const gender = document.getElementById("student-gender").value;
  const caste = document.getElementById("student-caste").value;

  if (!name || !age || !gender || !caste) {
    alert("Please fill in all student details.");
    return;
  }

  studentDetails = { name, age, gender, caste };

  document.getElementById("student-details").style.display = "none";
  document.getElementById("questionnaire").style.display = "block";
  document.getElementById("submit-btn").style.display = "block";

  renderQuestions();
  responses = new Array(questions.length).fill(null);
}

// Questions with categories
const questions = [
  // Academic Motivation
  { category: "academic_motivation", question: "How passionate are you about your current course of study?", options: [ { text: "Extremely passionate", score: 0 }, { text: "Moderately passionate", score: 1 }, { text: "Neutral", score: 2 }, { text: "Somewhat disinterested", score: 3 }, { text: "Completely disinterested", score: 4 } ] },
  { category: "academic_motivation", question: "How often do you actively participate in class activities?", options: [ { text: "Always", score: 0 }, { text: "Frequently", score: 1 }, { text: "Occasionally", score: 2 }, { text: "Rarely", score: 3 }, { text: "Never", score: 4 } ] },
  // Socioeconomic
  { category: "socioeconomic", question: "How would you describe your family's financial situation?", options: [ { text: "Very stable, no financial concerns", score: 0 }, { text: "Stable with minor financial challenges", score: 1 }, { text: "Moderate financial stress", score: 2 }, { text: "Significant financial difficulties", score: 3 }, { text: "Extreme financial hardship", score: 4 } ] },
  { category: "socioeconomic", question: "How often do financial concerns affect your ability to focus on studies?", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
  // Personal Challenges
  { category: "personal_challenges", question: "How often do you struggle to manage your study time?", options: [ { text: "Never, I manage time very effectively", score: 0 }, { text: "Rarely have time management issues", score: 1 }, { text: "Sometimes struggle with time management", score: 2 }, { text: "Often struggle with time management", score: 3 }, { text: "Constantly overwhelmed with time management", score: 4 } ] },
  { category: "personal_challenges", question: "How frequently do you miss deadlines or submissions?", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
  { category: "personal_challenges", question: "How often do you feel confident about your academic abilities?", options: [ { text: "Always confident", score: 0 }, { text: "Most of the time confident", score: 1 }, { text: "Sometimes confident", score: 2 }, { text: "Rarely confident", score: 3 }, { text: "Never confident", score: 4 } ] },
  // Family Support
  { category: "family_support", question: "How supportive is your family about your education?", options: [ { text: "Extremely supportive", score: 0 }, { text: "Very supportive", score: 1 }, { text: "Moderately supportive", score: 2 }, { text: "Minimal support", score: 3 }, { text: "No family support at all", score: 4 } ] },
  { category: "family_support", question: "How often does your family provide emotional support when needed?", options: [ { text: "Always", score: 0 }, { text: "Frequently", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Rarely", score: 3 }, { text: "Never", score: 4 } ] },
  // Mental Health
  { category: "mental_health", question: "How would you rate your current stress levels?", options: [ { text: "Very low stress, feeling great", score: 0 }, { text: "Low to moderate stress", score: 1 }, { text: "Moderate stress levels", score: 2 }, { text: "High stress affecting daily life", score: 3 }, { text: "Overwhelming stress", score: 4 } ] },
  { category: "mental_health", question: "How often do you experience anxiety about your academic future?", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
];

// Render the questionnaire dynamically
function renderQuestions() {
  const questionnaire = document.getElementById("questionnaire");
  questionnaire.innerHTML = `<h2 class="text-2xl font-bold mb-6">Questionnaire</h2>` + questions.map((question, index) =>
        `<div class="mb-6">
            <p class="font-medium text-slate-800">${index + 1}. ${question.question}</p>
            <div class="mt-2 space-y-2">
                ${question.options.map(option =>
                    `<label class="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-200 transition cursor-pointer">
                        <input type="radio" name="question-${index}" value="${option.score}" onclick="handleResponseChange(${index}, ${option.score})" class="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                        <span class="ml-3 text-sm text-slate-700">${option.text}</span>
                    </label>`
                ).join("")}
            </div>
        </div>`
    ).join("");
}

// Handle changes in responses
function handleResponseChange(index, score) {
  responses[index] = score;
}

// Calculate risk and generate results
function calculateRisk() {
  if (responses.some((response) => response === null)) {
    alert("Please answer all questions.");
    return;
  }

  let totalScore = 0;
  const categoryScores = {};

  responses.forEach((score, index) => {
    totalScore += score;
    const category = questions[index].category;
    categoryScores[category] = (categoryScores[category] || 0) + score;
  });

  Object.keys(categoryScores).forEach((category) => {
    const categoryQuestionCount = questions.filter((q) => q.category === category).length;
    const maxCategoryScore = categoryQuestionCount * 4;
    categoryScores[category] = (categoryScores[category] / maxCategoryScore) * 100;
  });

  const maxPossibleScore = questions.length * 4;
  const riskPercentage = (totalScore / maxPossibleScore) * 100;

  let riskLevel = "Low Risk";
  if (riskPercentage > 66) riskLevel = "High Risk";
  else if (riskPercentage > 33) riskLevel = "Medium Risk";

  const chartData = Object.entries(categoryScores).map(([category, score]) => ({
    category: category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    score: score.toFixed(2),
  }));

  const assessmentResults = { ...studentDetails, totalScore, riskPercentage: riskPercentage.toFixed(2), riskLevel, categoryScores: chartData };

  renderResults(assessmentResults);
  saveDataForTeacher(assessmentResults);
}

// Render results
function renderResults(results) {
  const resultsSection = document.getElementById("results");
  document.getElementById("questionnaire").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";

  resultsSection.style.display = "block";
  resultsSection.innerHTML = `
    <h2 class="text-2xl font-bold text-center">Assessment Complete!</h2>
    <p class="text-center text-slate-600 mb-6">Thank you. Your results have been recorded and shared with your mentor.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div class="bg-slate-100 p-4 rounded-lg">
            <p class="text-sm text-slate-500">Overall Risk</p>
            <p class="text-2xl font-bold ${results.riskLevel === 'High Risk' ? 'text-red-500' : results.riskLevel === 'Medium Risk' ? 'text-amber-500' : 'text-green-500'}">${results.riskLevel}</p>
        </div>
        <div class="bg-slate-100 p-4 rounded-lg">
            <p class="text-sm text-slate-500">Risk Percentage</p>
            <p class="text-2xl font-bold">${results.riskPercentage}%</p>
        </div>
    </div>
    <div class="mt-6">
        <canvas id="chart"></canvas>
    </div>`;

  renderChart(results.categoryScores);
}

function saveDataForTeacher(results) {
    console.log("Saving results to localStorage for student ID 1:", results);
    localStorage.setItem('psychometricResult_student_1', JSON.stringify(results));
}

function renderChart(chartData) {
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.map((item) => item.category),
      datasets: [ { label: "Risk Score by Category (%)", data: chartData.map((item) => item.score), backgroundColor: "rgba(59, 130, 246, 0.5)", borderColor: "rgba(59, 130, 246, 1)", borderWidth: 1 } ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } },
  });
}

document.getElementById("submit-btn")?.addEventListener("click", calculateRisk);
