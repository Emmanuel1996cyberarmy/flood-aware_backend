import Alert from '../models/Alert.js';
import axios from 'axios';
import { sendEmailNotifications } from '../utils/emailTransporter.js';
import SubscribeAlert from '../models/SubscribeAlert.js';
import dotenv from 'dotenv';
import cron from "node-cron"



dotenv.config()

const OPEN_WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

console.log("open weather", OPEN_WEATHER_API_KEY)


// Critical weather thresholds
const CRITICAL_WEATHER_THRESHOLD = {
  rainfall: 50, 
  windSpeed: 15, // in m/s
  humidity: 85, // percentage
};

export const fetchWeatherAlerts = async () => {
  try {
    const subscriptions = await SubscribeAlert.find(); // Fetch all subscribers
    const subscriptionsWeather = await fetchWeatherForSubscribers(subscriptions);

    let criticalAlertsFound = false;

    for (const { email, data } of subscriptionsWeather) {
      const { weather, main, wind, rain } = data;
      const isCritical =
        (rain?.['1h'] || 0) > CRITICAL_WEATHER_THRESHOLD.rainfall ||
        wind.speed > CRITICAL_WEATHER_THRESHOLD.windSpeed ||
        main.humidity > CRITICAL_WEATHER_THRESHOLD.humidity;

      if (isCritical) {
        criticalAlertsFound = true;
        const message = generateAlertMessage(weather[0]);
        const existingAlert = await Alert.findOne({ message, active: true });

        if (!existingAlert) {
          await Alert.create({
            severity: determineSeverity(weather[0].main),
            location: { latitude: data.coord.lat, longitude: data.coord.lon },
            message,
            source: 'OpenWeatherMap',
          });
        }
      }
    }

    // if (criticalAlertsFound) {
      const emails = subscriptions.map((sub) => sub.email);
      await sendEmailNotifications(emails, 'Critical weather alert in your area!');
    // }
  } catch (err) {
    console.error('Failed to fetch weather alerts:', err.message);
  }
};

const fetchWeatherForSubscribers = async (subscriptions) => {
  return Promise.all(
    subscriptions.map(async (subscription) => {
      const { email, latitude, longitude } = subscription;
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`
      );
      
      return { email, data: response.data };
    })
  );
};


// Helper: Generate alert message
const generateAlertMessage = (city, weather) => {
  const { name } = city;
  const { main, description } = weather;

  return `Critical weather alert for ${name}: ${main} (${description}). Please take precautions.`;
};

// Helper: Determine severity
const determineSeverity = (condition) => {
  switch (condition) {
    case 'Rain':
    case 'Thunderstorm':
      return 'High';
    case 'Drizzle':
    case 'Clouds':
      return 'Moderate';
    default:
      return 'Low';
  }
};

cron.schedule('0 * * * *', async () => {
  console.log('checking for new weather alerts....')
  await fetchWeatherAlerts();
})