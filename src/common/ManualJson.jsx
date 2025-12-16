import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Schema Generator Component
const generateZodSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let validator;

    switch (field.type) {
      case "email":
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        validator = validator.email("Invalid email address");
        break;

      case "number":
        validator = z.coerce.number();
        if (field.required) {
          validator = validator.min(0, `${field.label} is required`);
        }
        if (field.min !== undefined) {
          validator = validator.min(field.min, `Minimum value is ${field.min}`);
        }
        if (field.max !== undefined) {
          validator = validator.max(field.max, `Maximum value is ${field.max}`);
        }
        break;

      case "checkbox":
        validator = z.boolean();
        if (field.required) {
          validator = validator.refine((val) => val === true, {
            message: `${field.label} must be checked`,
          });
        }
        break;

      case "checkboxGroup":
        validator = z.array(z.string());
        if (field.required) {
          validator = validator.min(1, `Select at least one ${field.label}`);
        }
        if (field.min) {
          validator = validator.min(field.min, `Select at least ${field.min} options`);
        }
        if (field.max) {
          validator = validator.max(field.max, `Select at most ${field.max} options`);
        }
        break;

      case "radio":
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        break;

      case "date":
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        break;

      case "url":
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        validator = validator.url("Invalid URL format");
        break;

      case "tel":
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        if (field.pattern) {
          validator = validator.regex(
            new RegExp(field.pattern),
            field.patternMessage || "Invalid phone number format"
          );
        }
        break;

      default:
        validator = z.string();
        if (field.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        if (field.min) {
          validator = validator.min(
            field.min,
            `${field.label} must be at least ${field.min} characters`
          );
        }
        if (field.max) {
          validator = validator.max(
            field.max,
            `${field.label} must be at most ${field.max} characters`
          );
        }
        if (field.pattern) {
          validator = validator.regex(
            new RegExp(field.pattern),
            field.patternMessage || "Invalid format"
          );
        }
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};

// Field Renderer Component
const FormFieldRenderer = ({ field, register, control, errors }) => {
  const error = errors[field.name];

  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <Controller
            control={control}
            name={field.name}
            defaultValue=""
            render={({ field: controllerField }) => (
              <Select
                onValueChange={controllerField.onChange}
                value={controllerField.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value || opt} value={opt.value || opt}>
                      {opt.label || opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...register(field.name)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="w-full resize-none"
          />
        );

      case "checkbox":
        return (
          <Controller
            control={control}
            name={field.name}
            defaultValue={false}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                  id={field.name}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.checkboxLabel || field.label}
                </label>
              </div>
            )}
          />
        );

      case "checkboxGroup":
        return (
          <Controller
            control={control}
            name={field.name}
            defaultValue={[]}
            render={({ field: controllerField }) => (
              <div className="space-y-3">
                {field.options?.map((opt) => {
                  const value = opt.value || opt;
                  const label = opt.label || opt;
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        checked={controllerField.value?.includes(value)}
                        onCheckedChange={(checked) => {
                          const current = controllerField.value || [];
                          const updated = checked
                            ? [...current, value]
                            : current.filter((v) => v !== value);
                          controllerField.onChange(updated);
                        }}
                        id={`${field.name}-${value}`}
                      />
                      <label
                        htmlFor={`${field.name}-${value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          />
        );

      case "radio":
        return (
          <Controller
            control={control}
            name={field.name}
            defaultValue=""
            render={({ field: controllerField }) => (
              <RadioGroup
                onValueChange={controllerField.onChange}
                value={controllerField.value}
                className="space-y-3"
              >
                {field.options?.map((opt) => {
                  const value = opt.value || opt;
                  const label = opt.label || opt;
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`${field.name}-${value}`} />
                      <label
                        htmlFor={`${field.name}-${value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
          />
        );

      default:
        return (
          <Input
            type={field.type || "text"}
            {...register(field.name)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Generated Form Component
const GeneratedForm = ({ fields, schema, onSubmitSuccess }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmitSuccess(data);
  };

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Form Generated</h3>
        <p className="text-muted-foreground">
          Paste your JSON configuration and click "Generate Form" to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {fields.map((field) => (
          <FormFieldRenderer
            key={field.name}
            field={field}
            register={register}
            control={control}
            errors={errors}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={isSubmitting} 
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Submit Form"}
        </Button>
        <Button
          onClick={() => reset()}
          variant="outline"
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

// JSON Editor Component
const JsonEditor = ({ value, onChange, onGenerate, error }) => {
  const exampleJson = {
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
        min: 2,
        max: 50
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "you@example.com"
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
        placeholder: "+1 (555) 000-0000",
        pattern: "^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$",
        patternMessage: "Please enter a valid phone number"
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        required: true,
        min: 18,
        max: 120
      },
      {
        name: "country",
        label: "Country",
        type: "select",
        required: true,
        options: ["USA", "Canada", "UK", "Australia", "India"]
      },
      {
        name: "gender",
        label: "Gender",
        type: "radio",
        required: true,
        options: ["Male", "Female", "Other", "Prefer not to say"]
      },
      {
        name: "interests",
        label: "Interests",
        type: "checkboxGroup",
        required: false,
        options: ["Technology", "Sports", "Music", "Art", "Travel"],
        min: 1,
        max: 3
      },
      {
        name: "terms",
        label: "Terms and Conditions",
        type: "checkbox",
        required: true,
        checkboxLabel: "I agree to the terms and conditions"
      },
      {
        name: "bio",
        label: "Biography",
        type: "textarea",
        required: false,
        placeholder: "Tell us about yourself...",
        rows: 4,
        max: 500
      }
    ]
  };

  const loadExample = () => {
    onChange(JSON.stringify(exampleJson, null, 2));
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">JSON Configuration</Label>
        <Button
          onClick={loadExample}
          variant="outline"
          size="sm"
        >
          Load Example
        </Button>
      </div>
      
      <Textarea
        rows={20}
        placeholder="Paste your JSON configuration here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm flex-1 resize-none"
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={onGenerate} className="w-full" size="lg">
        Generate Form
      </Button>

      <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted rounded-lg">
        <p className="font-semibold">Supported Field Types:</p>
        <p>text, email, number, tel, url, date, textarea, select, radio, checkbox, checkboxGroup</p>
        <p className="font-semibold mt-2">Validation Options:</p>
        <p>required, min, max, pattern, patternMessage, options</p>
      </div>
    </div>
  );
};

// Main Component
export default function JsonDrivenDynamicForm() {
  const [jsonText, setJsonText] = useState("");
  const [schema, setSchema] = useState(null);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const [submitResult, setSubmitResult] = useState(null);

  const generateForm = () => {
    try {
      setError("");
      setSubmitResult(null);
      
      const parsed = JSON.parse(jsonText);
      
      if (!parsed.fields || !Array.isArray(parsed.fields)) {
        throw new Error("JSON must contain a 'fields' array");
      }

      if (parsed.fields.length === 0) {
        throw new Error("Fields array cannot be empty");
      }

      setFields(parsed.fields);
      const generatedSchema = generateZodSchema(parsed.fields);
      setSchema(generatedSchema);
    } catch (err) {
      setError(err.message || "Invalid JSON format");
      setFields([]);
      setSchema(null);
    }
  };

  const handleFormSubmit = (data) => {
    setSubmitResult(data);
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dynamic Form Builder
          </h1>
          <p className="text-muted-foreground">
            Create powerful forms from JSON with full validation support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - JSON Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <JsonEditor
              value={jsonText}
              onChange={setJsonText}
              onGenerate={generateForm}
              error={error}
            />
          </div>

          {/* Right Side - Generated Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Generated Form</h2>
              <p className="text-sm text-muted-foreground">
                {fields.length > 0
                  ? `${fields.length} field${fields.length !== 1 ? "s" : ""} loaded`
                  : "No form generated yet"}
              </p>
            </div>

            <GeneratedForm
              fields={fields}
              schema={schema}
              onSubmitSuccess={handleFormSubmit}
            />

            {submitResult && (
              <Alert className="mt-6 border-green-200 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Form submitted successfully!
                  </div>
                  <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(submitResult, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}