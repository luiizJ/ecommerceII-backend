import { z } from "zod";

export const GetOneProductSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
