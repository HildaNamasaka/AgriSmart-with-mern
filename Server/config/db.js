// config/db.js
import e from 'express';
import mongoose from 'mongoose';

 const connectDB = async () =>{
    try{
      console.log("connecting to mongodb....");
      console.log("MONGODB_URI:", process.env.MONGODB_URI);
      
      const conn = await mongoose.connect(process.env.MONGODB_URI,{
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000
      });

      console.log(`Mongodb connected: ${conn.connection.host}`);

    }catch(error){
      console.error(`Error:`, error.message);
      console.error(`Error name: `, error.name);
      process.exit(1);
    }
 };
 export {connectDB};