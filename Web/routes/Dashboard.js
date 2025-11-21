const express = require("express");
const db = require("../config/database");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

console.log('[INIT] - Start Dashboard.js'.blue)

router.use(express.json());

router.get('/message', verifyToken, async (req, res) => {
    res.render('message', { user: req.user, currentPage: 'message' });
});

// Strategies
router.get('/strategies', verifyToken, async (req, res) => {
    res.render('strategies', { user: req.user, currentPage: 'strategies' });
});

// Analysis
router.get('/analysis', verifyToken, async (req, res) => {
    res.render('analysis', {
        conversations: req.user.conversations,
        user: req.user, currentPage: 'analysis'
    });
});

// Profile
router.get(['/profile', '/profil'], verifyToken, async (req, res) => {
    res.render('profile', { user: req.user, currentPage: 'profile' });
});

router.get("/logout", async (req, res) => {
    res.clearCookie("auth_token", { path: '/', httpOnly: true, secure: false, sameSite: 'Lax' });
    res.redirect('/');
});

module.exports = router;