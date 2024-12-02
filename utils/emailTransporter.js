import nodemailer from 'nodemailer';
import SubscribeAlert from '../models/SubscribeAlert.js';
import Alert from '../models/Alert.js';
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config()

// Haversine formula to calculate distance between two points on Earth
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailNotifications = async () => {
  try {
    const criticalAlerts = await Alert.find({ severity: 'low', active: true });

    if (criticalAlerts.length > 0) {
      const subscribers = await SubscribeAlert.find();

      for (const subscriber of subscribers) {
        const { email, latitude: subLat, longitude: subLng } = subscriber;

        // Find relevant alerts based on proximity (e.g., within 50 km)
        const relevantAlerts = criticalAlerts.filter((alert) => {
          const { latitude: alertLat, longitude: alertLon } = alert.location;
          const distance = calculateDistance(subLat, subLng, alertLat, alertLon);
          return distance <= 50; 
        });

        if (relevantAlerts.length > 0) {
          const alertMessages = relevantAlerts.map((alert) => `- ${alert.message}`).join('\n');

          // Send email
          await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Critical Weather Alert',
            text: `Dear User,\n\nThe following critical alerts have been issued near your location:\n\n${alertMessages}\n\nStay safe!\n\nBest regards,\nWeather Alert Team`,
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to send notifications:', err.message);
  }
};

export const sendWelcomeEmail = async (subscriber) => {
  try {
    const { email, latitude, longitude } = subscriber;

       // Debug API key
       if (!process.env.OPENWEATHER_API_KEY) {
        console.error('OpenWeather API key is missing');
        throw new Error('Missing API key');
      }

    // Fetch current weather for the subscriber's location
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    console.log(`Fetching weather data from URL: https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);


    const weatherData = response.data;
    const weatherDescription = weatherData.weather[0].description;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    // Email content
    const subject = 'Welcome to Critical Weather Alerts';
    const text = `
      Dear User,

      Thank you for subscribing to Critical Weather Alerts. You will receive notifications about critical weather conditions affecting your area.

      Here's today's weather at your location :
      - Weather: ${weatherDescription}
      - Temperature: ${temperature}°C
      - Humidity: ${humidity}%
      - Wind Speed: ${windSpeed} m/s

      Please note: We will only send you emails about critical weather alerts.

      Stay safe,
      Weather Alert Team
    `;

    // Send email
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
};