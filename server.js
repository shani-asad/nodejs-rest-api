fs = require('fs');
const express = require('express');

const citizensRoute = require('./routes/citizens');
const landmarksRoute = require('./routes/landmarks');

const app = express()

app.use("/api/v1/citizens", citizensRoute);
app.use("/citizens", citizensRoute);

app.use("/api/v1/landmarks", landmarksRoute);
app.use("/landmarks", landmarksRoute);

app.get("/", (req, res) => {
    res.send("choose endpoint: /citizens or /landmarks")
})

app.use((req, res) => {
    res.status(404).send("<h1> Page not found.</h1>")
})

app.listen(3000)