const inputVille = document.querySelector("#cityInput");
const bouton = document.getElementById("submitButton");




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
    latitude = data[0].lat;
    longitude = data[0].lon;
    console.log(latitude, longitude);
  
    return latitude, longitude;
}

