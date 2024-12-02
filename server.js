// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
// import alertRoutes from './routes/alerts.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import routeRoutes from './routes/routes.js';
import subscribeRoute from "./routes/subscribe.js"
import bodyParser from 'body-parser'


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({limit : 52428800}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
// app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribe', subscribeRoute)
app.use('/api/unsubscribe', subscribeRoute)
app.use('/api/check-subscription', subscribeRoute)


app.use('/api/routes', routeRoutes);

// Default route for API status
app.get('/', async (req, res) => {
  res.send('🌐 FloodAware API is running...');
  console.log('Fetching weather alerts...');
  
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server initialization
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
