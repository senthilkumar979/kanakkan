import { z } from 'zod';

export const dashboardFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type DashboardFiltersInput = z.infer<typeof dashboardFiltersSchema>;

