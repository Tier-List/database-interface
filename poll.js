// install required dependencies
const dotenv = require("dotenv").config();
const express = require("express");
const { Deta } = require("deta");

// application setup
const deta = Deta(process.env.PROJECT_KEY);
const router = express.Router();

// initialize tables
const users = deta.Base("users");
const polls = deta.Base("polls");

// routes
router.get("/", async (req, res) => {
    res.json({ "msg": "Polls – WPDBS" });
});

router.post("/new", async (req, res) => {
    polls.insert({
        "username": req.body.username,
        "question": req.body.question,
        "choice_one": req.body.choice_one,
        "choice_two": req.body.choice_two,
        "n_choice_one": 0,
        "n_choice_two": 0,
        "n_flags": 0
    }, req.body.question)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/voted/one", async (req, res) => {
    let poll = await polls.get(req.body.question);

    polls.update({
        "n_choice_one": poll["n_choice_one"] + 1
    }, req.body.question)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/voted/two", async (req, res) => {
    let poll = await polls.get(req.body.question);

    polls.update({
        "n_choice_two": poll["n_choice_two"] + 1
    }, req.body.question)
        .then(() => res.sendStatus(200))
        .catch(err => console.error(err));
});

router.post("/flag", async (req, res) => {
    let poll = await polls.get(req.body.question);
    let n_flags = poll["n_flags"] + 1;

    if(n_flags >= 3) {
        all_polls = await polls.fetch({ "username": poll["username"] }).next();
        user = await users.get(poll["username"]);

        users.delete(poll["username"])
        
        for(let poll of all_polls["value"]) {
            polls.delete(poll["key"]);
        }

        res.sendStatus(202);
    } else {
        polls.update({
            n_flags
        }, req.body.question)
            .then(() => res.sendStatus(200))
            .catch(err => console.error(err));
    }
});

// export routes
module.exports = router;