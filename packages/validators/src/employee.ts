import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string(),
  role: z.string(),
  photo: z.string().optional(),
  workingDays: z.string().optional(),
});

// name: string;
// storeId: string;
// role: string;
// photo: string | null;
// workingDays: string | null;
