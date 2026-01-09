// Sample events data
const events = [
    {
        id: 1,
        title: "Summer Music Festival 2024",
        category: "music",
        price: 199.99,
        date: "August 15-17, 2024",
        location: "Chicago, IL",
        description: "3-day festival with top artists",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 45000,
        goal: 75000
    },
    {
        id: 2,
        title: "NBA Finals Game 7",
        category: "sports",
        price: 450.00,
        date: "June 20, 2024",
        location: "Los Angeles, CA",
        description: "Championship deciding game",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 12000,
        goal: 25000
    },
    {
        id: 3,
        title: "Broadway Show: Hamilton",
        category: "theater",
        price: 175.50,
        date: "Various Dates",
        location: "New York, NY",
        description: "Award-winning musical",
        image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 8500,
        goal: 15000
    },
    {
        id: 4,
        title: "Limited Edition Band T-Shirts",
        category: "merch",
        price: 45.99,
        date: "Available Now",
        location: "Online Store",
        description: "Exclusive merchandise collection",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 3200,
        goal: 5000
    },
    {
        id: 5,
        title: "World Cup Soccer Final",
        category: "sports",
        price: 850.00,
        date: "July 14, 2024",
        location: "Miami, FL",
        description: "International championship match",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 65000,
        goal: 100000
    },
    {
        id: 6,
        title: "Jazz Night Concert Series",
        category: "music",
        price: 65.00,
        date: "Monthly Events",
        location: "New Orleans, LA",
        description: "Live jazz performances",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        saved: 4800,
        goal: 10000
    }
];

// User savings data
let userSavings = {
    total: 0,
    goals: []
};

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const dashboardModal = document.getElementById('dashboard-modal');
const closeModal = document.querySelector('.close-modal');
const dashboardBtn = document.querySelector('.dashboard-btn');
const addFundsBtn = document.querySelector('.add-funds-btn');
const goalsList = document.getElementById('goals-list');
const totalAmountEl = document.querySelector('.amount');
const goalsCountEl = document.querySelector('.count');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayEvents();
    loadUserData();
    setupEventListeners();
});

// Display events on the page
function displayEvents() {
    eventsContainer.innerHTML = '';
    
    events.forEach(event => {
        const percentage = Math.min(Math.round((event.saved / event.goal) * 100), 100);
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image}')"></div>
            <div class="event-info">
                <span class="event-category" style="background-color: ${getCategoryColor(event.category)}">
                    ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <div class="event-price">$${event.price.toFixed(2)}</div>
                
                <div class="savings-meter">
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="savings-info">
                        <span>$${event.saved.toLocaleString()} saved</span>
                        <span>$${event.goal.toLocaleString()} goal</span>
                    </div>
                </div>
                
                <button class="save-btn" data-id="${event.id}">
                    <i class="fas fa-piggy-bank"></i> Save for this Event
                </button>
            </div>
        `;
        
        eventsContainer.appendChild(eventCard);
    });
    
    // Add event listeners to save buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-id'));
            addToSavings(eventId);
        });
    });
}

// Get color for category
function getCategoryColor(category) {
    const colors = {
        music: '#9b59b6',
        sports: '#3498db',
        theater: '#e74c3c',
        merch: '#2ecc71'
    };
    return colors[category] || '#95a5a6';
}

// Add event to savings goals
function addToSavings(eventId) {
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Check if already in goals
    const existingGoal = userSavings.goals.find(g => g.eventId === eventId);
    
    if (!existingGoal) {
        userSavings.goals.push({
            eventId: eventId,
            title: event.title,
            goalAmount: event.price,
            savedAmount: 0,
            progress: 0
        });
        
        alert(`Added "${event.title}" to your savings goals!`);
        updateDashboard();
        saveUserData();
    } else {
        alert(`"${event.title}" is already in your savings goals!`);
    }
}

// Update dashboard display
function updateDashboard() {
    // Update total saved
    const totalSaved = userSavings.goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    userSavings.total = totalSaved;
    totalAmountEl.textContent = `$${totalSaved.toFixed(2)}`;
    
    // Update goals count
    goalsCountEl.textContent = userSavings.goals.length;
    
    // Update goals list
    if (userSavings.goals.length > 0) {
        goalsList.innerHTML = '';
        
        userSavings.goals.forEach((goal, index) => {
            const progress = goal.goalAmount > 0 ? (goal.savedAmount / goal.goalAmount * 100) : 0;
            
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            goalItem.innerHTML = `
                <h4>${goal.title}</h4>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <span>$${goal.savedAmount.toFixed(2)} of $${goal.goalAmount.toFixed(2)}</span>
                </div>
                <button class="contribute-btn" data-index="${index}">Add $10</button>
            `;
            
            goalsList.appendChild(goalItem);
        });
        
        // Add event listeners to contribute buttons
        document.querySelectorAll('.contribute-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                contributeToGoal(index, 10);
            });
        });
    } else {
        goalsList.innerHTML = '<p>No active goals yet. Browse events to start saving!</p>';
    }
}

// Contribute to a savings goal
function contributeToGoal(goalIndex, amount) {
    if (goalIndex >= 0 && goalIndex < userSavings.goals.length) {
        userSavings.goals[goalIndex].savedAmount += amount;
        updateDashboard();
        saveUserData();
        
        // Check if goal is reached
        if (userSavings.goals[goalIndex].savedAmount >= userSavings.goals[goalIndex].goalAmount) {
            alert(`Congratulations! You've reached your goal for "${userSavings.goals[goalIndex].title}"!`);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Dashboard modal
    dashboardBtn.addEventListener('click', function() {
        dashboardModal.style.display = 'block';
        updateDashboard();
    });
    
    closeModal.addEventListener('click', function() {
        dashboardModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === dashboardModal) {
            dashboardModal.style.display = 'none';
        }
    });
    
    // Add funds button
    addFundsBtn.addEventListener('click', function() {
        const amount = parseFloat(prompt("How much would you like to add to your account?"));
        
        if (!isNaN(amount) && amount > 0) {
            // Add to total savings
            userSavings.total += amount;
            
            // Distribute to goals if any exist
            if (userSavings.goals.length > 0) {
                const perGoal = amount / userSavings.goals.length;
                userSavings.goals.forEach(goal => {
                    goal.savedAmount += perGoal;
                });
            }
            
            updateDashboard();
            saveUserData();
            alert(`Successfully added $${amount.toFixed(2)} to your account!`);
        } else if (amount !== null) {
            alert("Please enter a valid amount.");
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== "#") {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('eventFundUserData', JSON.stringify(userSavings));
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('eventFundUserData');
    
    if (savedData) {
        userSavings = JSON.parse(savedData);
    }
}

// Export data function (for future expansion)
function exportSavingsData() {
    const dataStr = JSON.stringify(userSavings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = 'eventfund-savings-data.json';
    downloadLink.click();
}