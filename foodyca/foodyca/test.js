const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Use body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const start = async () => {
    try {
        const dbConnectionString = process.env.DB_CONNECTION_STRING;

        if (!dbConnectionString) {
            throw new Error('DB_CONNECTION_STRING is not set in the .env file');
        }

        await mongoose.connect(dbConnectionString);
        console.log('Connected to the database');

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`App is listening on port ${port}`);
        });
    } catch (e) {
        console.error(e.message);
    }
}
start();

const notesSchema = {
    name: String,
    email: String
};

const Note = mongoose.model('Note', notesSchema);

// Use app.post for handling POST requests to "/SUBMIT"
app.post("/SUBMIT", async (req, res) => {
    const newNote = new Note({
        name : req.body.name,
        email:req.body.email
    });

    try {
        await newNote.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving note to the database');
    }
})
