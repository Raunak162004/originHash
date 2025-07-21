import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'individual', 'corporate'], 
        default: 'individual'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiry: {
        type: Date,
    },
    refreshToken: String,
}, { timestamps: true });


// Hash the password before saving the user
userSchema.pre('save', async function(next){ 
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = mongoose.model('User', userSchema);

export default User;