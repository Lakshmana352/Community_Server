const jwt = require("jsonwebtoken");

const resp = {
  status:false,
  content: {
  }
}

const getToken = (user) => {
  const accessToken = jwt.sign(user,process.env.TOKEN_SECRET,{expiresIn: '15m'});
  if(!accessToken){
    res.content.data = {message: "Error in token creation try again."};
    res.status(500).json(resp);
  }
  return accessToken;
}

const authenticateToken = (req,res,next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token){
    resp.content.data = {message:"Token not found."}
    res.status(400).json(resp);
    return;
  }
  jwt.verify(token,process.env.TOKEN_SECRET,function(err,user){
    if(err){
      resp.content.data = {message:"Token is not valid"}
      res.status(401).json(resp);
      return;
    }
    else{
      req.user = user;
      next();
    }
  })
}

module.exports = {
  getToken,
  authenticateToken
}