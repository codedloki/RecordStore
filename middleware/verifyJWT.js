const jwt = require('jsonwebtoken')

function verifyJWt(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET || 'justfuckup',
        (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err.message);
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            req.user = decoded; // 🧠 Attach decoded payload to req
            next(); // ✅ Move to route
        }
    );

}

module.exports = verifyJWt