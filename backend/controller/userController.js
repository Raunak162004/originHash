import User from '../models/userModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const registerUser = async (req, res) => {

    const { name, email, password, role } = req.body; 

    if(!name || !email || !password || !role) {      //validate 
        return res.status(400).json({
            message: 'All fields are required',
        });
    }

    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: 'User already exsists'
            })
        }
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'individual'
        })
        console.log(user);
        
        if(!user){
            return res.status(500).json({
                message: 'User not created'
            });
        }

                        //    generate verification token

        const token = crypto.randomBytes(32).toString('hex');

                        // save token in database

        user.verificationToken = token;
        await user.save();

                    // send token to user via email

        res.status(200).json({
            message: 'User registered successfully',
            success: true
        })

    }catch(e){
        res.status().json({
            message: 'User not registered',
            success: false
        })
    }
};

const verifyUser = async (req, res) => {
    console.log(req.params);
    const {token} = req.params;
    console.log(token);
    if(!token){
        return res.status(400).json({
            message: 'Token is required'
        })
    }
    const user = await User.findOne({verificationToken: token});
    if(!user){
        return res.status(400).json({
            message: 'invalid token'
        })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
};

const loginUser = async (req, res) => { 
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: 'All fields are required'
        })
    }

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: 'Invalid email or password',
            })
        }
        let cmp = await bcrypt.compare(password, user.password)

        if(!cmp){
            return res.status(400).json({
                message: 'Invalid email or password',
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }); 

            res.status(200).json({
            message: 'User logged in successfully',
            success: true,
            user: {
                name: user.name,
                id: user._id,
            },
            token: token
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: 'User not logged in',
            success: false
        })
    }
};

const logoutUser = async (req,res) => {
    try{
        res.cookie('token', "",{
            httpOnly: true,
            secure: true
        })
        return res.status(200).json({
            message: 'user loggedout'
        })
    }catch(error){
        res.status(500).json({
            message: 'User not logged out',
            success: false
        })
    }
};

export { registerUser, verifyUser, loginUser, logoutUser };