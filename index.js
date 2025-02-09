const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./db');
const admin= require('./routes/admin')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

app.use("/admin", admin);




app.listen(3000, () => {
    console.log('Server running on port 3000');
});