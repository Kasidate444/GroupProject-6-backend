import { mongoose } from 'mongoose'

export async function connectDB() {

    const uri = process.env.MONGO_DB_URI;

    try {
        await mongoose.connect(uri, { dbName: 'audlist' });
        console.log('Database connected successfully');
    } catch (err) {
        console.error("Error connecting to MongoDB: ", err);
        throw err;
    }

}