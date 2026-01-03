import { NextRequest } from 'next/server';
import { getIncomeVsExpenseController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getIncomeVsExpenseController(req);
}

