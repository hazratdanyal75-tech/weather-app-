const apiKey = "12e66aee9a7b5c3141fc50e34412d03b"; // <--- APNI KEY YAHAN PASTE KAREIN

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        
        if(data.cod === "404") return alert("City not found");

        updateMainUI(data);
        getForecast(data.coord.lat, data.coord.lon);
        updateBackground(data.weather[0].main);
    } catch (err) { console.error(err); }
}

function updateMainUI(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("mainTemp").innerText = Math.round(data.main.temp);
    document.getElementById("mainDesc").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("windSpeed").innerText = data.wind.speed + " km/h";
    document.getElementById("mainIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    
    const now = new Date();
    document.getElementById("currentDate").innerText = now.toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'short'});
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await res.json();
    
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    for(let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const dayName = new Date(day.dt_txt).toLocaleDateString('en', {weekday: 'short'});
        container.innerHTML += `
            <div class="forecast-item">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°</p>
            </div>
        `;
    }
}

function updateBackground(condition) {
    const body = document.body;
    let imgUrl = "";
    
    if(condition.includes("Cloud")) imgUrl = "https://images.unsplash.com/photo-1534088568595-a066f7104211?q=80&w=1000";
    else if(condition.includes("Rain")) imgUrl = "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000";
    else if(condition.includes("Clear")) imgUrl = "https://images.unsplash.com/photo-1506224477000-07aa8a76be90?q=80&w=1000";
    else imgUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000";
    
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imgUrl}')`;
}

// Event Listeners
document.getElementById("searchBtn")?.addEventListener("click", () => getWeatherData(document.getElementById("cityInput").value));

// Enter key support
document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if(e.key === "Enter") getWeatherData(e.target.value);
});

// Auto-Location on Start
window.onload = () => {
    navigator.geolocation.getCurrentPosition(pos => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${apiKey}`)
        .then(r => r.json()).then(d => {
            updateMainUI(d);
            getForecast(d.coord.lat, d.coord.lon);
            updateBackground(d.weather[0].main);
        });
    }, () => getWeatherData("Islamabad"));
};
