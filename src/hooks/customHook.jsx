import data from "../../api/userProfile.json";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
    <form onSubmit={handleSubmit(onSubmit)}>
      {data.index.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <Label>{field.label}</Label>
                <Input
                  type="text"
                  {...register(field.name, { required: field.required })}
                />
                {errors[field.name] && <p>This field is required</p>}
              </div>
            );

          case "email":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <Label>{field.label}</Label>
                <Input
                  type="email"
                  {...register(field.name, { required: field.required })}
                />
              </div>
            );

          case "number":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <Label>{field.label}</Label>
                <Input
                  type="number"
                  {...register(field.name, { required: field.required })}
                />
              </div>
            );

          case "password":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <Label>{field.label}</Label>
                <Input
                  type="password"
                  {...register(field.name, { required: field.required })}
                />
              </div>
            );

          case "checkbox":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <Label>
                  <Input type="checkbox" {...register(field.name)} />
                  {field.label}
                </Label>
              </div>
            );

          case "select":
            return (
              <Controller
                name={field.name}
                control={control}
                render={({ field }) => (
                  <div className="space-y-1 p-3">
                    <Label>
                      {field.name}
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={field.name} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">{field.name}</SelectItem>
                          <SelectItem value="Female">{field.name}</SelectItem>
                          <SelectItem value="Other">{field.name}</SelectItem>
                        </SelectContent>
                      </Select>
                    </Label>
                    {errors.select && (
                      <div className="text-red-500">
                        {errors.select.message}
                      </div>
                    )}
                  </div>
                )}
              />
            );

          case "radio":
            return (
              <div key={field.name} className="space-y-1 p-2">
                <label>{field.label}</label>
                {field.options.map((option) => (
                  <Label key={option}>
                    <Input
                      type="radio"
                      value={option}
                      {...register(field.name)}
                    />
                    {option}
                  </Label>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}

      <button type="submit" className="border-2 p-2 rounded-lg">
        Submit
      </button>
    </form>
  );
};
