import express from "express";
import Registration from "../../controllers/usercontrollers/Registration.controller.js";
import verifyOtp from "../../utils/security/verifyOtp.js";
import User from "../../models/userSchema/user.model.js";
import Login from "../../controllers/usercontrollers/Login.controller.js";
import logout from "../../controllers/usercontrollers/Logout.controllers.js";
import refreshToken from "../../controllers/authentication/refresh.contollers.js";
import { getCourses } from "../../controllers/contents/course.controller.js";
import { protect } from "../../middleware/authorization/auth.middleware.js";
import googleAuth from "../../controllers/usercontrollers/googleAuth.js";
const router = express.Router();

// User Authentication Routes
router.post("/register", Registration(User));
router.post("/login", Login(User));
router.post("/logout", logout(User));
router.post("/refresh-token", refreshToken(User));

// User google authentiaction

router.post("/goole", googleAuth);

// OTP verification route for user registration
router.post("/verify-otp", verifyOtp(User, "student"));

// feching all the courses for the user dashboard
router.get("/courses", protect("student", "admin"), getCourses);

export default router;
