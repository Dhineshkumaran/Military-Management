import express from 'express';
import cors from 'cors';
import connect from './config/connection.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5174']
}))

app.listen(3000, 'localhost', ()=>{
    connect();
    console.log("Server is listening on port 3000");
})