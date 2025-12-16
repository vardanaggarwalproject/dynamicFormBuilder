import { z } from "zod";

export const buildZodSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let schema;

    switch (field.type) {
      case "text":
      case "password":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        if (field.min) {
          schema = schema.min(field.min, `${field.label} must be at least ${field.min} characters`);
        }
        if (field.max) {
          schema = schema.max(field.max, `${field.label} must be at most ${field.max} characters`);
        }
        break;

      case "email":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`).email("Invalid email address");
        } else {
          schema = schema.email("Invalid email address").or(z.literal(""));
        }
        break;

      case "textarea":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        if (field.max) {
          schema = schema.max(field.max, `${field.label} must be at most ${field.max} characters`);
        }
        break;

      case "number":
        schema = z.coerce.number({
          invalid_type_error: `${field.label} must be a number`,
        });
        if (field.required) {
          schema = schema.min(field.min || 1, `${field.label} is required`);
        }
        if (field.min !== undefined) {
          schema = schema.min(field.min, `${field.label} must be at least ${field.min}`);
        }
        if (field.max !== undefined) {
          schema = schema.max(field.max, `${field.label} must be at most ${field.max}`);
        }
        break;

      case "select":
      case "radio":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        break;

      case "checkbox":
        if (field.multiple) {
          schema = z.array(z.string());
          if (field.required) {
            schema = schema.min(1, `Select at least one ${field.label}`);
          }
        } else {
          schema = z.boolean();
        }
        break;

      case "checkbox-single":
        schema = z.boolean();
        if (field.required) {
          schema = schema.refine((val) => val === true, {
            message: `${field.label} must be accepted`,
          });
        }
        break;

      case "date":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        break;

      case "file":
        schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        break;

      case "range":
        schema = z.number();
        if (field.min !== undefined) {
          schema = schema.min(field.min);
        }
        if (field.max !== undefined) {
          schema = schema.max(field.max);
        }
        break;

      default:
        schema = z.any();
    }
    
    shape[field.name] = schema;
  });

  return z.object(shape);
};