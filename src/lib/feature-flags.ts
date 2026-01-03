const FEATURE_FLAGS = {
  MONTHLY_SUMMARY_EMAIL: process.env.ENABLE_MONTHLY_SUMMARY_EMAIL === 'true',
} as const;

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag] ?? false;
}

export const featureFlags = FEATURE_FLAGS;

