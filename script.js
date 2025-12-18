const cityLabel = document.getElementById("cityLabel");
const infoBox = document.getElementById("infoBox");
const backBtn = document.getElementById("back");
const wLat = document.getElementById("w-lat");
const wLon = document.getElementById("w-lon");
const wTemp = document.getElementById("w-temp");
const wCode = document.getElementById("w-code");
const wDay = document.getElementById("w-day");

// Change your getWeatherForLocation function to use mock data:
async function getWeatherForLocation(lat, lon, name) {
    // Mock data (replace with real API later)
    const mockData = {
        "Tokyo": { temp: 18, wind: 12, code: 61, isDay: 1 },
        "Berlin": { temp: 8, wind: 15, code: 3, isDay: 1 },
        "New York": { temp: 12, wind: 20, code: 71, isDay: 1 },
        "London": { temp: 10, wind: 18, code: 45, isDay: 0 }
    };

    const mock = mockData[name];
    let condition = "UNKNOWN";

    if (mock.code === 0) condition = "CLEAR";
    else if (mock.code >= 1 && mock.code <= 3) condition = "CLOUDY";
    else if (mock.code >= 51 && mock.code <= 67) condition = "RAIN";
    else if (mock.code >= 71 && mock.code <= 77) condition = "SNOW";
    else if (mock.code >= 45 && mock.code <= 48) condition = "FOG";
    else if (mock.code >= 95) condition = "STORM";

    return {
        location: name,
        temperature: mock.temp,
        wind: mock.wind,
        condition: condition,
        isDay: Boolean(mock.isDay)
    };
}

const locations = document.getElementById("locations");

locations.addEventListener("click", async (e) => {
    const btn = e.target.closest(".location");
    if (!btn) return;

    const lat = parseFloat(btn.dataset.lat);
    const lon = parseFloat(btn.dataset.lon);
    const name = btn.textContent;

    const weather = await getWeatherForLocation(lat, lon, name);

    // Show city name at top
    cityLabel.textContent = name.toLowerCase();
    cityLabel.style.display = "block";

    // Show weather info
    wLat.textContent = lat;
    wLon.textContent = lon;
    wTemp.textContent = weather.temperature;
    wCode.textContent = weather.condition;
    wDay.textContent = weather.isDay ? "DAY" : "NIGHT";
    infoBox.style.display = "block";

    // Show back button
    backBtn.style.display = "block";

    // Hide floating cities
    document.getElementById("locations").style.display = "none";

    // Start animation
    setWeatherVisuals(weather);

    // Change theme
    document.body.dataset.time = weather.isDay ? "day" : "night";
});

let asciiInterval; // store interval so we can clear it when switching

function setWeatherVisuals(weather) {
    clearWeatherVisuals();
    const canvas = document.getElementById("ascii-canvas");

    if (weather.condition === "RAIN") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < 30; r++) {
                for (let c = 0; c < 80; c++) {
                    ascii += Math.random() < 0.3 ? "|" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 100);
    }
    else if (weather.condition === "SNOW") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < 30; r++) {
                for (let c = 0; c < 80; c++) {
                    ascii += Math.random() < 0.2 ? "*" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 150);
    }
    else if (weather.condition === "STORM") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < 30; r++) {
                for (let c = 0; c < 80; c++) {
                    // More intense rain + occasional lightning "/"
                    ascii += Math.random() < 0.5 ? "|" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 60);
    }
    else if (weather.condition === "FOG") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < 30; r++) {
                for (let c = 0; c < 80; c++) {
                    ascii += Math.random() < 0.15 ? "░" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 200);
    }
    else if (weather.condition === "CLOUDY") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < 30; r++) {
                for (let c = 0; c < 80; c++) {
                    ascii += Math.random() < 0.1 ? "~" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 180);
    }
    else if (weather.condition === "CLEAR") {
        if (weather.isDay) {
            canvas.textContent = "☀";
        } else {
            canvas.textContent = "★  ★   ★\n  ★    ★";
        }
    }
}


function clearWeatherVisuals() {
    clearInterval(asciiInterval);
    document.getElementById("ascii-canvas").textContent = "";
}

// Floating city names with click functionality
function createFloatingCities() {
    const cities = [
        { name: "Tokyo", lat: 35.68, lon: 139.69 },
        { name: "Berlin", lat: 52.52, lon: 13.41 },
        { name: "New York", lat: 40.71, lon: -74.01 },
        { name: "London", lat: 51.50, lon: -0.12 }
    ];

    const container = document.getElementById("locations");

    cities.forEach((city) => {
        const cityElement = document.createElement("div");
        cityElement.className = "location floating-city";
        cityElement.textContent = city.name;
        cityElement.dataset.lat = city.lat;
        cityElement.dataset.lon = city.lon;

        // Random starting position
        cityElement.style.left = Math.random() * 80 + 10 + "%";
        cityElement.style.top = Math.random() * 80 + 10 + "%";

        // Random animation delay
        cityElement.style.animationDelay = Math.random() * 3 + "s";

        container.appendChild(cityElement);
    });

}

// Start when page loads
createFloatingCities();
document.getElementById("back").addEventListener("click", () => {
    cityLabel.style.display = "none";
    infoBox.style.display = "none";
    backBtn.style.display = "none";
    document.getElementById("locations").style.display = "block";
    clearWeatherVisuals();
    document.body.removeAttribute("data-time");
});