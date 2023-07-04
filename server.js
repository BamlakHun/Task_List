require("dotenv").config();
const express = require("express");
const mongoose = require ("mongoose");
const cookieParser = require("cookie-parser");

// import routes
const authRoute = require("./routes/auth");
const taskListsRoute = require("./routes/taskLists")

// intialize server
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// initial test server (Get)
app.get("/", (req, res) => {
    res.send("Task mangement app running");
});



app.use("/api/auth", authRoute);
app.use("/api/taskLists", taskListsRoute);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('database connected');

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});