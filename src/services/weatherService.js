import { getWeatherForecast } from '../api/openMeteo.js';

const DEFAULT_MAX_WIND_SPEED = 10;

const getMaxWindSpeed = () => {
  const windSpeed = Number(process.env.OUTDOOR_WORK_MAX_WIND_SPEED);

  return Number.isFinite(windSpeed) && windSpeed >= 0 ? windSpeed : DEFAULT_MAX_WIND_SPEED;
};

const weatherService = {
  async getOutdoorWorkForecast(location) {
    const forecast = await getWeatherForecast(location.lat, location.lon);
    const maxWindSpeed = getMaxWindSpeed();
    const workWindows = forecast.daily.time.map((date, index) => {
      const precipitation = forecast.daily.precipitationSum[index];
      const windSpeed = forecast.daily.windSpeedMax[index];

      return {
        date,
        precipitation,
        windSpeed,
        suitableForOutdoorWork: precipitation === 0 && windSpeed < maxWindSpeed,
      };
    });

    return {
      forecast,
      outdoorWork: {
        maxWindSpeed,
        windSpeedUnit: forecast.windSpeedUnit,
        workWindows,
      },
    };
  },
};

export default weatherService;