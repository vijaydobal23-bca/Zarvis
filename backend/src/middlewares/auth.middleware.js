import jwt from "jsonwebtoken";

export async function authUser(req ,res ,next){
  const token = req.cookies.token;
  if(!token){
    res.status(400).json({
      message:"Unauthorized Access",
      success:false,
      err:"No token provided",
    })
  }


  try {
    const decoded = jwt.verify(token ,process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ 
      message:"Unauthorized",
      success:false,
      err:"Invaid token" 
    })
  }
}