// Sélectionner les éléments HTML
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const errorMessage = document.getElementById('errorMessage');

// Fonction pour récupérer les données météo de l'API Open-Meteo
async function getWeather(city) {
    // URL de l'API Open-Meteo
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&hourly=temperature_2m,precipitation_sum,wind_speed_10m&current_weather=true`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur de chargement');
        }
        const data = await response.json();

        // Extraire les données de la réponse
        const weatherData = data.current_weather;
        cityName.textContent = "Paris, FR"; // Ville fixée pour l'exemple
        temperature.textContent = `${weatherData.temperature} °C`;
        description.textContent = `Conditions météorologiques : ${weatherData.weathercode}`;
        humidity.textContent = `Humidité : ${data.hourly.precipitation_sum}%`; // Modèle simplifié
        windSpeed.textContent = `Vitesse du vent : ${weatherData.wind_speed} km/h`;

        // Afficher les résultats
        weatherResult.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } catch (error) {
        // Gérer les erreurs
        weatherResult.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

// Ajouter un écouteur d'événements pour le bouton de recherche
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Veuillez entrer une ville.');
    }
});

// Permettre la recherche en appuyant sur la touche "Entrée"
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});
