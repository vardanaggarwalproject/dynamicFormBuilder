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
import { CheckCircle2, XCircle, FileText, Send, RotateCcw, Database } from "lucide-react";

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left side - Form */}
          <div className="w-full">
            <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {data.title}
                    </CardTitle>
                    <p className="text-blue-100 text-sm mt-1.5 font-medium">
                      Fill out the form below. Your progress is saved automatically.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-custom bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Input
                                {...ctrl}
                                type={field.type}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className={`transition-all duration-200 ${
                                  errors[field.name]
                                    ? "border-red-500 border-2 focus-visible:ring-red-200"
                                    : "border-gray-300 focus-visible:ring-blue-500"
                                }`}
                              />
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Input
                                {...ctrl}
                                type="number"
                                min={field.min}
                                max={field.max}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className={`transition-all duration-200 ${
                                  errors[field.name]
                                    ? "border-red-500 border-2 focus-visible:ring-red-200"
                                    : "border-gray-300 focus-visible:ring-blue-500"
                                }`}
                              />
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Textarea
                                {...ctrl}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                rows={4}
                                maxLength={field.max}
                                className={`resize-none transition-all duration-200 ${
                                  errors[field.name]
                                    ? "border-red-500 border-2 focus-visible:ring-red-200"
                                    : "border-gray-300 focus-visible:ring-blue-500"
                                }`}
                              />
                              {field.max && (
                                <p className="text-xs text-gray-500 text-right font-medium">
                                  {ctrl.value?.length || 0}/{field.max} characters
                                </p>
                              )}
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Select
                                value={ctrl.value}
                                onValueChange={ctrl.onChange}
                              >
                                <SelectTrigger
                                  className={`transition-all duration-200 ${
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
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <RadioGroup
                                value={ctrl.value}
                                onValueChange={ctrl.onChange}
                                className={`space-y-2 p-3 rounded-md ${
                                  errors[field.name]
                                    ? "border-2 border-red-500 bg-red-50"
                                    : "bg-gray-50"
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
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <div
                                className={`space-y-2 p-3 rounded-md ${
                                  errors[field.name]
                                    ? "border-2 border-red-500 bg-red-50"
                                    : "bg-gray-50"
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
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
                                </div>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    /** CHECKBOX SINGLE */
                    if (field.type === "checkbox-single") {
                      return (
                        <Controller
                          key={field.name}
                          name={field.name}
                          control={control}
                          render={({ field: ctrl }) => (
                            <div className="space-y-2">
                              <div
                                className={`flex items-center space-x-3 p-3 rounded-md ${
                                  errors[field.name]
                                    ? "bg-red-50 border border-red-500"
                                    : "bg-gray-50"
                                }`}
                              >
                                <Checkbox
                                  id={field.name}
                                  checked={ctrl.value}
                                  onCheckedChange={ctrl.onChange}
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
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Input
                                {...ctrl}
                                type="date"
                                className={`transition-all duration-200 ${
                                  errors[field.name]
                                    ? "border-red-500 border-2 focus-visible:ring-red-200"
                                    : "border-gray-300 focus-visible:ring-blue-500"
                                }`}
                              />
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <Input
                                type="file"
                                accept={field.accept}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  ctrl.onChange(file?.name || "");
                                }}
                                className={`transition-all duration-200 ${
                                  errors[field.name]
                                    ? "border-red-500 border-2 focus-visible:ring-red-200"
                                    : "border-gray-300 focus-visible:ring-blue-500"
                                }`}
                              />
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
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
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-red-500">*</span>
                                  )}
                                </span>
                                <span className="text-blue-600 font-bold text-lg px-3 py-1 bg-blue-50 rounded-full">
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
                              <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>{field.min || 1}</span>
                                <span>{field.max || 10}</span>
                              </div>
                              {errors[field.name] && (
                                <div className="flex items-start gap-1.5 text-red-600 text-sm bg-red-50 p-2 rounded-md">
                                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p className="break-words">{errors[field.name].message}</p>
                                </div>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    return null;
                  })}

                  <div className="flex gap-3 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={!isValid}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Form
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Submitted Data */}
          <div className="w-full lg:sticky lg:top-4">
            <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl">
              <CardHeader
                className={`py-6 px-6 ${
                  finalData
                    ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"
                    : "bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700"
                } text-white`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    {finalData ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <Database className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {finalData ? "Submitted Data" : "No Submission Yet"}
                    </CardTitle>
                    {finalData ? (
                      <p className="text-green-100 text-sm mt-1.5 font-medium">
                        Form submitted successfully! Review your data below.
                      </p>
                    ) : (
                      <p className="text-gray-200 text-sm mt-1.5 font-medium">
                        Complete the form to see your data here.
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-custom bg-white">
                {finalData ? (
                  <div className="space-y-4">
                    {Object.entries(finalData).map(([key, value]) => (
                      <div
                        key={key}
                        className="pb-4 border-b border-gray-200 last:border-0"
                      >
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {key}
                        </p>
                        <div className="text-sm text-gray-800">
                          {Array.isArray(value) ? (
                            value.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {value.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                No items selected
                              </span>
                            )
                          ) : typeof value === "boolean" ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
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
                            <p className="break-words whitespace-pre-wrap overflow-wrap-anywhere">
                              {value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Database className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-base font-medium mb-2">
                      No data submitted yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Complete and submit the form to see your data here.
                    </p>
                    <p className="text-gray-400 text-xs mt-3 italic">
                      💾 Your draft is being saved automatically
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Styles for Custom Scrollbar and Text Wrapping */}
      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #4f46e5);
        }

        /* Firefox scrollbar */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #f1f5f9;
        }

        /* Ensure text wrapping everywhere */
        .overflow-wrap-anywhere {
          overflow-wrap: anywhere;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};