import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/history', asyncErrorHandler(async(req, res, next)=>{
    const {base_id} = req.query;
    const response = await Client.query(
        `SELECT * FROM assignments WHERE base_id=$1`,
        [base_id]
    )
    res.status(200).json(response.rows);
}))

router.post('/', asyncErrorHandler(async(req, res, next)=>{
    const {base_id, asset_type, quantity, assigned_to, assignment_date} = req.body;
    const {user_id} = req.user;
    const response = await Client.query(
        `INSERT INTO assignments (base_id, asset_type, quantity, assigned_to, assignment_date, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [base_id, asset_type, quantity, assigned_to, assignment_date, user_id]
    )
    if(response.rowCount > 0){
        const audit_update = await Client.query(
            `INSERT INTO audit_log (action_type, user_id, asset_type, details) VALUES ($1, $2, $3, $4) RETURNING *`,
            ['assignments', req.user.user_id, asset_type, JSON.stringify(response.rows[0])]
        );
    }
    res.status(201).json(response.rows[0]);
}))

export default router;