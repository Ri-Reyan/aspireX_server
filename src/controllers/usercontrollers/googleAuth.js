import { OAuth2Client } from "google-auth-library";
import asyncHandler from "express-async-handler";
import User from "../../models/userSchema/user.model.js";
import { genAccessToken, genRefreshToken } from "../../utils/token/genToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    throw new Error("Google credential missing");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name, sub } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      provider: "google",
      googleId: sub,
      isVerified: true,
    });
  }

  const accessToken = genAccessToken(user._id, user.role);
  const refreshToken = genRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Google login successful",
  });
});

export default googleAuth;
