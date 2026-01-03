import { NextRequest } from 'next/server';
import { getDashboardMetricsController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getDashboardMetricsController(req);
}

