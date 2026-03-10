import express from "express";
import Registration from "../../controllers/usercontrollers/Registration.controller.js";
import verifyOtp from "../../utils/security/verifyOtp.js";
import Admin from "../../models/adminSchema/admin.model.js";
import Login from "../../controllers/usercontrollers/Login.controller.js";
import logout from "../../controllers/usercontrollers/Logout.controllers.js";
import refreshToken from "../../controllers/authentication/refresh.contollers.js";
import {
  getVideoUploadSignature,
  getThumbnailUploadSignature,
} from "../controllers/upload.controller.js";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "../../controllers/contents/course.controller.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

// Admin Authentication Routes
router.post("/register", Registration(Admin));
router.post("/login", Login(Admin));
router.post("/logout", logout(Admin));
router.post("/refresh-token", refreshToken(Admin));

// OTP verification route for admin registration and login
router.post("/verify-otp", verifyOtp(Admin, "admin"));

// bussiness logic for cloudinary signature generation for video and thumbnail uploads
router.get("/video-signature", getVideoUploadSignature);
router.get("/thumbnail-signature", getThumbnailUploadSignature);

// business logic for creating, updating, and deleting courses

router.post("/create-course", protect("admin"), createCourse);
router.put("/update-course/:name/:id", protect("admin"), updateCourse);
router.delete("/delete-course/:name/:id", protect("admin"), deleteCourse);

export default router;
