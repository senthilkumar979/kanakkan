'use client';

import { Control, Controller } from 'react-hook-form';
import { SelectField } from '../molecules/SelectField';
import { FormField } from '../molecules/FormField';
import type { TransactionFormData, SelectOption } from './TransactionForm';

interface IncomeFieldsProps {
  control: Control<TransactionFormData>;
  register: ReturnType<typeof import('react-hook-form').useForm<TransactionFormData>>['register'];
  errors: Record<string, { message?: string }>;
  incomeCategoryOptions: SelectOption[];
  accountOptions: SelectOption[];
}

export function IncomeFields({
  control,
  register,
  errors,
  incomeCategoryOptions,
  accountOptions,
}: IncomeFieldsProps) {
  return (
    <>
      <Controller
        name="incomeCategoryId"
        control={control}
        rules={{ required: 'Income category is required' }}
        render={({ field }) => (
          <SelectField
            label="Income Category"
            required
            placeholder="Select an income category"
            options={incomeCategoryOptions}
            error={errors.incomeCategoryId?.message}
            {...field}
          />
        )}
      />
      <FormField
        label="Source"
        type="text"
        required
        error={errors.source?.message}
        {...register('source', {
          required: 'Source is required',
          maxLength: {
            value: 200,
            message: 'Source must be less than 200 characters',
          },
        })}
      />
      <Controller
        name="accountId"
        control={control}
        rules={{ required: 'Account is required' }}
        render={({ field }) => (
          <SelectField
            label="Account"
            required
            placeholder="Select a bank account"
            options={accountOptions}
            error={errors.accountId?.message}
            {...field}
          />
        )}
      />
    </>
  );
}

