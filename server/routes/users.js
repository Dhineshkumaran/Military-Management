import express from 'express';
import bcrypt from 'bcrypt';
import Client from '../config/connection.js';
const router = express.Router();
import asyncErrorHandler from '../utils/asyncErrorHandler.js';

router.post('/', asyncErrorHandler(async(req, res, next) => {
    const {username, password, role_id, base_id} = req.body;
    const hash = await bcrypt.hash(password, 8);
    const response = await Client.query(
        `INSERT INTO users (username, password_hash, role_id, base_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [username, hash, role_id, base_id]
    );

    if(response.rowCount == 1){
        const audit_update = await Client.query(
            `INSERT INTO audit_log (action_type, user_id, details) VALUES ($1, $2, $3) RETURNING *`,
            ['NEW_USER', req.user.user_id, JSON.stringify(response.rows[0])]
        );
    }

    res.status(201).json({user: response.rows[0]});
}));

export default router;