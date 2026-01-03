import { NextRequest } from 'next/server';
import { getCardSpendController } from '@/modules/dashboard/dashboard.controller';

export async function GET(req: NextRequest) {
  return getCardSpendController(req);
}

