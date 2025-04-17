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

// Fonction pour récupérer les coordonnées GPS de la ville via Nominatim (OpenStreetMap)
async function getCityCoordinates(city) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('Ville non trouvée');
        }

        const latitude = data[0].lat;
        const longitude = data[0].lon;

        return { latitude, longitude };
    } catch (error) {
        throw new Error('Erreur lors de la récupération des coordonnées');
    }
}

// Fonction pour récupérer les données météo de l'API Open-Meteo
async function getWeather(city) {
    try {
        // Obtenir les coordonnées GPS de la ville
        const { latitude, longitude } = await getCityCoordinates(city);
        
        // Construire l'URL de l'API Open-Meteo avec les coordonnées GPS
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur de chargement de la météo');
        }

        const data = await response.json();

        // Extraire les données météo
        const weatherData = data.current_weather;
        cityName.textContent = city;
        temperature.textContent = `${weatherData.temperature} °C`;
        description.textContent = `Conditions : Code météo ${weatherData.weathercode}`;
        windSpeed.textContent = `Vitesse du vent : ${weatherData.windspeed} km/h`;

        // Afficher l'humidité seulement si elle existe (non incluse ici, donc on la cache)
        humidity.textContent = "Humidité : Non disponible";

        // Afficher les résultats
        weatherResult.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } catch (error) {
        // Gérer les erreurs
        weatherResult.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        console.error(error.message);
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
