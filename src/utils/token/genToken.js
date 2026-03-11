import jwt from "jsonwebtoken";

export const genAccessToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "10m",
    },
  );
};

export const genRefreshToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
