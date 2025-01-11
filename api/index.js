import express from "express";
import { CryptoService } from '../services/cryptoService.js';

const router = express.Router();

router.get("/stats", async (req, res) => {
    const { coin } = req.query;
    
    try {
        const priceData = await CryptoService.getLatestPrice(coin);
        res.json({
            price: priceData.price,
            marketCap: priceData.marketCap,
            "24hChange": priceData["24hChange"]
        });
    } catch (error) {
        if (error.message === 'Coin not found') {
            res.status(404).json({ error: 'Coin not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.get("/deviation", async (req, res) => {
    const { coin } = req.query;
    
    try {
        const deviation = await CryptoService.getPriceDeviation(coin);
        res.json({ 
            deviation: deviation 
        });
    } catch (error) {
        if (error.message === 'No price data available') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router;