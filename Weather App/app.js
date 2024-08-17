const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

async function fetchWeather() {
    const locationInput = document.getElementById('locationInput').value;
    const weatherInfo = document.getElementById('weatherInfo');
    let url;

    if (locationInput) {
        // Fetch weather for the user-inputted location
        url = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=metric&appid=${apiKey}`;
    } else {
        // Fetch weather for the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
                await getWeatherData(url);
            }, () => {
                weatherInfo.innerHTML = 'Geolocation is not supported by this browser or access was denied.';
            });
        } else {
            weatherInfo.innerHTML = 'Geolocation is not supported by this browser.';
        }
        return;
    }

    await getWeatherData(url);
}

async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === '404') {
            document.getElementById('weatherInfo').innerHTML = 'City not found.';
            return;
        }

        const { name, main, weather } = data;
        const temperature = main.temp;
        const description = weather[0].description;
        
        document.getElementById('weatherInfo').innerHTML = `
            <h2>Weather in ${name}</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Conditions:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        `;
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = 'Error fetching weather data.';
    }
}
