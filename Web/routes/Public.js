const express = require('express');
const path = require('path');
const db = require("../config/database");
const jwt = require('jsonwebtoken');

const router = express.Router();
console.log('[INIT] - Start Public.js'.blue)

function userAuth(req, res, next) {
    req.user = {};

    const token = req.cookies.auth_token;

    if (!token) return next();

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (!err && decoded) {
            req.user.id = decoded.id || null;
            req.user.email = decoded.email || null;
        }
        next();
    });
}

router.get(["/index", "/", "/home", "/base", "/main"], userAuth, async (req, res) => {
    res.render('home', { user: req.user ?? null, currentPage: 'home' });
});

router.get("/login", userAuth, async (req, res) => {
    res.render('login', { user: req.user ?? null, currentPage: 'login' })
})
router.get("/register", userAuth, async (req, res) => {
    res.render('register', { user: req.user ?? null, currentPage: 'register' })
})

module.exports = router;