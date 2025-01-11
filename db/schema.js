import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
    coin: String,
    price: Number,
    marketCap: Number,
    "24hChange": Number,
    timestamp: { type: Date, default: Date.now }
});

export const Price = mongoose.model('Price', PriceSchema);