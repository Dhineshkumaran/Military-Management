import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import Client from './config/connection.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5174']
}))

async function query(arg){
    const res = await Client.query(arg);
    console.log(res.rows[0]);
}

app.listen(3000, 'localhost', ()=>{
    query('SELECT NOW()');
    console.log("Server is listening on port 3000");
})