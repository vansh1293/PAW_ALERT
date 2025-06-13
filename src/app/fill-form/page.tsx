"use client";

import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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
    <Form {...{ handleSubmit }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <FormField
          name="image"
          render={() => (
            <FormItem>
              <Label>Image</Label>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setValue("image", e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              <FormMessage>
                {errors.image && String(errors.image.message)}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="location"
          render={({ field }) => (
            <FormItem>
              <Label>Location</Label>
              <FormControl>
                <Input type="text" placeholder="Location" {...field} />
              </FormControl>
              <FormMessage>
                {errors.location && errors.location.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Input type="text" placeholder="Description" {...field} />
              </FormControl>
              <FormMessage>
                {errors.description && errors.description.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
