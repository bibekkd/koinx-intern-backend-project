import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};