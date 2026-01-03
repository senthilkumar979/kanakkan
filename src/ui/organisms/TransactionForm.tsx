'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { DatePicker } from '../molecules/DatePicker';
import { AmountInput } from '../molecules/AmountInput';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { ExpenseFields } from './ExpenseFields';
import { IncomeFields } from './IncomeFields';

export type TransactionType = 'expense' | 'income';

export interface SelectOption {
  value: string;
  label: string;
}

export interface TransactionFormData {
  amount: number;
  date: string;
  note?: string;
  categoryId?: string;
  subCategoryId?: string;
  moneyModeId?: string;
  cardId?: string;
  paymentTypeId?: string;
  accountId?: string;
  incomeCategoryId?: string;
  source?: string;
}

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  defaultValues?: Partial<TransactionFormData>;
  categoryOptions?: SelectOption[];
  subCategoryOptions?: SelectOption[];
  incomeCategoryOptions?: SelectOption[];
  moneyModeOptions?: SelectOption[];
  paymentTypeOptions?: SelectOption[];
  cardOptions?: SelectOption[];
  accountOptions?: SelectOption[];
}

export function TransactionForm({
  type,
  onSubmit,
  isLoading = false,
  error,
  defaultValues,
  categoryOptions = [],
  subCategoryOptions = [],
  incomeCategoryOptions = [],
  moneyModeOptions = [],
  paymentTypeOptions = [],
  cardOptions = [],
  accountOptions = [],
}: TransactionFormProps) {
  const isExpense = type === 'expense';
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: defaultValues?.amount || 0,
      date: defaultValues?.date || new Date().toISOString().split('T')[0],
      note: defaultValues?.note || '',
      categoryId: defaultValues?.categoryId || '',
      subCategoryId: defaultValues?.subCategoryId || '',
      moneyModeId: defaultValues?.moneyModeId || '',
      cardId: defaultValues?.cardId || '',
      paymentTypeId: defaultValues?.paymentTypeId || '',
      incomeCategoryId: defaultValues?.incomeCategoryId || '',
      source: defaultValues?.source || '',
      accountId: defaultValues?.accountId || '',
    },
  });
  const selectedCategoryId = watch('categoryId');
  const selectedMoneyModeId = watch('moneyModeId');
  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      noValidate
    >
      {error && (
        <div className="rounded-xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 p-4 shadow-lg">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <AmountInput
          label="Amount"
          required
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            valueAsNumber: true,
          })}
        />
        <DatePicker
          label="Date"
          required
          error={errors.date?.message}
          {...register('date', { required: 'Date is required' })}
        />
      </div>

      {isExpense ? (
        <ExpenseFields
          control={control}
          errors={errors}
          selectedCategoryId={selectedCategoryId}
          selectedMoneyModeId={selectedMoneyModeId}
          categoryOptions={categoryOptions}
          subCategoryOptions={subCategoryOptions}
          moneyModeOptions={moneyModeOptions}
          paymentTypeOptions={paymentTypeOptions}
          cardOptions={cardOptions}
          accountOptions={accountOptions}
        />
      ) : (
        <IncomeFields
          control={control}
          register={register}
          errors={errors}
          incomeCategoryOptions={incomeCategoryOptions}
          accountOptions={accountOptions}
        />
      )}

      <FormField
        label="Note"
        type="text"
        error={errors.note?.message}
        {...register('note', {
          maxLength: { value: 500, message: 'Note must be less than 500 characters' },
        })}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 hover:shadow-xl"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isExpense ? '💸 Add Expense' : '💰 Add Income'}
      </Button>
    </form>
  );
}

