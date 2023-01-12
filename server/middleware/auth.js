
import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next) => {
    try {
       let token = req.headers("Authorization")
       
       if(!token) {
        res.status(403).json({msg: "Access denied"})
       }

       if(token.startsWihh("Bearer")) {
        token = token.slice(7, token.length).trimLeft()
       }

       const verified = jwt.verify(token, process.env.JWT_SECRET)

       req.user = verified,
    
       next()
       
    } catch (error) {
        res.status(500).json({ms: error.message})
    }
}