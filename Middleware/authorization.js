const jwt = require('jsonwebtoken');

const authorization = async (req, res, next) => {
    let headerToken = req.headers.authorization;
        if(headerToken){
            let token = headerToken?.split(' ')[1];
            let auth = await jwt.verify(token, 'secret')
            if(auth){
                req.userId = auth.userId;
                next();
            }else{
                return res.status(401).json({
                    isSuccsess: false,
                    Message: "Token is invalid"
                })
            }
        }else{
            return res.status(401).json({
                isSuccsess: false,
                Message: "Token is missing"
            })
        }
}

module.exports = authorization;