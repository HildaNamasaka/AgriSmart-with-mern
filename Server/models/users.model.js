import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    phone: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password:{type:String, required:true},
    county:{type:String, required:true},
    location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] 
    },
    farm: Number,
    crops:String,
    role:{type:String, enum:['farmer', 'buyer', 'admin'], default:'farmer'},
    createdAt: {type: Date, default:Date.now}
});

//hashing the password before saving the user
UserSchema,pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
    next();
    
});

const User = mongoose.model('user', userSchema);
export default User;