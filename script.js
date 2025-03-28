const inputVille = document.querySelector("#cityInput");
const bouton = document.getElementById("searchButton");
const temperature = document.querySelector("#temperature");
const city = document.querySelector("#city");
const details = document.querySelector("#details");
const gps = document.querySelector("#gps");


let latitude;
let longitude;




bouton.addEventListener("click", function (event) {
    event.preventDefault();
    const ville = inputVille.value;
    fetchCoordinates(ville);
});



async function fetchCoordinates(ville) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${ville}&format=json&addressdetails=1&limit=1&polygon_svg=1&extratags=1&namedetails=1&countrycodes=fr&accept-language=fr&bounded=1`
    );
   
    const data = await response.json();
    console.log(data);
    if (data === undefined || data.length === 0) {
        alert("Ville introuvable !");
        return;
    }
    latitude = data[0].lat;
    longitude = data[0].lon;
    console.log(latitude, longitude);
    city.innerHTML = ville;
    gps.innerHTML = `${latitude}, ${longitude}`;
    fetchWeather(latitude, longitude).then((data) => {
        console.log(data);
    });
    return latitude, longitude;
}

async function fetchWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,daylight_duration,sunshine_duration,sunset,weather_code,apparent_temperature_max,apparent_temperature_min,uv_index_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_direction_10m_dominant,wind_speed_10m_max&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,wind_speed_10m,weather_code,visibility,uv_index&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature&timezone=auto`
    );
    const data = await response.json();


    console.log(data);
  
   
    return data;
}