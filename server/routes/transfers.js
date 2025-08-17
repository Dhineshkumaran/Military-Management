import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/history', asyncErrorHandler(async(req, res, next)=>{
    const {base_id} = req.query;
    const response = await Client.query(
        `SELECT * FROM transfers WHERE base_id=$1`,
        [base_id]
    )
    res.status(200).json(response.rows);
}))

router.post('/', asyncErrorHandler(async(req, res, next)=>{
    const {from_base_id, to_base_id, asset_type, quantity, transfer_date} = req.body;
    const {user_id} = req.user;
    const response = await Client.query(
        `INSERT INTO transfers (from_base_id, to_base_id, asset_type, quantity, transfer_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [from_base_id, to_base_id, asset_type, quantity, transfer_date]
    )
    if(response.rowCount > 0){
        const audit_update = await Client.query(
            `INSERT INTO audit_log (action_type, user_id, asset_type, details) VALUES ($1, $2, $3, $4) RETURNING *`,
            ['transfer', req.user.user_id, asset_type, JSON.stringify(response.rows[0])]
        );
    }
    res.status(201).json(response.rows[0]);
}))