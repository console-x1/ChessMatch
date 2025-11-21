const express = require("express");
const db = require("../config/database");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

console.log('[INIT] - Start Dashboard.js'.blue)

router.use(express.json());

router.get('/message', verifyToken, (req, res) => {
    res.render('message');
});

// Strategies
router.get('/strategies', verifyToken, (req, res) => {
    res.render('strategies');
});

// Analysis
router.get('/analysis', verifyToken, (req, res) => {
    res.render('analysis', {
        conversations: req.user.conversations
    });
});

// Profile
router.get(['/profile', '/profil'], verifyToken, (req, res) => {
    res.render('profile');
});

router.get("/logout", (req, res) => {
    res.clearCookie("auth_token", { path: '/', httpOnly: true, secure: false, sameSite: 'Lax' });
    res.redirect('/');
});

module.exports = router;