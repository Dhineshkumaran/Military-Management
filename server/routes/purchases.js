import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/', verifyToken, authorizeRoles(1, 2, 3), asyncErrorHandler(async(req, res, next)=>{
    const {base_id, start_date, end_date, asset_type} = req.query;
    if(base_id && start_date && end_date && asset_type){
        const response = await Client.query(
            `SELECT 
            p.asset_type, 
            p.quantity, p.base_id,
            (SELECT b.base_name FROM bases b WHERE b.base_id = p.base_id LIMIT 1) AS base_name, 
            p.purchase_date, 
            (SELECT u.username FROM users u WHERE u.user_id = p.created_by LIMIT 1) AS created_by_name 
            FROM purchases p
            WHERE p.base_id = $1 
            AND p.purchase_date BETWEEN $2 AND $3 
            AND p.asset_type = $4`,
            [base_id, start_date, end_date, asset_type]
        )
        res.status(200).json(response.rows);
    } else{
        const response = await Client.query(
            `SELECT p.asset_type, p.quantity, p.base_id, p.purchase_date, (SELECT b.base_name FROM bases b WHERE b.base_id = p.base_id LIMIT 1) AS base_name, (SELECT u.username FROM users u WHERE u.user_id = p.created_by LIMIT 1) AS created_by_name FROM purchases p`
        )
        res.status(200).json(response.rows);
    }
}))

router.post('/', verifyToken, authorizeRoles(1, 2), asyncErrorHandler(async(req, res, next)=>{
    const {base_id, user_id} = req.user;
    const {asset_type, quantity, date} = req.body;
    const response = await Client.query(
        `INSERT INTO purchases (base_id, asset_type, quantity, purchase_date, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [base_id, asset_type, quantity, date, user_id]
    )
    if(response.rowCount > 0){
        const audit_update = await Client.query(
            `INSERT INTO audit_log (action_type, user_id, asset_type, details) VALUES ($1, $2, $3, $4) RETURNING *`,
            ['purchase', req.user.user_id, asset_type, JSON.stringify(response.rows[0])]
        );
    }
    res.status(201).json(response.rows[0]);
}))

export default router;