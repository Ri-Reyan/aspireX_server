import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";

export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    instructor,
    category,
    thumbnailUrl,
    videoUrl,
  } = req.body;

  const course = await Course.create({
    title,
    description,
    price,
    instructor,
    category,
    thumbnailUrl,
    videoUrl,
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

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});
