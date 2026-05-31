<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Buggy SF Weather</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #9bd4ff, #f8fbff);
      color: #182230;
    }

    .app {
      width: min(420px, 90vw);
      padding: 28px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.82);
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
      text-align: center;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 2rem;
    }

    .subtitle {
      margin: 0 0 24px;
      color: #526070;
    }

    .time {
      font-size: 2.3rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .weather {
      display: grid;
      gap: 12px;
      padding: 20px;
      border-radius: 18px;
      background: #edf7ff;
    }

    .temp {
      font-size: 3rem;
      font-weight: 800;
    }

    .condition {
      font-size: 1.2rem;
      color: #344054;
    }

    button {
      margin-top: 22px;
      padding: 12px 18px;
      border: 0;
      border-radius: 999px;
      background: #2563eb;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    .bug-note {
      margin-top: 18px;
      font-size: 0.85rem;
      color: #667085;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>San Francisco Weather</h1>
    <p class="subtitle">Definitely accurate. Probably.</p>

    <section>
      <div id="clock" class="time">Loading time...</div>
    </section>

    <section class="weather">
      <div id="temperature" class="temp">--°F</div>
      <div id="condition" class="condition">Fetching fog...</div>
      <div id="wind">Wind: -- mph</div>
      <div id="updated">Updated: never</div>
    </section>

    <button onclick="loadWeather()">Refresh Weather</button>

    <p class="bug-note">Known issue: this app contains intentional bugs.</p>
  </main>

  <script>
    const city = "San Francisco";
    const latitude = 37.7749;
    const longitude = -122.4194;

    function updateClock() {
      const now = new Date();

      // BUG: Uses the visitor's local timezone instead of San Francisco's timezone.
      document.getElementById("clock").textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    async function loadWeather() {
      const temperature = document.getElementById("temperature");
      const condition = document.getElementById("condition");
      const wind = document.getElementById("wind");
      const updated = document.getElementById("updated");

      temperature.textContent = "Loading...";
      condition.textContent = "Asking the clouds...";

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${longitude}&longitude=${latitude}&current_weather=true`;

        const response = await fetch(url);
        const data = await response.json();

        // BUG: Open-Meteo returns Celsius, but this labels it as Fahrenheit.
        const temp = data.current_weather.temperature;

        // BUG: Weather codes are not translated correctly.
        const fakeConditions = ["Sunny", "Foggy", "Windy", "Mystery Weather"];
        const randomCondition = fakeConditions[Math.floor(Math.random() * fakeConditions.length)];

        temperature.textContent = Math.round(temp) + "°F";
        condition.textContent = randomCondition + " in " + city;
        wind.textContent = "Wind: " + data.current_weather.windspeed + " mph";

        // BUG: Shows the user's local timestamp, not the API timestamp.
        updated.textContent = "Updated: " + new Date().toLocaleString();
      } catch (error) {
        temperature.textContent = "NaN°F";
        condition.textContent = "Weather machine broke.";
        wind.textContent = "Wind: sideways";
        updated.textContent = "Updated: eventually";
      }
    }

    // BUG: Clock only starts after one second, leaving stale loading text briefly.
    setInterval(updateClock, 1000);

    loadWeather();
  </script>
</body>
</html>
