import { z } from "zod";

export const formSchema = z.object({
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Max size is 5MB"),
  location: z.string().nonempty({ message: "Location is required." }),
  description: z.string().nonempty({ message: "Description is required." }),
});
