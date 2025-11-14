import express from 'express';
import dotenv from'dotenv';
import connectDB from './config/db.js';
import User from './models/users.model.js';


dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
    const user =  req.body;
    if(!user.name || !user.phone || !user.email || !user.passworrd || !user.county){
        return res.status(401).json({success: false, message: "please enter all fields"});
    }

    const newUser = new User(user);
    try{
        await newUser.save();
        return res.status(201).json({success:true, daata: newUser});
    }catch(error){
        console.error('error in creating new product');
        return res.status(500).json({success : failure, message:"internal server error"});
    }
    
})