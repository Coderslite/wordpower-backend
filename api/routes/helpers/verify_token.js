const verify = function handleVerifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        // const bearerToken = bearerHeader.split(' ')[1];
        const bearerToken = bearerHeader;
        req.token = bearerToken;
        next();
    }
    else {
        // res.sendStatus(403)
        res.status(401).json({
            "status": false,
            "message": "Unauthorized Access",
        })
    }
}



module.exports = verify;