// import Select from "react-select";
import {useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema.js";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";


export const FormWithZod = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      select: "",
      age: "",
      password: "",
    },
  });

//   useEffect(() => {
//     const checkDisability = watch((value) => {
      
//         if(value.firstname.includes(' ')){
//           setDisabled((prev) => ({ ...prev, firstname: true }));
//         }
//         if(value.lastname.includes(' ')){
//           setDisabled((prev) => ({ ...prev, lastname: true }));
//         }
//     }, []); 



  const onSubmit = (data) => console.log(data);
  return (
    <div className="flex items-start justify-center flex-col gap-4 p-10 m-4 border border-gray-300 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstname"
          control={control}
          render={({ field }) => (
            <div className="space-y-1 p-2">
              <Label>
                First name:
                <Input
                  placeholder="enter first name"
                  className="flex flex-row gap-5 py-4 space-x-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    // when the space occur they are stopped
                    if (value.includes(' ')) return;
                    field.onChange(value);
                  }}
                  {...field}
                />
              </Label>
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="lastname"
          control={control}
          render={({ field }) => (
            <div className="space-y-1 p-2">
              <Label>
                Last name:
                <Input
                  placeholder="enter last name"
                  className="flex gap-5 py-4 space-x-2"
                   onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes(' ')) return;

                    field.onChange(value);
                  }}
                  {...field}
                />
              </Label>
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
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
          render={({ field }) => (
            <div className="space-y-1 p-3">
              <Label>Password</Label>
              <Input
                type="password"
                {...field}
                placeholder="enter password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <div className="space-y-1 p-3">
              <Label>
                Age:
                <Input
                  type="number"
                  {...field}
                  placeholder="enter age"
                  className="flex flex-row gap-5 py-4 space-x-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Prevent more than 3 digits
                    if (value.length > 3) return;

                    field.onChange(value);
                  }}
                />
              </Label>
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="select"
          control={control}
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
        <input
          type="submit"
          className="border-3 p-2 rounded-lg mt-2 bg-black text-white"
          value={isSubmitting ? "Submitting..." : "Submit"}
        />
      </form>
    </div>
  );
};
