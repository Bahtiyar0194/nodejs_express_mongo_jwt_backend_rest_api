const { PORT } = require('./config');
const { DB_USER, DB_PASSWORD} = require('./dbConfig');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter')
const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.6n7ypit.mongodb.net/?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log('Server started on port ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

start();