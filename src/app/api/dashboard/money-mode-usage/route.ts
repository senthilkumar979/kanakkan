import { NextRequest } from 'next/server';
import { getMoneyModeUsageController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getMoneyModeUsageController(req);
}

