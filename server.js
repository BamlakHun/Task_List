require("dotenv").config();
const express = require("express");
const mongoose = require ("mongoose");

// import routes
const authRoute = require("./routes/auth");

// intialize server
const app = express();

app.use(express.json());
app. use(express.urlencoded());

// initial test server (Get)
app.get("/", (req, res) => {
    res.send("Task Mangement app running");
});

app.post("/task", (req, res) => {
    if(req.body.task){ 
    return res.json({task: req.body.task});
} else {
    return res.status(400).json({ error: "No task has been assigned yet" });
        }
    });

app.use("/api/auth", authRoute);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('database connected');

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});