import data from "../../api/userProfile.json";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema } from "../dynamicSchema";

import { useLocalStorage } from "./useLocalStorage.js";
import { usePrevious } from "./usePrevious.js";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const schema = buildZodSchema(data.index);

export const DynamicForm = () => {
  const [draft, setDraft] = useLocalStorage("dynamic-form-draft", {});
  const [finalData, setFinalData] = useLocalStorage("dynamic-form-final", null);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues:
      draft ||
      data.index.reduce((acc, field) => {
        if (field.type === "checkbox" && field.multiple) {
          acc[field.name] = [];
        } else if (field.type === "checkbox-single") {
          acc[field.name] = false;
        } else if (field.type === "range") {
          acc[field.name] = field.min || 1;
        } else {
          acc[field.name] = "";
        }
        return acc;
      }, {}),
  });

  /** Watch entire form */
  const values = useWatch({ control });
  const prevValues = usePrevious(values);

  useEffect(() => {
    if (
      values !== prevValues &&
      JSON.stringify(values) !== JSON.stringify(prevValues)
    ) {
      setDraft(values);
    }
  }, [values, prevValues, setDraft]);

  const onSubmit = (values) => {
    console.log("FINAL SUBMIT", values);
    setFinalData(values);
    // Optionally clear draft after successful submission
    // setDraft({});
  };

  const handleReset = () => {
    reset(
      data.index.reduce((acc, field) => {
        if (field.type === "checkbox" && field.multiple) {
          acc[field.name] = [];
        } else if (field.type === "checkbox-single") {
          acc[field.name] = false;
        } else if (field.type === "range") {
          acc[field.name] = field.min || 1;
        } else {
          acc[field.name] = "";
        }
        return acc;
      }, {})
    );
    setDraft({});
    setFinalData(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Form */}
        <Card className="h-fit">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {data.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {data.index.map((field) => {
                /** TEXT / EMAIL / PASSWORD */
                if (["text", "email", "password"].includes(field.type)) {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            {...ctrl}
                            type={field.type}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={`w-full transition-all duration-200 ${
                              errors[field.name]
                                ? "border-red-500 border-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-500"
                            }`}
                          />
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** NUMBER */
                if (field.type === "number") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            {...ctrl}
                            type="number"
                            min={field.min}
                            max={field.max}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={`w-full transition-all duration-200 ${
                              errors[field.name]
                                ? "border-red-500 border-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-500"
                            }`}
                          />
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** TEXTAREA */
                if (field.type === "textarea") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Textarea
                            {...ctrl}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            rows={4}
                            maxLength={field.max}
                            className={`w-full resize-none transition-all duration-200 ${
                              errors[field.name]
                                ? "border-red-500 border-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-500"
                            }`}
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                          />
                          {field.max && (
                            <p className="text-xs text-gray-500 text-right">
                              {ctrl.value?.length || 0}/{field.max} characters
                            </p>
                          )}
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** SELECT */
                if (field.type === "select") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Select
                            value={ctrl.value}
                            onValueChange={ctrl.onChange}
                          >
                            <SelectTrigger
                              className={`w-full transition-all duration-200 ${
                                errors[field.name]
                                  ? "border-red-500 border-2 focus:ring-red-200"
                                  : "border-gray-300"
                              }`}
                            >
                              <SelectValue
                                placeholder={`Select ${field.label.toLowerCase()}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** RADIO */
                if (field.type === "radio") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <RadioGroup
                            value={ctrl.value}
                            onValueChange={ctrl.onChange}
                            className={`space-y-2 ${
                              errors[field.name]
                                ? "border-2 border-red-500 rounded-md p-3"
                                : ""
                            }`}
                          >
                            {field.options.map((opt) => (
                              <div
                                key={opt}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={opt}
                                  id={`${field.name}-${opt}`}
                                />
                                <Label
                                  htmlFor={`${field.name}-${opt}`}
                                  className="font-normal cursor-pointer"
                                >
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** CHECKBOX MULTI */
                if (field.type === "checkbox" && field.multiple) {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <div
                            className={`space-y-2 ${
                              errors[field.name]
                                ? "border-2 border-red-500 rounded-md p-3"
                                : ""
                            }`}
                          >
                            {field.options.map((opt) => (
                              <div
                                key={opt}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${field.name}-${opt}`}
                                  checked={ctrl.value?.includes(opt)}
                                  onCheckedChange={(checked) => {
                                    const updated = checked
                                      ? [...(ctrl.value || []), opt]
                                      : (ctrl.value || []).filter(
                                          (v) => v !== opt
                                        );
                                    ctrl.onChange(updated);
                                  }}
                                />
                                <Label
                                  htmlFor={`${field.name}-${opt}`}
                                  className="font-normal cursor-pointer"
                                >
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** CHECKBOX SINGLE (Terms & Conditions) */
                if (field.type === "checkbox-single") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={field.name}
                              checked={ctrl.value}
                              onCheckedChange={ctrl.onChange}
                              className={
                                errors[field.name]
                                  ? "border-red-500 border-2"
                                  : ""
                              }
                            />
                            <Label
                              htmlFor={field.name}
                              className="font-normal cursor-pointer text-sm"
                            >
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                          </div>
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm ml-6">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** DATE */
                if (field.type === "date") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            {...ctrl}
                            type="date"
                            className={`w-full transition-all duration-200 ${
                              errors[field.name]
                                ? "border-red-500 border-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-500"
                            }`}
                          />
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** FILE */
                if (field.type === "file") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            type="file"
                            accept={field.accept}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              ctrl.onChange(file?.name || "");
                            }}
                            className={`w-full transition-all duration-200 ${
                              errors[field.name]
                                ? "border-red-500 border-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-500"
                            }`}
                          />
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                /** RANGE */
                if (field.type === "range") {
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                            <span>
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {ctrl.value}
                            </span>
                          </Label>
                          <Slider
                            value={[ctrl.value || field.min || 1]}
                            onValueChange={([value]) => ctrl.onChange(value)}
                            min={field.min || 1}
                            max={field.max || 10}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{field.min || 1}</span>
                            <span>{field.max || 10}</span>
                          </div>
                          {errors[field.name] && (
                            <div className="flex items-start gap-1.5 text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <p className="wrap-break-words">
                                {errors[field.name].message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  );
                }

                return null;
              })}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-100 transition-all duration-200"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right side - Final Submitted Data */}
        <Card className="h-fit sticky top-4">
          <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {finalData ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Submitted Data
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-gray-400" />
                  No Submission Yet
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {finalData ? (
              <div className="space-y-4">
                {Object.entries(finalData).map(([key, value]) => (
                  <div
                    key={key}
                    className="pb-3 border-b border-gray-200 last:border-0"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {key}
                    </p>
                    <p className="text-sm text-gray-800 wrap-break-words whitespace-pre-wrap">
                      {Array.isArray(value) ? (
                        value.length > 0 ? (
                          <span className="flex flex-wrap gap-1">
                            {value.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            No items selected
                          </span>
                        )
                      ) : typeof value === "boolean" ? (
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            value
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value ? "Yes" : "No"}
                        </span>
                      ) : value === "" ? (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  Complete and submit the form to see your data here.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Your draft is being saved automatically.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ErrorText = (error, message) => {
  return (
    <>
      {error && (
        <div className="flex items-start gap-1.5 text-red-600 text-sm">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="wrap-break-words">{message}</p>
        </div>
      )}
    </>
  );
};

<ErrorText error={errors[field.name]} message={errors[field.name].message} />;
