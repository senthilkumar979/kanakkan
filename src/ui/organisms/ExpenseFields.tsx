'use client';

import { Control, Controller } from 'react-hook-form';
import { SelectField } from '../molecules/SelectField';
import type { TransactionFormData, SelectOption } from './TransactionForm';

interface ExpenseFieldsProps {
  control: Control<TransactionFormData>;
  errors: Record<string, { message?: string }>;
  selectedCategoryId?: string;
  selectedMoneyModeId?: string;
  categoryOptions: SelectOption[];
  subCategoryOptions: SelectOption[];
  moneyModeOptions: SelectOption[];
  paymentTypeOptions: SelectOption[];
  cardOptions: SelectOption[];
  accountOptions: SelectOption[];
}

export function ExpenseFields({
  control,
  errors,
  selectedCategoryId,
  selectedMoneyModeId,
  categoryOptions,
  subCategoryOptions,
  moneyModeOptions,
  paymentTypeOptions,
  cardOptions,
  accountOptions,
}: ExpenseFieldsProps) {
  return (
    <>
      <Controller
        name="categoryId"
        control={control}
        rules={{ required: 'Category is required' }}
        render={({ field }) => (
          <SelectField
            label="Category"
            required
            placeholder="Select a category"
            options={categoryOptions}
            error={errors.categoryId?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="subCategoryId"
        control={control}
        rules={{ required: 'Subcategory is required' }}
        render={({ field }) => (
          <SelectField
            label="Subcategory"
            required
            placeholder="Select a subcategory"
            options={subCategoryOptions}
            error={errors.subCategoryId?.message}
            disabled={!selectedCategoryId}
            {...field}
          />
        )}
      />
      <Controller
        name="moneyModeId"
        control={control}
        rules={{ required: 'Money mode is required' }}
        render={({ field }) => (
          <SelectField
            label="Money Mode"
            required
            placeholder="Select a money mode"
            options={moneyModeOptions}
            error={errors.moneyModeId?.message}
            {...field}
          />
        )}
      />
      {selectedMoneyModeId && cardOptions.length > 0 && (
        <Controller
          name="cardId"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Card"
              placeholder="Select a card (optional)"
              options={[{ value: '', label: 'None' }, ...cardOptions]}
              error={errors.cardId?.message}
              {...field}
            />
          )}
        />
      )}
      <Controller
        name="paymentTypeId"
        control={control}
        rules={{ required: 'Payment type is required' }}
        render={({ field }) => (
          <SelectField
            label="Payment Type"
            required
            placeholder="Select a payment type"
            options={paymentTypeOptions}
            error={errors.paymentTypeId?.message}
            {...field}
          />
        )}
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

