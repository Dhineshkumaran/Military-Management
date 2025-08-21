import express from 'express';
import bcrypt from 'bcrypt';
import Client from '../config/connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CustomError from '../utils/customError.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
dotenv.config();
const router = express.Router();

const generateToken = (user_id, username, role_id, base_id) => {
    const token = jwt.sign({user_id, username, role_id, base_id}, process.env.JWT_SECRET);
    return token;
}

router.post('/', asyncErrorHandler(async(req, res, next) => {
    const {username, password} = req.body;
    const response = await Client.query(
      'SELECT * FROM users WHERE username=$1 LIMIT 1',
      [username]
    );
    const user = response.rows[0];
    if (!user) {
      const error = new CustomError('User not found', 404);
      next(error);
    }
    console.log(user);

    const match = await bcrypt.compare(password, user.password_hash);
    if(match){
        const token = generateToken(user.user_id, user.username, user.role_id, user.base_id);
        res.status(200).json(
          {token: token,
           user: {
            user_id: user.user_id,
            username: user.username, 
            role_id: user.role_id, 
            base_id: user.base_id
           }
          }
        );
    } else{
        const error = new CustomError('Invalid credentials', 400);
        next(error);
    }
}));

export default router;