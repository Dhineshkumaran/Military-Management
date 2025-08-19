import express from 'express';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import verifyToken from '../middlewares/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/summary', asyncErrorHandler(async(req, res, next) => {
    const {base_id, asset_type, start_date, end_date} = req.query;
    const response = await Client.query(
        `WITH
        -- Purchases
        p AS (
        SELECT
            COALESCE(SUM(CASE WHEN purchase_date < $3 THEN quantity END), 0) AS purchases_before,
            COALESCE(SUM(CASE WHEN purchase_date <= $4 THEN quantity END), 0) AS purchases_until,
            COALESCE(SUM(CASE WHEN purchase_date BETWEEN $3 AND $4 THEN quantity END), 0) AS purchases_in_period
        FROM purchases
        WHERE base_id = $1 AND asset_type = $2
        ),

        -- Transfers
        t AS (
        SELECT
            COALESCE(SUM(CASE WHEN to_base_id = $1 AND transfer_date < $3 THEN quantity END), 0) AS transfers_in_before,
            COALESCE(SUM(CASE WHEN to_base_id = $1 AND transfer_date <= $4 THEN quantity END), 0) AS transfers_in_until,
            COALESCE(SUM(CASE WHEN to_base_id = $1 AND transfer_date BETWEEN $3 AND $4 THEN quantity END), 0) AS transfers_in_period,

            COALESCE(SUM(CASE WHEN from_base_id = $1 AND transfer_date < $3 THEN quantity END), 0) AS transfers_out_before,
            COALESCE(SUM(CASE WHEN from_base_id = $1 AND transfer_date <= $4 THEN quantity END), 0) AS transfers_out_until,
            COALESCE(SUM(CASE WHEN from_base_id = $1 AND transfer_date BETWEEN $3 AND $4 THEN quantity END), 0) AS transfers_out_period
        FROM transfers
        WHERE asset_type = $2
        ),

        -- Expenditures
        e AS (
        SELECT
            COALESCE(SUM(CASE WHEN expenditure_date < $3 THEN quantity END), 0) AS expended_before,
            COALESCE(SUM(CASE WHEN expenditure_date <= $4 THEN quantity END), 0) AS expended_until,
            COALESCE(SUM(CASE WHEN expenditure_date BETWEEN $3 AND $4 THEN quantity END), 0) AS expended_in_period
        FROM expenditures
        WHERE base_id = $1 AND asset_type = $2
        ),

        -- Assignments
        a AS (
        SELECT
            COALESCE(SUM(CASE WHEN assignment_date BETWEEN $3 AND $4 THEN quantity END), 0) AS assigned_in_period
        FROM assignments
        WHERE base_id = $1 AND asset_type = $2
        )

        SELECT
        -- Opening Balance (before start date)
        (p.purchases_before + t.transfers_in_before - t.transfers_out_before - e.expended_before) AS opening_balance,

        -- Closing Balance (till end date)
        (p.purchases_until + t.transfers_in_until - t.transfers_out_until - e.expended_until) AS closing_balance,

        -- Net Movement components (between start and end date)
        p.purchases_in_period AS purchases,
        t.transfers_in_period AS transfers_in,
        t.transfers_out_period AS transfers_out,

        -- Assignments & Expenditures
        a.assigned_in_period AS assigned,
        e.expended_in_period AS expended

        FROM p, t, e, a;`,
        [base_id, asset_type, start_date, end_date]
    );
    res.json(response.rows[0]);
})
);

router.get('/recent-purchases', asyncErrorHandler(async(req, res, next) => {
    const {base_id} = req.query;
    const response = await Client.query(
        `SELECT
            asset_type, (SELECT base_name FROM bases WHERE base_id = $1) AS base_name,
            SUM(quantity) AS total_quantity,
            MAX(purchase_date) AS latest_purchase
        FROM purchases
        WHERE base_id = $1
        GROUP BY asset_type
        ORDER BY latest_purchase DESC
        LIMIT 5`,
        [base_id]
    );
    res.json(response.rows);
})
);

router.get('/recent-transfers', asyncErrorHandler(async(req, res, next) => {
    const {base_id} = req.query;
    const response = await Client.query(
        `SELECT
            asset_type,
            SUM(quantity) AS total_quantity,
            (SELECT base_name FROM bases WHERE base_id = $1) AS from_base_name,
            (SELECT base_name FROM bases WHERE base_id = to_base_id) AS to_base_name,
            MAX(transfer_date) AS latest_transfer
        FROM transfers
        WHERE from_base_id = $1
        GROUP BY asset_type, to_base_id
        ORDER BY latest_transfer DESC
        LIMIT 5`,
        [base_id]
    );
    res.json(response.rows);
})
);

router.get('/bases', asyncErrorHandler(async(req, res, next) => {
    const response = await Client.query(
        `SELECT * FROM bases`
    );
    res.json(response.rows);
})
);

router.get('/equipment-types', asyncErrorHandler(async(req, res, next) => {
    const response = await Client.query(
        `SELECT ARRAY_AGG(DISTINCT asset_type) AS asset_types FROM assets`
    );
    res.json(response.rows[0].asset_types);
})
);

export default router;