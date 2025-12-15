import { z } from "zod";
export const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "At least 5 email character is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number & special character",
      }
    ),
  lastname: z
    .string()
    .min(2, { message: "last name must be at least 2 characters" })
    .max(12, { message: "last name must be at most 12 characters" })
     .regex(/^[A-Za-z]+$/, {
    message: "Last name must contain only one word (letters only)",
  }),
  firstname: z
    .string()
    .min(2, { message: "first name must be at least 2 characters" })
    .max(15, { message: "first name must be at most 15 characters" })
    .regex(/^[A-Z][a-z]+$/, {
      message:
        "First name must start with a capital letter and contain only one word",
    }),
  age: z.coerce
    .number()
    .min(18, { message: "You must be atleast 18 years old" })
    .max(100, { message: "Age must be less than or equal to 100" }),
  select: z.string().min(1, { message: "plz select the gender" }),
});
