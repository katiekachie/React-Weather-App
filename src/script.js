//format and change date
let now = new Date();

let date = document.querySelector("#date");

let currentDate = now.getDate();
let currentHours = now.getHours();
let currentMins = now.getMinutes();

if (currentMins < 10) {
  currentMins = `0${currentMins}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

let month = months[now.getMonth()];
date.innerHTML = `${day}, ${month} ${currentDate}, ${currentHours}:${currentMins}`;

// upcoming forecast code

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayImages(icon) {
  let url = null;
  if (icon === "04d" || icon === "04n") {
    url = `img/04d.png`;
  } else if (icon === "01d" || icon === "01n") {
    url = `img/01d.png`;
  } else if (icon === "02d" || icon === "02n") {
    url = `img/02d.png`;
  } else if (icon === "50d") {
    url = `img/050.png`;
  } else if (icon === "10d") {
    url = `img/10d.png`;
  } else if (icon === "03d" || icon === "03n") {
    url = `img/03d.png`;
  } else if (icon === "09d") {
    url = `img/09d.png`;
  } else if (icon === "13d") {
    url = `img/13d.png`;
  } else if (icon === "11d") {
    url = `img/11d.png`;
  } else {
    url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  return url;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="weatherWrap weatherInfo"">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` 
        <div class="weatherBox">
        <h3>${formatDay(forecastDay.dt)}</h3>
          <img src="${displayImages(
            forecastDay.weather[0].icon
          )}" class=weatherImg>
         <p> ${Math.round(forecastDay.temp.day)}°c</p>
        </div>
   `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "bd628911ba641cac30d433a5b0ffb8c6";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

//change temperature
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let highElement = document.querySelector("#high");
  let lowElement = document.querySelector("#low");
  let iconElement = document.querySelector("#icon");

  celciusTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celciusTemp);
  cityElement.innerHTML = response.data.name;
  highElement.innerHTML = Math.round(response.data.main.temp_max);
  lowElement.innerHTML = Math.round(response.data.main.temp_min);

  iconElement.setAttribute(
    "src",
    `${displayImages(response.data.weather[0].icon)}`
  );

  getForecast(response.data.coord);
}

function search(cityName) {
  let apiKey = "bd628911ba641cac30d433a5b0ffb8c6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(displayTemperature);
}

// selecting form
function clickSearch(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-selector");
  search(cityInputElement.value);
}

//change f to c -- I want to keep this for future reference!
function displayfahrenheitTemp(event) {
  event.preventDefault();
  newCelciusTemp.classList.remove("active");
  fahrenheitTemp.classList.add("active");
  let fahrenheitTempChange = (celciusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTempChange);
}

function displaycelciusTemp(event) {
  event.preventDefault();
  newCelciusTemp.classList.add("active");
  fahrenheitTemp.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celciusTemp);
}

let celciusTemp = null;

// selecting form -- global variable
let form = document.querySelector("#search-form");
form.addEventListener("submit", clickSearch);

//change f to c -- global variable
let fahrenheitTemp = document.querySelector("#fahrenheit");
fahrenheitTemp.addEventListener("click", displayfahrenheitTemp);

let newCelciusTemp = document.querySelector("#celcius");
newCelciusTemp.addEventListener("click", displaycelciusTemp);

//current location

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(myLocation);
}

function myLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "bd628911ba641cac30d433a5b0ffb8c6";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayTemperature);
}

let currentLocation = document.querySelector("#check-location");
currentLocation.addEventListener("click", getCurrentLocation);

search("Torquay");
displayForecast();
