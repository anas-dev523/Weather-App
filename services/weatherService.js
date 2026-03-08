const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(cityName) {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=fr`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ville introuvable. Vérifiez le nom et réessayez.');
    }
    if (response.status === 401) {
      throw new Error('Clé API invalide. Vérifiez votre configuration.');
    }
    throw new Error('Erreur réseau. Vérifiez votre connexion.');
  }

  const data = await response.json();
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    iconCode: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s -> km/h
    weatherId: data.weather[0].id,
  };
}

export async function fetchForecast(cityName) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=fr`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ville introuvable.');
    }
    if (response.status === 401) {
      throw new Error('Clé API invalide.');
    }
    throw new Error('Erreur réseau. Vérifiez votre connexion.');
  }

  const data = await response.json();

  // Group by day and pick one entry per day (noon forecast)
  const dailyMap = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    const hour = date.getHours();

    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = { ...item, dayKey };
    } else if (Math.abs(hour - 12) < Math.abs(new Date(dailyMap[dayKey].dt * 1000).getHours() - 12)) {
      dailyMap[dayKey] = { ...item, dayKey };
    }
  });

  return Object.values(dailyMap).slice(0, 5).map((item) => ({
    day: item.dayKey,
    tempMin: Math.round(item.main.temp_min),
    tempMax: Math.round(item.main.temp_max),
    description: item.weather[0].description,
    iconCode: item.weather[0].icon,
    weatherId: item.weather[0].id,
  }));
}

export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return '⛈️';
  if (weatherId >= 300 && weatherId < 400) return '🌦️';
  if (weatherId >= 500 && weatherId < 600) return '🌧️';
  if (weatherId >= 600 && weatherId < 700) return '❄️';
  if (weatherId >= 700 && weatherId < 800) return '🌫️';
  if (weatherId === 800) return '☀️';
  if (weatherId === 801) return '🌤️';
  if (weatherId === 802) return '⛅';
  if (weatherId >= 803) return '☁️';
  return '🌡️';
}

export function getBackgroundColors(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return ['#1a1a2e', '#16213e']; // thunderstorm
  if (weatherId >= 300 && weatherId < 600) return ['#2c3e50', '#3498db']; // rain/drizzle
  if (weatherId >= 600 && weatherId < 700) return ['#bdc3c7', '#ecf0f1']; // snow
  if (weatherId >= 700 && weatherId < 800) return ['#7f8c8d', '#95a5a6']; // fog/mist
  if (weatherId === 800) return ['#1e90ff', '#00bfff'];                    // clear
  if (weatherId <= 802) return ['#2980b9', '#6dd5fa'];                     // few clouds
  return ['#485563', '#29323c'];                                            // overcast
}
