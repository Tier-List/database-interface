// install required dependencies
const express = require("express");
const app = express();

// application setup
app.use(bodyParser.urlencoded({
    extended: true
}));

// route files
const user_routes = require("./user.js");
const poll_routes = require("./poll.js");

// routes
app.get("/", async (req, res) => {
    res.json({ "msg": "Wendy's Pigtails Database System" });
});

app.use("/user", user_routes);
app.use("/poll", poll_routes);

// start server
module.exports = app;