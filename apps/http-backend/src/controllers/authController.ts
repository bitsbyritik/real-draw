import jwt from "jsonwebtoken";
import { CreateUserSchema } from "@repo/common/types";

export const registerUser = (req, res) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
      res.json({
        message: "Incorrect inputs",
      });
      return;
    }
  } catch (err) {}

  res.json({
    userId: 1,
  });
};

export const loginUser = (req, res) => {
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    "s3c3t",
  );

  res.json({ token });
};
