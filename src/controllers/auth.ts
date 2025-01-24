import { Request, Response, NextFunction } from "express";
import userModel, { iUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { isEmail } from "validator";


const register = async (req: Request, res: Response) => {
  const {userName, email, password } = req.body;
  // Validate userName
  if (!userName || userName.trim() === '') {
    return res.status(400).send({ error: "Invalid input data" });
  }

  
  if (!isEmail(email)) {
    return res.status(400).send({ error: "Invalid email format" });
  }

  
  if (!password || password.trim() === '') {
    return res.status(400).send({ error: "Invalid input data" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email is already in use" });
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let profilePicture = req.body.profilePicture;
    if (!profilePicture) profilePicture = null;
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      profilePicture: profilePicture,
      
    });
  
    res.status(200).send(user);
  } catch {
    res.status(400).send({ error: "An error occurred" });
  }
};

const generateTokens = (
  user: iUser
): { refreshToken: string; accessToken: string } | null => {
  if (process.env.TOKEN_SECRET === undefined) {
    return null;
  }
  const rand = Math.random();
  const accessToken = jwt.sign(
    {
      _id: user._id,
      rand: rand,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION || "10s" }
  );
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      rand: rand,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" }
  );
  return { refreshToken: refreshToken, accessToken: accessToken };
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).send({ error: "User not found" }); 
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send("incorrect email or password");
      return;
    }
    const tokens = generateTokens(user);
    if (!tokens) {
      res.status(400).send({ error: "Token generation error" }); 
      return;
    }

    if (user.refreshTokens == null) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      ...tokens,
      _id: user._id,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send({ error: err.message || "An error occurred" });
    } else {
      res.status(400).send({ error: "An error occurred" });
    }
  }
};

const validateRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<Document<unknown, object, iUser> & iUser>(
    (resolve, reject) => {
      if (refreshToken == null) {
        reject("error");
        return;
      }
      if (!process.env.TOKEN_SECRET) {
        reject("error");
        return;
      }
      jwt.verify(
        refreshToken,
        process.env.TOKEN_SECRET,
        async (err, payload) => {
          if (err) {
            reject(err);
            return;
          }
          const userId = (payload as Payload)._id;
          try {
            const user = await userModel.findById(userId);
            if (!user) {
              reject("error");
              return;
            }
            //check if token exists
            if (
              !user.refreshTokens ||
              !user.refreshTokens.includes(refreshToken)
            ) {
              user.refreshTokens = [];
              await user.save();
              reject(err);
              return;
            }
            resolve(user);
          } catch (err) {
            reject(err);
          }
        }
      );
    }
  );
};


  

const logout = async (req: Request, res: Response) => {
  try {
    const user = await validateRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("error");
      return;
    }
    //remove the token from the user
    user.refreshTokens = user.refreshTokens!.filter(
      (token) => token !== req.body.refreshToken
    );
    await user.save();
    res.status(200).send("logged out");
  } catch {
    res.status(400).send("error");
    return;
  }
};


const refresh = async (req: Request, res: Response) => {
  try {
    const user = await validateRefreshToken(req.body.refreshToken);

    const tokens = generateTokens(user);
    console.log(tokens);
    if (!tokens) {
      res.status(400).send("error");
      return;
    }
    user.refreshTokens = user.refreshTokens!.filter(
      (token) => token !== req.body.refreshToken
    );
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      ...tokens,
      _id: user._id,
    });
  } catch {
    res.status(400).send("error");
  }
};


type Payload = {
  _id: string;
};
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];
  if (!token) {
    res.status(400).send("Access denied");
    return;
  }
  if (process.env.TOKEN_SECRET === undefined) {
    res.status(400).send("server error");
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(400).send("Access denied");
    } else {
      const userId = (payload as Payload)._id;
      req.params.userId = userId;
      next();
    }

    
  });
};





export default {
  register,
  login,
  refresh,
  logout,
  
};
