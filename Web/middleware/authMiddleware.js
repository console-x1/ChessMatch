const achievementsConfig = require('../config/achievements.config');
const jwt = require('jsonwebtoken');
const colors = require('colors')

let db = require('../config/database');

const verifyToken = (req, res, next) => {
    req.user = req.user || {};

    const token = req.cookies.auth_token;

    if (!token) {
        console.log('[SAFE] - authMiddleware redirect - NO TOKEN'.yellow)
        return res.redirect(`${req.protocol}://${req.get('host')}/login`);
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            console.log('[SAFE] - authMiddleware redirect - BAD TOKEN'.yellow)
            return res.redirect(`${req.protocol}://${req.get('host')}/login`);
        }

        req.user.id = decoded && decoded.id ? decoded.id : null;
        req.user.email = decoded && decoded.email ? decoded.email : null;

        try {

            const donnee = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM users WHERE userId = ?", [decoded.id], (err, user) => {
                    if (err) {
                        console.error("[USER] - Error fetching user data".red, err);
                        return reject(err);
                    }
                    resolve(user || null);
                });
            });

            const dbAchievements = await new Promise((resolve, reject) => {
                db.all("SELECT code, unlocked FROM achievements WHERE userId = ?", [donnee.userId], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                });
            });

            req.user.username = donnee && donnee.username ? donnee.username : null;
            req.user.avatar = donnee && donnee.avatar ? donnee.avatar : null;
            req.user.stats = {

                // Coup
                brilliant: donnee.brilliant, best: donnee.best, good: donnee.good, inaccuracy: donnee.inaccuracy, mistake: donnee.mistake, blunder: donnee.blunder,

                // Stats
                successRate: donnee.successRate, totalGames: donnee.totalGames
            }

            req.user.achievements = achievementsConfig.map(a => {
                const found = dbAchievements.find(d => d.code === a.code);

                return {
                    name: a.name,
                    icon: a.icon,
                    color: a.color,
                    unlocked: found ? found.unlocked === 1 : false
                };
            });


            function long(str, len) {
                str = String(str);
                if (str.length <= len) return str.padEnd(len, ' ');
                return str.slice(-len);
            }

            const routeInfo = long(`${req.protocol}://${req.get('host')}${req.originalUrl}`, 55);

            if (routeInfo.includes('/api/')) return next()

            console.log(`[SAFE] - ${routeInfo} - ${long(req.user.username, 20)} - ${req.user.email}`.green)
            return next();

        } catch (e) {
            console.error('[AUTH] - authMiddleware caught error'.red, e);
            return res.redirect(`${req.protocol}://${req.get('host')}/login`);
        }
    });
};

module.exports = verifyToken;
