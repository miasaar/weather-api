const cityLabel = document.getElementById("cityLabel");
const infoBox = document.getElementById("infoBox");
const backBtn = document.getElementById("back");
const wLat = document.getElementById("w-lat");
const wLon = document.getElementById("w-lon");
const wTemp = document.getElementById("w-temp");
const wCode = document.getElementById("w-code");
const wDay = document.getElementById("w-day");

// Favorites management
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function addToFavorites(name, lat, lon) {
    if (!favorites.some(f => f.name === name)) {
        favorites.push({ name, lat, lon });
        saveFavorites();
        updateFavoritesPanel();
    }
}

function removeFromFavorites(name) {
    favorites = favorites.filter(f => f.name !== name);
    saveFavorites();
    updateFavoritesPanel();
}

function isFavorite(name) {
    return favorites.some(f => f.name === name);
}

function updateFavoritesPanel() {
    const favList = document.getElementById("favourites-list");
    favList.innerHTML = '';

    if (favorites.length === 0) {
        favList.innerHTML = '<span style="opacity: 0.5;">no favourites yet</span>';
        return;
    }

    favorites.forEach(fav => {
        const favBtn = document.createElement("button");
        favBtn.className = "favourite-item";
        favBtn.textContent = fav.name.toLowerCase();
        favBtn.dataset.lat = fav.lat;
        favBtn.dataset.lon = fav.lon;
        favBtn.dataset.name = fav.name;

        favBtn.addEventListener("click", async () => {
            const weather = await getWeatherForLocation(fav.lat, fav.lon, fav.name);
            showWeatherView(fav.name, fav.lat, fav.lon, weather);
        });

        favList.appendChild(favBtn);
    });
}

async function getWeatherForLocation(lat, lon, name) {
    try {
        // Call the Open-Meteo API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,windspeed_10m,weathercode,is_day&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const current = data.current;

        // Convert weather code to condition
        let condition = "UNKNOWN";
        const code = current.weathercode;

        if (code === 0) condition = "CLEAR";
        else if (code >= 1 && code <= 3) condition = "CLOUDY";
        else if (code >= 51 && code <= 67) condition = "RAIN";
        else if (code >= 71 && code <= 77) condition = "SNOW";
        else if (code >= 45 && code <= 48) condition = "FOG";
        else if (code >= 95) condition = "STORM";

        return {
            location: name,
            temperature: Math.round(current.temperature_2m),
            wind: Math.round(current.windspeed_10m),
            condition: condition,
            isDay: Boolean(current.is_day)
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        // Return mock data as fallback
        return {
            location: name,
            temperature: 15,
            wind: 10,
            condition: "UNKNOWN",
            isDay: true
        };
    }
}

function showWeatherView(name, lat, lon, weather) {
    // Show city name at top
    cityLabel.innerHTML = `
        ${name.toLowerCase()}
        <button id="fav-toggle" class="fav-btn" title="${isFavorite(name) ? 'Remove from favorites' : 'Add to favorites'}">
            ${isFavorite(name) ? '★' : '☆'}
        </button>
    `;
    cityLabel.style.display = "block";

    // Add favorite toggle functionality
    document.getElementById("fav-toggle").addEventListener("click", () => {
        if (isFavorite(name)) {
            removeFromFavorites(name);
        } else {
            addToFavorites(name, lat, lon);
        }
        // Update the button
        const btn = document.getElementById("fav-toggle");
        btn.textContent = isFavorite(name) ? '★' : '☆';
        btn.title = isFavorite(name) ? 'Remove from favorites' : 'Add to favorites';
    });

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
}

const locations = document.getElementById("locations");

locations.addEventListener("click", async (e) => {
    const btn = e.target.closest(".location");
    if (!btn) return;

    const lat = parseFloat(btn.dataset.lat);
    const lon = parseFloat(btn.dataset.lon);
    const name = btn.textContent;

    const weather = await getWeatherForLocation(lat, lon, name);
    showWeatherView(name, lat, lon, weather);
});

let asciiInterval; // store interval so we can clear it when switching

function setWeatherVisuals(weather) {
    clearWeatherVisuals();
    const canvas = document.getElementById("ascii-canvas");

    // Calculate rows and cols based on screen size
    const rows = Math.ceil(window.innerHeight / 19) + 2;  // Added +2 for safety
    const cols = Math.ceil(window.innerWidth / 9.6) + 5;  // Added +5 for safety

    if (weather.condition === "RAIN") {
        asciiInterval = setInterval(() => {
            let ascii = "";
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
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
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
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
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
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
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
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
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ascii += Math.random() < 0.1 ? "~" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 180);
    }
    else if (weather.condition === "CLEAR") {
        const sunArt = [
            "      ;   :   ;",
            "   .   \\_,!,_/   ,",
            "    `.,'     `.,'",
            "     /         \\",
            "~ -- :         : -- ~",
            "     \\         /",
            "    ,'`._   _.'`.",
            "   '   / `!` \\   `",
            "      ;   :   ;"
        ];

        if (weather.isDay) {
            let sun = { row: 5, col: 5 };

            asciiInterval = setInterval(() => {
                let ascii = Array(rows).fill("").map(() => " ".repeat(cols));

                sunArt.forEach((line, i) => {
                    const r = sun.row + i;
                    if (r < rows) {
                        let base = ascii[r].split("");
                        for (let c = 0; c < line.length; c++) {
                            const colPos = (sun.col + c) % cols;
                            base[colPos] = line[c];
                        }
                        ascii[r] = base.join("");
                    }
                });

                sun.col = (sun.col + 1) % cols;
                canvas.textContent = ascii.join("\n");
            }, 200);

        } else {
            asciiInterval = setInterval(() => {
                let ascii = "";
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        ascii += Math.random() < 0.1 ? "★" : " ";
                    }
                    ascii += "\n";
                }
                canvas.textContent = ascii;
            }, 500);
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
        { name: "London", lat: 51.50, lon: -0.12 },
        { name: "Sydney", lat: -33.87, lon: 151.21 },
        { name: "Cairo", lat: 30.04, lon: 31.24 },
        { name: "Toronto", lat: 43.65, lon: -79.38 },
        { name: "Mumbai", lat: 19.07, lon: 72.88 },
        { name: "Paris", lat: 48.85, lon: 2.35 },
        { name: "Tallinn", lat: 59.44, lon: 24.75 },
        { name: "San Francisco", lat: 37.77, lon: -122.42 },
        { name: "Copenhagen", lat: 55.68, lon: 12.57 },
        { name: "Stockholm", lat: 59.33, lon: 18.07 },
        { name: "Helsinki", lat: 60.17, lon: 24.94 },
        { name: "Cape Town", lat: -33.93, lon: 18.42 },
        { name: "Melbourne", lat: -37.81, lon: 144.96 },
        { name: "Buenos Aires", lat: -34.61, lon: -58.38 },
        { name: "Zurich", lat: 47.38, lon: 8.54 },
        { name: "Luxembourg", lat: 49.61, lon: 6.13 },
    ];

    const container = document.getElementById("locations");

    cities.forEach((city) => {
        const cityElement = document.createElement("div");
        cityElement.className = "location floating-city";
        cityElement.textContent = city.name;
        cityElement.dataset.lat = city.lat;
        cityElement.dataset.lon = city.lon;

        // Random starting position
        cityElement.style.left = Math.random() * 60 + 10 + "%";
        cityElement.style.top = Math.random() * 70 + 10 + "%";

        // Random animation delay
        cityElement.style.animationDelay = Math.random() * 3 + "s";

        container.appendChild(cityElement);
    });
}

// Keyboard navigation
let cityElements = [];
let currentFocusIndex = -1;

function updateCityElements() {
    cityElements = Array.from(document.querySelectorAll('.location, .favourite-item'));
}

function focusCity(index) {
    if (cityElements.length === 0) return;

    // Remove previous focus
    cityElements.forEach(el => el.style.outline = 'none');

    // Wrap around
    if (index < 0) index = cityElements.length - 1;
    if (index >= cityElements.length) index = 0;

    currentFocusIndex = index;

    // Add focus indicator
    cityElements[index].style.outline = '3px solid white';
    cityElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('keydown', (e) => {
    // If we're viewing a city, only allow Escape to go back
    if (infoBox.style.display === 'block') {
        if (e.key === 'Escape') {
            document.getElementById("back").click();
        }
        return;
    }

    // Update city elements list
    updateCityElements();

    // Arrow navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        focusCity(currentFocusIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        focusCity(currentFocusIndex - 1);
    } else if (e.key === 'Enter' && currentFocusIndex >= 0) {
        e.preventDefault();
        cityElements[currentFocusIndex].click();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        focusCity(currentFocusIndex + 1);
    }
});

// Start when page loads
createFloatingCities();
updateFavoritesPanel();

document.getElementById("back").addEventListener("click", () => {
    cityLabel.style.display = "none";
    infoBox.style.display = "none";
    backBtn.style.display = "none";
    document.getElementById("locations").style.display = "block";
    clearWeatherVisuals();
    document.body.removeAttribute("data-time");
    currentFocusIndex = -1;
});