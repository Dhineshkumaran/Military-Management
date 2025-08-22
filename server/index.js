import express from 'express';
import cors from 'cors';
import Client from './config/connection.js';
import dotenv from 'dotenv';
dotenv.config();

import signupRoutes from './routes/users.js';
import loginRoutes from './routes/login.js';
import dashboardRoutes from './routes/dashboard.js';
import assignmentRoutes from './routes/assignments.js';
import expenditureRoutes from './routes/expenditures.js';
import purchaseRoutes from './routes/purchases.js';
import transferRoutes from './routes/transfers.js';

import CustomError from './utils/customError.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5173',
        'https://military-management-three.vercel.app'
    ]
}))

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/transfers-in', transferRoutes);
app.use('/api/transfers-out', transferRoutes);
app.use('/health', (req, res) => {
    res.status(200).json({status: 'OK'});
});
// app.all('*', (req, res, next)=>{
//     const err = new CustomError(`Can't find the ${req.originalUrl} on the server!`, 404);
//     next(err);
// });

app.use((error, req, res, next) => {
    console.error(error.stack);
    error.statusCode = error.statusCode || 500;
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: process.env.NODE_ENV == 'production'?{}:error
    });
});

async function query(arg){
    const res = await Client.query(arg);
    console.log(res.rows[0]);
}

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', ()=>{
    query('SELECT NOW()');
    console.log(`Server is listening on port ${port}`);
})