// install required dependencies
const dotenv = require("dotenv").config();
const express = require("express");
const { Deta } = require("deta");

// application setup
const deta = Deta(process.env.PROJECT_KEY);
const router = express.Router();

// initialize user table
const polls = deta.Base("polls");
const users = deta.Base("users");

// routes
router.get("/", async (req, res) => {
    res.json({ "msg": "Users – WPDBS" });
});

router.post("/new", async (req, res) => {
    users.insert({
        "username": req.body.username,
        "password": req.body.password,
        "created_polls": [],
        "polls_voted": [],
        "n_flags": 0
    }, req.body.username)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/edit-password", async (req, res) => {
    users.update({
        "password": req.body.password
    }, req.body.username)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/add-created-poll", async (req, res) => {
    let user = await users.get(req.body.username);
    user["created_polls"].push(req.body.poll_id);

    users.update({
        "created_polls": user["created_polls"]
    }, req.body.username)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/add-poll-voted", async (req, res) => {
    let user = await users.get(req.body.username);
    user["polls_voted"].push(req.body.poll_id);

    users.update({
        "polls_voted": user["polls_voted"]
    }, req.body.username)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/flag", async (req, res) => {
    let user = await users.get(req.body.username);
    user["n_flags"] += 1;

    if(user["n_flags"] >= 3) {
        users.delete(req.body.username)
            .then(() => res.redirect("/"))
            .catch(err => console.error(err));
        
        all_polls = await polls.fetch({ "username": req.body.username }).next();

        for(let poll of all_polls["value"]) {
            polls.delete(poll["key"]);
        }

        res.sendStatus(202);
    } else {
        users.update({
            "n_flags": user["n_flags"]
        }, req.body.username)
            .then(() => res.sendStatus(200))
            .catch(err => console.error(err));
    }
});

// export routes
module.exports = router;