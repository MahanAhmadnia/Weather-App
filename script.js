// DOM Elements
const input = document.getElementById('input');
const button = document.getElementById('button');
const cityTemperature = document.getElementById('cityTemperature');
const cityName = document.getElementById('cityName');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Function to fetch and display weather
function getWeatherData() {
    
    const city = input.value.trim();

    if (city === "") {
        return alert("Please enter a city name...");
    }

    // UX: Clear input and change placeholder
    input.value = "";
    input.placeholder = "Searching...";

    // API 1: Geocoding
    const locationCity = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;

    fetch(locationCity)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert("City not found!");
                input.placeholder = "Enter a city name...";
                return; // Stop execution if city not found
            }

            const latitude = data.results[0].latitude;
            const longitude = data.results[0].longitude;

            // API 2: Weather Forecast
            const weatherCity = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

            return fetch(weatherCity);
        })
        .then(response => {
            if (response) return response.json();
        })
        .then(weatherData => {
            if (weatherData) {
                cityName.textContent = city;
                
                // Using Math.round for a clean number
                cityTemperature.textContent = `${Math.round(weatherData.current.temperature_2m)} °C`;
                humidity.textContent = `${weatherData.current.relative_humidity_2m} %`;
                windSpeed.textContent = `${weatherData.current.wind_speed_10m} km/h`;

                // Reset placeholder
                input.placeholder = "Enter a city name...";
            }
        })
        .catch(error => {
            alert("Something went wrong. Please try again.");
            input.placeholder = "Enter a city name...";
        });
}

// Event Listeners
button.addEventListener("click", getWeatherData);

// Trigger search when pressing 'Enter' key in the input field
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeatherData();
    }
});