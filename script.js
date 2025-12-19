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
            for (let r = 0; r < 50; r++) {  // Changed from 30 to 50
                for (let c = 0; c < 160; c++) {  // Changed from 80 to 150
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
            for (let r = 0; r < 50; r++) {  // Changed from 30 to 50
                for (let c = 0; c < 160; c++) {  // Changed from 80 to 150
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
            for (let r = 0; r < 50; r++) {  // Changed from 30 to 50
                for (let c = 0; c < 160; c++) {  // Changed from 80 to 150
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
            for (let r = 0; r < 50; r++) {  // Changed from 30 to 50
                for (let c = 0; c < 160; c++) {  // Changed from 80 to 150
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
            for (let r = 0; r < 50; r++) {  // Changed from 30 to 50
                for (let c = 0; c < 160; c++) {  // Changed from 80 to 150
                    ascii += Math.random() < 0.1 ? "~" : " ";
                }
                ascii += "\n";
            }
            canvas.textContent = ascii;
        }, 180);
    }
    else if (weather.condition === "CLEAR") {
        const rows = 50;
        const cols = 160;
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
            // Initialize a single sun starting somewhere
            let sun = { row: 5, col: 5 }; // top-left starting position

            asciiInterval = setInterval(() => {
                // Create empty canvas
                let ascii = Array(rows).fill("").map(() => " ".repeat(cols));

                // Overlay sunArt onto ascii canvas
                sunArt.forEach((line, i) => {
                    const r = sun.row + i;
                    if (r < rows) {
                        let base = ascii[r].split("");
                        for (let c = 0; c < line.length; c++) {
                            const colPos = (sun.col + c) % cols; // wrap horizontally
                            base[colPos] = line[c];
                        }
                        ascii[r] = base.join("");
                    }
                });

                // Update sun position (move right)
                sun.col = (sun.col + 1) % cols;

                // Render
                canvas.textContent = ascii.join("\n");
            }, 200);

        } else {
            // Night stars
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