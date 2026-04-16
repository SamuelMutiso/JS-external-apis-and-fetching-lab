// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// 1. Select DOM Elements
const stateInput = document.querySelector('#state-input');
const fetchButton = document.querySelector('#fetch-alerts');
const displayBox = document.querySelector('#alerts-display');
const errorDiv = document.querySelector('#error-message');

// 2. Event Listener for the Fetch Button
fetchButton.addEventListener('click', () => {
    const state = stateInput.value.trim().toUpperCase();
    
    // Reset UI: Clear previous alerts and hide errors
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
    displayBox.innerHTML = '';

    // Simple Input Validation
    if (state.length !== 2) {
        displayError("Please enter a valid 2-letter state abbreviation (e.g., NY).");
        return;
    }

    fetchWeatherAlerts(state);
    
    // Requirement: Clear the input field after clicking fetch
    stateInput.value = ''; 
});

// 3. Fetch Function
function fetchWeatherAlerts(state) {
    fetch(`https://api.weather.gov/alerts/active?area=${state}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Invalid state or network issue.");
            }
            return res.json();
        })
        .then(data => {
            displayAlerts(data);
        })
        .catch(error => {
            displayError(error.message);
        });
}

// 4. Display Function
function displayAlerts(data) {
    const alertCount = data.features.length;
    
    // REQUIRED BY TEST: The exact string "Weather Alerts: [number]"
    const summary = document.createElement('h3');
    summary.textContent = `Weather Alerts: ${alertCount}`; 
    displayBox.appendChild(summary);

    if (alertCount === 0) {
        const noAlerts = document.createElement('p');
        noAlerts.textContent = "No active alerts for this area.";
        displayBox.appendChild(noAlerts);
        return;
    }

    // Create List of Headlines
    const ul = document.createElement('ul');
    data.features.forEach(feature => {
        const li = document.createElement('li');
        // Headline is located at properties.headline
        li.textContent = feature.properties.headline;
        ul.appendChild(li);
    });
    displayBox.appendChild(ul);
}

// 5. Error Display Function
function displayError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden'); // Show the error div
}