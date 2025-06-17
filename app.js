import { API_KEY } from './API.js';

const form = document.querySelector('form');
const cityInput = document.querySelector('#city-name');
const cityHTML = document.querySelector('.city');
const temperatureHTML = document.querySelector('.temperature');
const humidityHTML = document.querySelector('.humidity');
const descriptionHTML = document.querySelector('.description');
const iconHTML = document.querySelector('.icon');
const apiKey = API_KEY ?? '';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  fetchWeatherData(cityInput.value);
});

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return '⛈';
    case weatherId >= 300 && weatherId < 400:
      return '🌧';
    case weatherId >= 500 && weatherId < 600:
      return '🌧';
    case weatherId >= 600 && weatherId < 700:
      return '❄';
    case weatherId >= 700 && weatherId < 800:
      return '🌫';
    case weatherId === 800:
      return '☀';
    case weatherId >= 801 && weatherId < 810:
      return '☁';
    default:
      return '❓';
  }
}

async function fetchWeatherData(city) {
  try {
    let geoData = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    ).then((response) => response.json());

    if (!geoData.length) {
      console.error('Nie znaleziono miasta!');
      return;
    }

    const { lat, lon, name } = geoData[0];

    let weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    ).then((response) => response.json());

    cityHTML.textContent = name;
    temperatureHTML.textContent = `${parseFloat(weatherData.main.temp).toFixed(
      1
    )} °C`;
    humidityHTML.textContent = `${parseFloat(weatherData.main.humidity).toFixed(
      1
    )} %`;
    descriptionHTML.textContent =
      weatherData.weather[0].description.toUpperCase();
    iconHTML.textContent = getWeatherEmoji(
      parseFloat(weatherData?.weather[0]?.id)
    );

    [
      cityHTML,
      temperatureHTML,
      humidityHTML,
      descriptionHTML,
      iconHTML,
    ].forEach((elementHTML) => {
      elementHTML.classList.add('added');
    });

    document
      .querySelector('main span:nth-of-type(1)')
      .classList.add('border-top');
  } catch (error) {
    console.error('Błąd pobierania danych:', error);
  }
}

fetchWeatherData('Miami');
