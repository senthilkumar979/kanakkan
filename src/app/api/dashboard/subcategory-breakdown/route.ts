import { NextRequest } from 'next/server';
import { getSubcategoryBreakdownController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getSubcategoryBreakdownController(req);
}

