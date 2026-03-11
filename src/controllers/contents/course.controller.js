import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";
import { CourseSchema } from "../validations/course.validator.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { success, data, error } = CourseSchema.safeParse(req.body);

  const {
    title,
    description,
    price,
    instructor,
    category,
    thumbnailUrl,
    thumbnailPublicId,
    videoUrl,
    videoPublicId,
  } = data;

  if (!success || !error) {
    const errorMessage = error?.errors[0]?.message || "Invalid course data";
    res.status(400);
    throw new Error(errorMessage);
  }

  const course = await Course.create({
    title,
    description,
    price,
    instructor,
    category,
    thumbnailUrl,
    thumbnailPublicId,
    videoUrl,
    videoPublicId,
  });

  res.status(201).json({
    success: true,
    course,
  });
});

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();

  res.status(200).json({
    success: true,
    courses,
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updateData = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    instructor: req.body.instructor,
    category: req.body.category,
  };

  const course = await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    course,
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (course.videoPublicId) {
    await cloudinary.uploader.destroy(course.videoPublicId, {
      resource_type: "video",
    });
  }

  if (course.thumbnailPublicId) {
    await cloudinary.uploader.destroy(course.thumbnailPublicId, {
      resource_type: "image",
    });
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});
