import data from "../../api/userProfile.json";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const DynamicForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            {data.title}
          </CardTitle>
          <p className="text-sm text-slate-500">
            Please fill in the details below
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.index.map((field) => {
              switch (field.type) {
                case "text":
                case "email":
                case "number":
                case "password":
                  return (
                    <div key={field.name} className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        {field.label}
                      </Label>
                      <Input
                        type={field.type}
                        placeholder={`Enter ${field.label}`}
                        className="rounded-xl"
                        {...register(field.name, { required: field.required })}
                      />
                      {errors[field.name] && (
                        <p className="text-xs text-red-500">This field is required</p>
                      )}
                    </div>
                  );

                case "checkbox":
                  return (
                    <div key={field.name} className="flex items-center gap-2 md:col-span-2">
                      <Input
                        type="checkbox"
                        className="h-4 w-4"
                        {...register(field.name)}
                      />
                      <Label className="text-sm text-slate-700">
                        {field.label}
                      </Label>
                    </div>
                  );

                case "select":
                  return (
                    <Controller
                      key={field.name}
                      name={field.name}
                      control={control}
                      render={({ field: ctrl }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">
                            {field.label}
                          </Label>
                          <Select value={ctrl.value} onValueChange={ctrl.onChange}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  );

                case "radio":
                  return (
                    <div key={field.name} className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-slate-700">
                        {field.label}
                      </Label>
                      <div className="flex gap-6">
                        {field.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <Input
                              type="radio"
                              value={option}
                              className="h-4 w-4"
                              {...register(field.name)}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}

            <div className="md:col-span-2 pt-4">
              <Button
                type="submit"
                className="w-full rounded-xl text-base font-medium"
              >
                Submit Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
