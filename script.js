// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Define days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Get the container for days
  const daysContainer = document.getElementById("days-container");

  // Create storage for goals if it doesn't exist
  if (!localStorage.getItem("dailyGoals")) {
    const initialGoals = {};
    daysOfWeek.forEach((day) => {
      initialGoals[day] = [];
    });
    localStorage.setItem("dailyGoals", JSON.stringify(initialGoals));
  }

  // Load goals from localStorage
  const goals = JSON.parse(localStorage.getItem("dailyGoals"));

  // Create day elements
  daysOfWeek.forEach((day) => {
    const dayElement = createDayElement(day, goals[day]);
    daysContainer.appendChild(dayElement);
  });

  // Update statistics
  updateStats();

  // Highlight current day
  highlightCurrentDay();
});

// Create a day element with its goals
function createDayElement(day, dayGoals) {
  const dayElement = document.createElement("div");
  dayElement.className = "day";
  dayElement.id = `day-${day.toLowerCase()}`;

  // Create day header
  const dayHeader = document.createElement("div");
  dayHeader.className = "day-header";

  const dayTitle = document.createElement("div");
  dayTitle.className = "day-title";
  dayTitle.textContent = day;

  const dayProgress = document.createElement("div");
  dayProgress.className = "day-progress";
  const completedGoals = dayGoals.filter((goal) => goal.completed).length;
  dayProgress.textContent = `${completedGoals}/${dayGoals.length} (${
    dayGoals.length > 0
      ? Math.round((completedGoals / dayGoals.length) * 100)
      : 0
  }%)`;
  dayProgress.id = `progress-${day.toLowerCase()}`;

  dayHeader.appendChild(dayTitle);
  dayHeader.appendChild(dayProgress);
  dayElement.appendChild(dayHeader);

  // Create goal list
  const goalList = document.createElement("ul");
  goalList.className = "goal-list";
  goalList.id = `goals-${day.toLowerCase()}`;

  // Add existing goals
  dayGoals.forEach((goal, index) => {
    const goalItem = createGoalItem(goal, index, day);
    goalList.appendChild(goalItem);
  });

  dayElement.appendChild(goalList);

  // Create add goal form
  const addGoalForm = document.createElement("div");
  addGoalForm.className = "add-goal";

  const goalInput = document.createElement("input");
  goalInput.type = "text";
  goalInput.placeholder = "Add a new goal...";
  goalInput.id = `input-${day.toLowerCase()}`;

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", () => {
    addGoal(day);
  });

  // Allow adding goals by pressing Enter
  goalInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      addGoal(day);
    }
  });

  addGoalForm.appendChild(goalInput);
  addGoalForm.appendChild(addButton);
  dayElement.appendChild(addGoalForm);

  return dayElement;
}

// Create a goal item element
function createGoalItem(goal, index, day) {
  const goalItem = document.createElement("li");
  goalItem.className = "goal-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "goal-checkbox";
  checkbox.checked = goal.completed;
  checkbox.addEventListener("change", () => {
    toggleGoal(day, index);
  });

  const goalText = document.createElement("span");
  goalText.className = `goal-text ${goal.completed ? "completed" : ""}`;
  goalText.textContent = goal.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-goal";
  deleteButton.innerHTML = "&times;";
  deleteButton.title = "Delete goal";
  deleteButton.addEventListener("click", () => {
    deleteGoal(day, index);
  });

  goalItem.appendChild(checkbox);
  goalItem.appendChild(goalText);
  goalItem.appendChild(deleteButton);

  return goalItem;
}

// Add a new goal
function addGoal(day) {
  const input = document.getElementById(`input-${day.toLowerCase()}`);
  const goalText = input.value.trim();

  if (goalText) {
    // Get current goals
    const goals = JSON.parse(localStorage.getItem("dailyGoals"));

    // Add new goal
    goals[day].push({
      text: goalText,
      completed: false,
    });

    // Save to localStorage
    localStorage.setItem("dailyGoals", JSON.stringify(goals));

    // Clear input
    input.value = "";

    // Refresh goals display
    refreshGoals(day);

    // Update statistics
    updateStats();
  }
}

// Toggle goal completion status
function toggleGoal(day, index) {
  // Get current goals
  const goals = JSON.parse(localStorage.getItem("dailyGoals"));

  // Toggle completion status
  goals[day][index].completed = !goals[day][index].completed;

  // Save to localStorage
  localStorage.setItem("dailyGoals", JSON.stringify(goals));

  // Refresh goals display
  refreshGoals(day);

  // Update statistics
  updateStats();
}

// Delete a goal
function deleteGoal(day, index) {
  // Get current goals
  const goals = JSON.parse(localStorage.getItem("dailyGoals"));

  // Remove goal
  goals[day].splice(index, 1);

  // Save to localStorage
  localStorage.setItem("dailyGoals", JSON.stringify(goals));

  // Refresh goals display
  refreshGoals(day);

  // Update statistics
  updateStats();
}

// Refresh goals display for a day
function refreshGoals(day) {
  const goals = JSON.parse(localStorage.getItem("dailyGoals"));
  const dayGoals = goals[day];

  // Get goal list element
  const goalList = document.getElementById(`goals-${day.toLowerCase()}`);

  // Clear existing goals
  goalList.innerHTML = "";

  // Add updated goals
  dayGoals.forEach((goal, index) => {
    const goalItem = createGoalItem(goal, index, day);
    goalList.appendChild(goalItem);
  });

  // Update day progress
  const dayProgress = document.getElementById(`progress-${day.toLowerCase()}`);
  const completedGoals = dayGoals.filter((goal) => goal.completed).length;
  dayProgress.textContent = `${completedGoals}/${dayGoals.length} (${
    dayGoals.length > 0
      ? Math.round((completedGoals / dayGoals.length) * 100)
      : 0
  }%)`;
}

// Update overall statistics
function updateStats() {
  const goals = JSON.parse(localStorage.getItem("dailyGoals"));
  let totalGoals = 0;
  let completedGoals = 0;

  // Count total and completed goals
  Object.values(goals).forEach((dayGoals) => {
    totalGoals += dayGoals.length;
    completedGoals += dayGoals.filter((goal) => goal.completed).length;
  });

  // Update stats display
  document.getElementById("total-goals").textContent = totalGoals;
  document.getElementById("completed-goals").textContent = completedGoals;
  document.getElementById("completion-percentage").textContent = `${
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
  }%`;
}

// Highlight current day
function highlightCurrentDay() {
  const date = new Date();
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[dayIndex];

  // Add active class to current day
  const currentDayElement = document.getElementById(
    `day-${currentDay.toLowerCase()}`
  );
  if (currentDayElement) {
    currentDayElement.classList.add("active-day");
  }
}
