const APIkey = 'e6098da7de304a699e9103515241712';
const baseUrl = 'https://api.weatherapi.com/v1/';
const container = document.querySelector("#container");
const searchInput = document.querySelector("#searchInput");
let weatherData = {}; 

const getDataDetails = (dateString) => {
    const date = new Date(dateString);
    const weekDay = date.toLocaleString("en-US", { weekday: "long" });
    const day = date.toLocaleString("en-US", { day: "2-digit" });
    const month = date.toLocaleString("en-US", { month: "long" });
    return { weekDay, day, month };
};

function displayWeatherData(forecast) {
    let content = ``;

    forecast.forEach((day, index) => {
        const { weekDay, day: date, month } = getDataDetails(day.date);
        const { maxtemp_c, mintemp_c, condition, daily_chance_of_rain, maxwind_kph } = day.day;

        content += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center border-0">
                        <h3>${weekDay}</h3>
                        ${index === 0 ? `<h3>${date} ${month}</h3>` : ``}
                    </div>
                    <div class="card-body">
                        <h4>${weatherData.location.name}</h4>
                        <div class="weather d-flex justify-content-between align-items-center">
                            ${
                                index === 0
                                    ? `
                                <h2>${maxtemp_c}°C</h2>
                                <div class="image">
                                    <img src="${condition.icon}" alt="${condition.text}">
                                </div>`
                                    : `
                                <div class="d-flex justify-content-center align-items-center flex-column mx-auto">
                                    <img src="${condition.icon}" alt="${condition.text}">
                                    <h2>${maxtemp_c}°C </h2>  
                                    <h2>${mintemp_c}°C</h2>
                                </div>`
                            }
                        </div>
                        <h3 class="condition text-center my-4">${condition.text}</h3>
                    </div>
                    ${
                        index === 0
                            ? `
                        <div class="p-2 weather-info d-flex justify-content-between align-items-center mt-5">
                            <h5 class="rain">
                                <img src="./images/icon-umberella.png" alt="Rain chance">
                                <span>${daily_chance_of_rain}%</span>
                            </h5>
                            <h5 class="winds">
                                <img src="./images/icon-wind.png" alt="Wind speed">
                                <span>${maxwind_kph} KM/H</span>
                            </h5>
                            <h5 class="direction">
                                <img src="./images/icon-compass.png" alt="Wind direction">
                                <span>${weatherData.current.wind_dir}</span>
                            </h5>
                        </div>` 
                            : ``
                    }
                </div>
            </div>`;
    });

    container.innerHTML = content;
}

const getWeatherData = async (searchParamter = "alexandria") => {
    if (!searchParamter.trim()) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                getWeatherData(`${data.coords.latitude},${data.coords.longitude}`);
            }, () => {
                getWeatherData("alexandria"); 
            });
        } else {
            getWeatherData("alexandria"); 
        }
        return;
    }

    try {
        const response = await fetch(`${baseUrl}forecast.json?key=${APIkey}&q=${searchParamter}&days=3`);
        weatherData = await response.json();
        displayWeatherData(weatherData.forecast.forecastday);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
};


let debounceTimer;
searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => getWeatherData(e.target.value), 500);
});

searchInput.addEventListener("focus", () => {
    if (searchInput.value === "") {
        getWeatherData(); 
    }
});

getWeatherData();
