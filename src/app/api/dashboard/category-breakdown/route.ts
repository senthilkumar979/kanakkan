import { NextRequest } from 'next/server';
import { getCategoryBreakdownController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getCategoryBreakdownController(req);
}

