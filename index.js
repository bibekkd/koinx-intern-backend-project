import dotenv from 'dotenv'
import express from "express";
import schedule from 'node-schedule';
import { connectDB } from './db/connection.js';
import { CryptoService } from './services/cryptoService.js';
import apiRoutes from './api/index.js';

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/', apiRoutes);

// Schedule background job to run every 2 hours
schedule.scheduleJob('0 */2 * * *', async () => {
    try {
        await CryptoService.fetchAndStorePrices();
    } catch (error) {
        console.error('Scheduled job failed:', error);
    }
});

// Run the job immediately on startup
CryptoService.fetchAndStorePrices()
    .catch(error => console.error('Initial price fetch failed:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});