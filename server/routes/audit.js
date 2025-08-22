import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/',  asyncErrorHandler(async(req, res, next)=>{
    const response = await Client.query(
        `SELECT * FROM audit_log`
    )
    res.status(200).json(response.rows);
}))

export default router;