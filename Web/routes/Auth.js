const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const db = require("../config/database");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.use(express.json());
console.log('[INIT] - Start Auth.js'.blue)

async function login(user, res) {
    const token = jwt.sign({ id: user.userId, email: user.email }, process.env.SECRET_KEY, { expiresIn: "6h" });

    return res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
}

function getUserByEmailOrUsername(email, username) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username],
            (err, user) => {
                if (err) reject(err);
                else resolve(user);
            }
        );
    });
}

async function getUser(email) {
    const isEmail = email.includes('@');

    const query = isEmail
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE username = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [email], (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: "Email, password and username are required." });
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) return res.status(400).json({ error: 'Email invalide!' })

        const conflit = await getUserByEmailOrUsername(email, username);

        if (conflit) {
            if (conflit.email === email)
                return res.status(409).json({ error: "Email déjà utilisé." });

            if (conflit.username === username)
                return res.status(409).json({ error: "Nom d'utilisateur déjà pris." });
        }

        // 🛡 Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run("INSERT INTO users (email, password, username) VALUES (?, ?, ?)", [email, hashedPassword, username]);

        const user = await getUser(email)

        await login(user, res)

        res.status(201).json({ success: true, redirect: "/home", message: "Account created successfully!" });
        console.log(`[USER] - Create Account: ${email}`.green)
    } catch (err) {
        console.error("[USER] - Register Error".red, err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // 🔍 Recherche de l'utilisateur
        const user = await getUser(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // 🔑 Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // 🔥 Génération du token JWT
        await login(user, res)

        return res.status(200).json({ success: true, redirect: "/home" });
    } catch (err) {
        console.error("[USER] - Login Error".red, err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports = router;