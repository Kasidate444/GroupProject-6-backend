import express from 'express';
import { connectDB } from './config/mongodb.js'

const app = express();

app.use(express.json());

connectDB();


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`);
})