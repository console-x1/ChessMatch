const express = require('express');
const path = require('path');
const db = require("../config/database");
const jwt = require('jsonwebtoken');

const router = express.Router();
console.log('[INIT] - Start Public.js'.blue)

async function userAuth(req) {

    const token = req.cookies?.auth_token || req.cookie?.auth_token;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            const user = req.user.id = decoded && decoded.id ? decoded.id : null;
            return user;

        })
    } else return null
}

router.get(["/index", "/", "/home", "/base", "/main"], async (req, res) => {
    const user = await userAuth(req)
    res.render('home', { user });
});

router.get("/login", async (req, res) => {
    const user = await userAuth(req)
    res.render('login', { user })
})
router.get("/register", async (req, res) => {
    const user = await userAuth(req)
    res.render('register', { user })
})

module.exports = router;