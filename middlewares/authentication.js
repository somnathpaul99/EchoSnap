const { validateToken } = require("../services/authentication");

function checkAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            if (userPayload) {
                req.user = userPayload;
            }
        } catch (err) {
            console.error("Invalid token:", err.message);
            res.clearCookie(cookieName);
        }

        next();
    }
}

module.exports = {
    checkAuthenticationCookie
}