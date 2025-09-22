const jwt = require("jsonwebtoken");
const user = require("../Model/registerModel");

const auth = async (req, res, next) => {
try{
const bearerHeader = req.headers['authorization']
if(typeof bearerHeader !== 'undefined'){
const token = bearerHeader.split(' ')[1]
const user = jwt.verify(token , process.env.JWT_SECRET) 
console.log(user)
req.user = user
next()

}else{
  res.status(401).json({ error: "Unauthorized" });
 }
} catch (error) {
    res.status(403).json({ message: "invalid expired token" });
} 
}

module.exports = auth;