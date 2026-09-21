import { ExternalServiceError } from '../errors/index.js';
import { getWeatherForecast } from '../api/openMeteo.js';
import config from '../config/index.js';

const weatherService = {
  async getOutdoorWorkForecast(location) {
    let forecast;

    try {
      forecast = await getWeatherForecast(location.lat, location.lon);
    } catch {
      throw new ExternalServiceError('Unable to retrieve weather forecast');
    }

    const workWindows = forecast.daily.time.map((date, index) => {
      const precipitation = forecast.daily.precipitationSum[index];
      const windSpeed = forecast.daily.windSpeedMax[index];

      return {
        date,
        precipitation,
        windSpeed,
        suitableForOutdoorWork: precipitation === 0 && windSpeed < config.outdoorWorkMaxWindSpeed,
      };
    });

    return {
      forecast,
      outdoorWork: {
        maxWindSpeed: config.outdoorWorkMaxWindSpeed,
        windSpeedUnit: forecast.windSpeedUnit,
        workWindows,
      },
    };
  },
};

export default weatherService;