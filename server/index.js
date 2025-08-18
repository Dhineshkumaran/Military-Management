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

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5173']
}))

app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/expenditures', expenditureRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/transfers', transferRoutes);
app.use('/transfers-in', transferRoutes);
app.use('/transfers-out', transferRoutes);

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

app.listen(3000, 'localhost', ()=>{
    query('SELECT NOW()');
    console.log("Server is listening on port 3000");
})