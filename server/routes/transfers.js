import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/history', asyncErrorHandler(async(req, res, next)=>{
    const response = await Client.query(
        `SELECT *, (SELECT base_name FROM bases WHERE base_id = t.from_base_id) AS from_base_name, (SELECT base_name FROM bases WHERE base_id = to_base_id) AS to_base_name, (SELECT username FROM users u WHERE u.user_id=t.created_by) AS created_by_name FROM transfers t`,
    )
    res.status(200).json(response.rows);
}))

router.get('/', asyncErrorHandler(async(req, res, next)=>{
    const {base_id, start_date, end_date, asset_type} = req.query;
    const response = await Client.query(
        `SELECT 
            t.transfer_id,
            t.asset_type,
            t.quantity,
            b_from.base_name AS from_base,
            b_to.base_name   AS to_base,
            t.transfer_date
        FROM transfers t
        JOIN bases b_from ON t.from_base_id = b_from.base_id
        JOIN bases b_to ON t.to_base_id = b_to.base_id
        WHERE t.from_base_id = $1 AND t.transfer_date BETWEEN $2 AND $3 AND t.asset_type = $4`,
        [base_id, start_date, end_date, asset_type]
    )
    res.status(200).json(response.rows);
}))

router.get('/', asyncErrorHandler(async(req, res, next)=>{
    const {base_id, start_date, end_date, asset_type} = req.query;
    const response = await Client.query(
        `SELECT 
            t.transfer_id,
            t.asset_type,
            t.quantity,
            b_from.base_name AS from_base,
            b_to.base_name   AS to_base,
            t.transfer_date
        FROM transfers t
        JOIN bases b_from ON t.from_base_id = b_from.base_id
        JOIN bases b_to ON t.to_base_id = b_to.base_id
        WHERE t.from_base_id = $1 AND transfer_date BETWEEN $2 AND $3 AND asset_type=$4`,
        [base_id, start_date, end_date, asset_type]
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

export default router;