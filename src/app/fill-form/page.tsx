"use client";

import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      description: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("location", data.location);
    formData.append("description", data.description);

    try {
      const response = await axios.post("/api/fill-form", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error submitting form:", error.response?.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setValue("image", e.target.files[0]);
          }
        }}
      />
      {errors.image && <span>{String(errors.image.message)}</span>}

      <Input type="text" placeholder="Location" {...register("location")} />
      {errors.location && <span>{errors.location.message}</span>}

      <Input
        type="text"
        placeholder="Description"
        {...register("description")}
      />
      {errors.description && <span>{errors.description.message}</span>}

      <Button className="border" type="submit">
        Submit
      </Button>
    </form>
  );
}
