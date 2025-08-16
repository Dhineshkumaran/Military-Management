import mongoose from "mongoose";

const connect = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017');
        console.log('Connected to Database successfully.');
    } catch(error){
        console.error("Error connecting to Database.");
    }
}

export default connect;