import zod from "zod";

export const ContentSchema = zod.object({
  title: zod.string().min(5).max(100),
  description: zod.string().min(10),
  price: zod.number().positive(),
  thumbnail: zod.string().url(),
  instructor: zod.string().min(3).max(50),
  category: zod.string().min(3).max(50),
});
