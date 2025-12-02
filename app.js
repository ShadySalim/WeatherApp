'use strict';


//1. so we need to handle city not found by twoing error . and setting manuell error. 

// CONSTANT

const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}'
const API_KEY = 'API_KEY ';
const COUNTRY_NAMES = new Intl.DisplayNames(['en'],{type:'region'})
// const SKY_CONDITIONS = {
//   Clear: 'clear.png',
//   Clouds: 'clouds.png',
//   Drizzle: 'drizzle.png',
//   Mist: 'mist.png',
//   Rain: 'rain.png',
//   Snow: 'snow.png',
//   Wind: 'wind.png',
// };

// SELECTOR
const elements = {
    form: document.querySelector('#search-form'),
    input:document.querySelector('#city-input'),
    countryName:document.querySelector('#country'),
    cityName:document.querySelector('#city-name'),
    btn:document.querySelector('search__btn'),
    tempValue: document.querySelector('#temperature'),
    windSpeed: document.querySelector('#wind'),
    humidity:document.querySelector('#humidity'),
    imgDesc:document.querySelector('#condition-text'),
    img: document.querySelector('#condition-icon')
}

const showCityError = function(message = 'City not found. Please try again.') {
  elements.cityName.textContent = '';
  elements.countryName.textContent = '';
  elements.tempValue.textContent = '';
  elements.windSpeed.textContent = '';
  elements.humidity.textContent = '';
  elements.img.src = '';
  elements.imgDesc.textContent = '';

  // show error inside cityName in a clean UI style
  elements.cityName.textContent = message;
  
};

// handleSerach bar
const handleSearch = async function(e) {
    // prevent default form submit
    e.preventDefault();
    const cityName = elements.input.value.trim();
    // check for valid data
    if(!cityName) return
    const data = await  fetchData(cityName);
    if (!data) {
        showCityError();
        return;
    }
    console.log(data)
    if(data){
        updateUI(data);
    }
 
    
}

// utility
// function getSkyImage(status){
//     console.log(status)
//     return SKY_CONDITIONS[status] || 'clear.png' // fall back to clear
// }

// handelUI
const updateUI = function(data){
    const cityName = data.name;
    const countryCode = data.sys.country;
    const countryName = COUNTRY_NAMES.of(countryCode) // convert countr-code to name
    const temp = Math.round(data.main.temp - 273.15);
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const imgDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;
  


    elements.cityName.textContent = cityName;
    elements.countryName.textContent = countryName;
    elements.tempValue.textContent = temp;
    elements.humidity.textContent = humidity;
    elements.windSpeed.textContent = `${wind}km/h`;
    elements.imgDesc.textContent = imgDescription
    elements.img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    console.log(iconCode)
}

// fetch data

const fetchData = async function(cityName){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        // handle bad reqeust 404
        if(!response.ok) throw new Error('request failed');
        const data = await response.json();
        return data

    }catch(err){
        console.error(`Somethings went wrong`, err.message);
        return null;
    }
}

const resetUI = function () {
  elements.cityName.textContent = '';
  elements.countryName.textContent = '';
  elements.tempValue.textContent = '';
  elements.windSpeed.textContent = '';
  elements.humidity.textContent = '';
  
  elements.img.src = ''; // or default image
  elements.img.alt = '';

  elements.input.value = '';
};

// start App
function init(){
    resetUI()
    elements.form.addEventListener('submit', handleSearch);
}

init();