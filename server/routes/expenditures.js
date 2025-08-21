import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/history', verifyToken, authorizeRoles(1, 2, 3), asyncErrorHandler(async(req, res, next)=>{
    const response = await Client.query(
        `SELECT * FROM expenditures`
    )
    res.status(200).json(response.rows);
}))

router.post('/', verifyToken, authorizeRoles(1, 2), asyncErrorHandler(async(req, res, next)=>{
    const {base_id, asset_type, quantity, reason, expenditure_date} = req.body;
    const {user_id} = req.user;
    const response = await Client.query(
        `INSERT INTO expenditures (base_id, asset_type, quantity, reason, expenditure_date, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [base_id, asset_type, quantity, reason, expenditure_date, user_id]
    )
    if(response.rowCount > 0){
        const audit_update = await Client.query(
            `INSERT INTO audit_log (action_type, user_id, asset_type, details) VALUES ($1, $2, $3, $4) RETURNING *`,
            ['expenditure', req.user.user_id, asset_type, JSON.stringify(response.rows[0])]
        );
    }
    res.status(201).json(response.rows[0]);
}))

export default router;