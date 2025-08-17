import express from 'express';
import authorizeRoles from '../utils/authorizeRoles.js';
import verifyToken from '../utils/verifyToken.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import Client from '../config/connection.js';
const router = express.Router();

router.get('/', asyncErrorHandler(async(req, res, next) => {
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
    console.log(response.rows[0]);
    res.json(response.rows[0]);
})
);

export default router;