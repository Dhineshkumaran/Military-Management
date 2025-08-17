import express from 'express';
import authorizeRoles from '../utils/authorizeRoles.js';
import verifyToken from '../utils/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/', asyncErrorHandler(async(req, res, next)=>{
    const {base_id, date} = req.query;
    const response = await Client.query(
        `SELECT * FROM purchases WHERE base_id=$1 AND date=$2`,
        [base_id, date]
    )
    res.status(200).json(response.rows);
}))

router.post('/', asyncErrorHandler(async(req, res, next)=>{
    const {base_id, user_id} = req.user;
    const {asset_type, quantity, date} = req.body;
    const response = await Client.query(
        `INSERT INTO purchases (base_id, asset_type, quantity, purchase_date, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [base_id, asset_type, quantity, date, user_id]
    )
    res.status(201).json(response.rows[0]);
}))