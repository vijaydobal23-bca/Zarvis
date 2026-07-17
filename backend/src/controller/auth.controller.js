import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already Exsts with this email or username",
        success: false,
        err: "user already exists",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const emailVarificationToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    await sendEmail({
      to: email,
      subject: "Welcome to Zarvis",
      text: `hi ${username} thank you for registration.`,
      html: `
        <div>
          <h1>Welcome ${username}</h1>
          <p>We are thrilled to have you here at Zarvis.</p>
          <p>please verify your email address by clicking the link:</p>
          <a href = "http://localhost:3000/api/auth/verify-email?token=${emailVarificationToken}">Verify Email</a>
          <p>Best regards<br>The Zarvis team </p>
        </div>
    `,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "An error occurred during registration",
      success: false,
      err: error.message,
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        sucess: false,
        err: "User not found",
      });
    }

    const userAlreadyVerified = user.verified;
    if(userAlreadyVerified){
      return res.status(400).json({
        message:"User already verified Please go to login",
        sucess:false,
        err:"User already verified.Please login"
      });
    }

    user.verified = true;
    await user.save();
    const html = `<h1>Email varified suceessfully</h1>
      <p> Now you can login to your account</p> `;

    res.send(html);
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      message: "An error occurred during email verification",
      success: false,
      err: error.message,
    });
  }
}

export async function login(req ,res){

  const {email , password} = req.body;
  const user = await userModel.findOne({email});
  console.log(user);

  if(!user){
    return res.status(400).json({
      message:"Invalid email or password",
      sucess:true,
      err:"user not found"
    });
  }



  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid){
    return res.status(400).json({
      message:"Invlid email or password",
      sucess:false,
      err:"Incorrect Password"
    });
  }

if(!user.verified){
  return res.status(400).json({
    message:"Please verify your email befre logging in",
    sucess:false,
    err:"Email not veified"
  })
}


const token = await jwt.sign({
  id:user._id,
  username:user.username,

},process.env.JWT_SECRET , {expiresIn:"7d"});
res.cookie("token" , token);

res.status(200).json({
  message:"Login sucess",
  sucess:true,
  user:{
    id:user._id,
    username:user.username,
    email:user.email
  }
})
 
}


export async function getMe(req ,res){
  const userId = req.user.id;
  const user = await userModel.findById(userId);

  if(!user){
    return res.status(400).json({
      message:"user not found",
      success:false,
      err:"User not found"
    })
  }



  res.status(200).json({
    messsage:"User details fetched successfully",
    sucess:true,
    user
  })
}
