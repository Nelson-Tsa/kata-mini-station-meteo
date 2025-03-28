const inputVille = document.querySelector("#cityInput");
const bouton = document.getElementById("searchButton");
const temperature = document.querySelector("#temperature");
const city = document.querySelector("#city");
const details = document.querySelector("#details");
const gps = document.querySelector("#gps");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const meteoIcon = document.querySelector("#weatherIcon");
const chart = document.querySelector("#myChart");
const backgroundImage = document.querySelector("#backgroundImage");

chart.style.display = "none";

let latitude;
let longitude;
let codeMeteo;
let myChart;


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
        city.innerHTML = "Ville introuvable !";
        details.innerHTML = "Ville le nom de la ville";
        return;
    }
    latitude = data[0].lat;
    longitude = data[0].lon;
    console.log(latitude, longitude);
    city.innerHTML = ville;
    gps.innerHTML = `${latitude}, ${longitude}`;
    fetchWeather(latitude, longitude).then((data) => {
        console.log(data);
        const isDay = data.current.is_day;
        fetchCityImage(ville, isDay);
    });
    return latitude, longitude;
}

async function fetchWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,daylight_duration,sunshine_duration,sunset,weather_code,apparent_temperature_max,apparent_temperature_min,uv_index_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_direction_10m_dominant,wind_speed_10m_max&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,wind_speed_10m,weather_code,visibility,uv_index&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature&timezone=auto`
    );
    const data = await response.json();

     temperature.innerHTML = `${data.current.apparent_temperature} °C`;
     humidity.innerHTML = `Humidité : ${data.current.relative_humidity_2m} %`;
     wind.innerHTML = `Vent : ${data.current.wind_speed_10m} km/h`;
    details.innerHTML = `Temperature actuelle`;
    codeMeteo = data.current.weather_code;
    getWeatherIcon(codeMeteo);
    console.log(codeMeteo);
    console.log(data);
    meteoDernierjours(latitude, longitude).then((data) => {
        // console.log(data + "la");
        
    });
    return data;
}

function getWeatherIcon(code) {
    if(code === 0) {
        meteoIcon.innerHTML = "☀️";
    }
    else if(code <= 2) {
        meteoIcon.innerHTML = "🌤️";
    }
    else if(code  === 3) {
        meteoIcon.innerHTML = "🌥️";
    }
    else if(code  <= 48) {
        meteoIcon.innerHTML = "🌫️";
    }
    else if(code  <= 55) {
        meteoIcon.innerHTML = "🌦️";
    }
    else if(code  <= 57) {
        meteoIcon.innerHTML = "🌨️";
    }
    else if(code  <= 65) {
        meteoIcon.innerHTML = "🌧️";
    }
    else if(code  <= 67) {
        meteoIcon.innerHTML = "🌨️";
    }
    else if(code  === 77) {
        meteoIcon.innerHTML = "❄️";
    }
    else if(code  <=82 ) {
        meteoIcon.innerHTML = "🌧️";
    }
    else if(code <= 86) {
        meteoIcon.innerHTML = "🌨️❄️";
    }
    else if(code === 95) {
        meteoIcon.innerHTML = "🌩️";
    }
    else if(code <= 99) {
        meteoIcon.innerHTML = "⛈️";
    }
    
}


async function meteoDernierjours(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&past_days=2`
    )
    const data = await response.json();
    console.log(data);
    updateChart(data);
}


const ctx = document.getElementById('myChart');

function updateChart(data) {
  if (myChart) {
    myChart.destroy();
  }
    chart.style.display = "block";
    const hier = data.hourly.time[12];
    const avanthier = data.hourly.time[36];
    const aujourdhui = data.hourly.time[60];
    const demain = data.hourly.time[84];
    const apresDemain = data.hourly.time[108];

    let hierDate = hier.split("T")[0];
    hierDate = hierDate.split("-").reverse().join("/");
    let avantHierDate = avanthier.split("T")[0];
    avantHierDate = avantHierDate.split("-").reverse().join("/");
    let aujourdhuiDate = aujourdhui.split("T")[0];
    aujourdhuiDate = aujourdhuiDate.split("-").reverse().join("/");
    let demainDate = demain.split("T")[0];
    demainDate = demainDate.split("-").reverse().join("/");
    let apresDemainDate = apresDemain.split("T")[0];
    apresDemainDate = apresDemainDate.split("-").reverse().join("/");

    let hierTemp = data.hourly.temperature_2m[12];
    let avantHierTemp = data.hourly.temperature_2m[36];
    let aujourdhuiTemp = data.hourly.temperature_2m[60];
    let demainTemp = data.hourly.temperature_2m[84];
    let apresDemainTemp = data.hourly.temperature_2m[108];

myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [hierDate, avantHierDate, aujourdhuiDate, demainDate, apresDemainDate],
    datasets: [{
      label: 'Temperature',
      data: [hierTemp, avantHierTemp, aujourdhuiTemp, demainTemp, apresDemainTemp],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

}

const apikey = "Drv7-pzrzSqOXqgrj2I2_9qyEp61XgAY82o79grl8PE";

async function fetchCityImage(ville, isDay) {
    const query = `${ville} ${isDay ? 'day' : 'night'}`;
    const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&client_id=${apikey}`
    );
    const data = await response.json();
    const imageUrl = data.urls.regular;
    backgroundImage.style.backgroundImage = `url(${imageUrl})`;
}