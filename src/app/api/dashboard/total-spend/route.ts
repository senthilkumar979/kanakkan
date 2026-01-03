import { NextRequest } from 'next/server';
import { getTotalSpendController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getTotalSpendController(req);
}

