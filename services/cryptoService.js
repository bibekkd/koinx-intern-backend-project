import axios from 'axios';
import { Price } from '../db/schema.js';

export class CryptoService {
    static async fetchAndStorePrices() {
        const coins = ['bitcoin', 'matic-network', 'ethereum'];
        
        try {
            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
                params: {
                    ids: coins.join(','),
                    vs_currencies: "usd",
                    include_market_cap: true,
                    include_24hr_change: true
                }
            });

            const pricePromises = Object.entries(response.data).map(([coin, data]) => 
                Price.create({
                    coin: coin,
                    price: data.usd,
                    marketCap: data.usd_market_cap,
                    "24hChange": data.usd_24h_change
                })
            );

            await Promise.all(pricePromises);
            console.log('Price data stored successfully');
        } catch (error) {
            console.error('Error fetching/storing prices:', error);
            throw error;
        }
    }

    static async getLatestPrice(coin) {
        const price = await Price.findOne({ coin })
            .sort({ timestamp: -1 });
        if (!price) throw new Error('Coin not found');
        return price;
    }

    static async getPriceDeviation(coin) {
        const prices = await Price.find({ coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price');

        if (prices.length === 0) {
            throw new Error('No price data available');
        }

        const priceValues = prices.map(p => p.price);
        const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
        
        const squaredDiffs = priceValues.map(price => Math.pow(price - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b) / squaredDiffs.length;
        const standardDeviation = Math.sqrt(avgSquaredDiff);

        return Number(standardDeviation.toFixed(2));
    }
}