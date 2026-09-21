const FORECAST_URL = process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_TIMEOUT_MS = 5000;

const getTimeoutMs = () => {
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS);

  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;
};

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeoutMs = getTimeoutMs();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Weather request timed out after ${timeoutMs} ms`);
    }

    throw new Error('Unable to connect to weather API');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Weather API returned status ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Weather API returned invalid JSON');
  }
};

const getWeatherForecast = async (latitude, longitude, days = 7) => {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
    forecast_days: String(days),
    timezone: 'auto',
    wind_speed_unit: 'ms',
  }).toString();

  const data = await fetchJson(url);
  const daily = data.daily;

  return {
    timezone: data.timezone,
    temperatureUnit: data.daily_units?.temperature_2m_max,
    precipitationUnit: data.daily_units?.precipitation_sum,
    windSpeedUnit: data.daily_units?.wind_speed_10m_max,
    daily: {
      time: daily.time,
      temperatureMax: daily.temperature_2m_max,
      temperatureMin: daily.temperature_2m_min,
      precipitationSum: daily.precipitation_sum,
      windSpeedMax: daily.wind_speed_10m_max,
    },
  };
};

export { getWeatherForecast };