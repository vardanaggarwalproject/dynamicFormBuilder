// import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { formSchema } from "./schema.js";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

export const Form = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      email: "",
      select: "",
      age: "",
      password: "",
    },
  });
  // console.log("errors", errors);

  const onSubmit = (data) => console.log(data);
  return (
    <div className="flex items-start justify-center flex-col gap-4 p-10 m-4 border border-gray-300 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="Name"
        control={control}
        rules={{
          required: "first name is required",
          minLength: {
            value: 3,
            message: "first name should be at least 3 characters",
          },
          maxLength: {
            value: 20,
            message: "first name should not be more than 20 characters",
          },
        }}
        render={({ field }) => (
          <div className="space-y-1 p-2">
            <Label>
              Name:
              <Input
                placeholder="enter name"
                className="flex flex-row gap-5 py-4 space-x-2"
                {...field}
              />
            </Label>
            {errors.Name && (
              <p className="text-red-500">{errors.Name.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
            message: "Email must be valid and end with .com",
          },
        }}
        render={({ field }) => (
          <div className="space-y-1 p-3">
            <Label>Email:</Label>
            <Input
              {...field}
              placeholder="example@gmail.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            message:
              "Password must be 6 chars, include uppercase, lowercase, number & special character",
          },
        }}
        render={({ field }) => (
          <div className="space-y-1 p-3">
            <Label>Password</Label>
            <Input
              type="password"
              {...field}
              placeholder="********"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="age"
        control={control}
        rules={{
          required: "Age is required",
          min: 18,
          max: 60,
          validate: (value) => {
            if (value < 18) return "Age must be at least 18";
            if (value > 60) return "Age must be at most 60";
            if (value === "") return "Age is required";
            return true;
          },
        }}
        render={({ field }) => (
          <div className="space-y-1 p-3">
            <Label>
              Age:
              <Input
                {...field}
                placeholder="enter age"
                className="flex flex-row gap-5 py-4 space-x-2"
              />
            </Label>
            {errors.age && <p className="text-red-500">{errors.age.message}</p>}
          </div>
        )}
      />
      <Controller
        name="select"
        control={control}
        rules={{
          required: "At least one selection is required",
          validate: (value) => {
            if (value != "" && value != undefined) return true;
            return "undefined is not valid selection criteria";
          },
        }}
        render={({ field }) => (  
          <div className="space-y-1 p-3">
            <Label>
              Gender:
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Label>
            {errors.select && (
              <div className="text-red-500">{errors.select.message}</div>
            )}
          </div>
        )}
      />
      <input type="submit" className="border-3 p-2 rounded-lg mt-2 bg-black text-white"/>
    </form>
    </div>
  );
};
