const container = document.getElementById("weather-container");
const loader = document.getElementById("loader");
const errorDiv = document.getElementById("error");

const cities = [
  {name:"Delhi", lat:28.61, lon:77.23},
  {name:"London", lat:51.50, lon:-0.12},
  {name:"Tokyo", lat:35.67, lon:139.65}
];

function getWeatherIcon(code){

  if(code === 0) return {icon:"☀️", text:"Clear Sky"};
  if(code <= 3) return {icon:"⛅", text:"Partly Cloudy"};
  if(code <= 48) return {icon:"☁️", text:"Cloudy"};
  if(code <= 67) return {icon:"🌧", text:"Rain"};
  if(code <= 77) return {icon:"❄️", text:"Snow"};
  return {icon:"⛈", text:"Storm"};
}

function createCard(city,temp,code){

  const weather = getWeatherIcon(code);

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="city">${city}</div>
    <div class="icon">${weather.icon}</div>
    <div class="temp">${temp}°C</div>
    <div class="condition">${weather.text}</div>
  `;

  container.appendChild(card);
}

async function fetchWeather(){

  try{

    const requests = cities.map(city =>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
    );

    const responses = await Promise.all(requests);

    const data = await Promise.all(
      responses.map(res => res.json())
    );

    loader.style.display = "none";

    data.forEach((weather,index)=>{

      const temp = weather.current_weather.temperature;
      const code = weather.current_weather.weathercode;

      createCard(cities[index].name,temp,code);

    });

  }
  catch(error){

    loader.style.display="none";
    errorDiv.textContent="⚠ Unable to fetch weather data";

  }

}

fetchWeather();
