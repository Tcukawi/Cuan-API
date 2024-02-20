import Router from "express";
const router = Router();
import jwt, {JwtPayload} from "jsonwebtoken";
import bcrypt from "bcrypt";
import {model} from "../db/model/userpadi.js";
import {userInfo} from "../db/model/userInfo.js";
const User = model;
import "dotenv/config.js";


router.get("/test", (req, res) =>{
  return res.status(200).json({message: "hello world"});
});


router.post("/signup", async (req, res) => {
  if (JSON.parse(process.env.singup!) != true) {
    res.status(503).json({error: "Maaf... Pendaftaran untuk beta sudah di tutup!"});
    return;
  }
  try {
    const {username, password} = req.body;
    const existingUser = await User.findOne({username});
    if (existingUser) {
      return res.status(409).json({error: "Username sudah ada"});
    }
    const newUser = new User({username, password});
    await newUser.save();
    res.status(201).json({message: "Pendaftaran Berhasil"});
  } catch (error) {
    res.status(500).json({error: "Something went wrong"});
  }
});

router.post("/login", async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({error: "Invalid credentials"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({error: "Invalid credentials"});
    }
    const token = jwt.sign({userId: user._id}, (process.env.SALT as string));
    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({error: "Something went wrong"});
  }
});

router.get("/checkLogin", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({error: "No token provided"});
    }


    jwt.verify(token, (process.env.SALT as string), async (err, decoded) => {
      if (err) {
        return res.status(401).json({error: "Invalid token"});
      }

      const id = (decoded! as JwtPayload).userId;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({error: "User not found"});
      }

      res.status(200).json({user: user.username});
    });
  } catch (error) {
    res.status(500).json({error: "Something went wrong"});
  }
});


router.get("/userInfo", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({error: "No token provided"});
    }

    jwt.verify(token, (process.env.SALT as string), async (err, decoded) => {
      if (err) {
        return res.status(401).json({error: "Invalid token"});
      }

      const id = (decoded! as JwtPayload).userId;
      const user = await userInfo.findById(id);
      if (!user) {
        return res.status(404).json({error: "User not found"});
      }

      res.status(200).json({user: user.username, terakhirTanam: user.terakhirTanam, tipeTanaman: user.tipeTanaman});
    });
  } catch (error) {
    res.status(500).json({error: "Something went wrong"});
  }
});

export default router;


// Example usage: generate a random ID with a length of 8 characters

