// install required dependencies
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const { Deta } = require("deta");

// application setup
const deta = Deta(process.env.PROJECT_KEY);
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// initialize tables
const users = deta.Base("users");
const polls = deta.Base("polls");

// route files
const user_routes = require("./user.js");
const poll_routes = require("./poll.js");

// routes
app.get("/", (req, res) => {
    res.json({ "msg": "Wendy's Pigtails Database System" })
});

app.use("/user", user_routes);
app.use("/poll", poll_routes);

// start server
app.listen(8080);