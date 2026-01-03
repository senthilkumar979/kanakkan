'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import { SelectField } from '@/ui/molecules/SelectField';
import { getBankAccounts } from '@/services/transaction.service';
import { createBankAccount, updateBankAccount, deleteBankAccount } from '@/services/management.service';
import type { BankAccount } from '@/services/transaction.service';

export function BankAccountsTab() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'SAVINGS' as 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  useEffect(() => {
    if (editingId && formRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Focus after scroll animation completes (typically 500-1000ms)
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 600);
      });
    }
  }, [editingId]);

  const loadBankAccounts = async () => {
    setIsLoading(true);
    try {
      const result = await getBankAccounts();
      if (result.success && result.data) {
        setBankAccounts(result.data);
      }
    } catch (err) {
      console.error('Failed to load bank accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(undefined);

    try {
      const submitData = {
        name: formData.name,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber || undefined,
        ifscCode: formData.ifscCode || undefined,
        accountType: formData.accountType,
      };

      if (editingId) {
        const result = await updateBankAccount(editingId, submitData);
        if (!result.success) {
          setError(result.error || 'Failed to update bank account');
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await createBankAccount(submitData);
        if (!result.success) {
          setError(result.error || 'Failed to create bank account');
          setIsSubmitting(false);
          return;
        }
      }
      await loadBankAccounts();
      setFormData({ name: '', bankName: '', accountNumber: '', ifscCode: '', accountType: 'SAVINGS' });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setFormData({
      name: account.name,
      bankName: account.bankName,
      accountNumber: account.accountNumber || '',
      ifscCode: account.ifscCode || '',
      accountType: account.accountType,
    });
    setEditingId(account.id);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteModalOpen(false);
    try {
      const result = await deleteBankAccount(itemToDelete.id);
      if (!result.success) {
        setError(result.error || 'Failed to delete bank account');
        return;
      }
      await loadBankAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', bankName: '', accountNumber: '', ifscCode: '', accountType: 'SAVINGS' });
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-indigo-900">
          {editingId ? '✏️ Edit Bank Account' : '➕ Add Bank Account'}
        </h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              ref={nameInputRef}
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
              placeholder="e.g., Primary Savings"
            />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
              className="mt-1"
              placeholder="e.g., HDFC Bank"
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="mt-1"
              placeholder="e.g., 1234567890"
            />
          </div>
          <div>
            <Label htmlFor="ifscCode">IFSC Code (Optional)</Label>
            <Input
              id="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              className="mt-1"
              placeholder="e.g., HDFC0001234"
              maxLength={11}
            />
          </div>
          <div className="sm:col-span-2">
            <SelectField
              label="Account Type"
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value as typeof formData.accountType })}
              options={[
                { value: 'SAVINGS', label: 'Savings' },
                { value: 'CURRENT', label: 'Current' },
                { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit' },
                { value: 'RECURRING_DEPOSIT', label: 'Recurring Deposit' },
                { value: 'OTHER', label: 'Other' },
              ]}
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-xl"
          >
            {editingId ? '✅ Update' : '➕ Add'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 hover:bg-gray-100"
            >
              ❌ Cancel
            </Button>
          )}
        </div>
      </form>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Bank Accounts</h3>
        {bankAccounts.length === 0 ? (
          <p className="text-muted-foreground">No bank accounts yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {bankAccounts.map((account, index) => {
              const colors = [
                'from-indigo-100 to-blue-100 border-indigo-300',
                'from-blue-100 to-cyan-100 border-blue-300',
                'from-cyan-100 to-teal-100 border-cyan-300',
                'from-teal-100 to-emerald-100 border-teal-300',
              ];
              const colorClass = colors[index % colors.length];

              return (
                <div
                  key={account.id}
                  className={`flex items-center justify-between rounded-xl border-2 bg-gradient-to-r ${colorClass} p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div>
                    <div className="font-bold text-gray-800">{account.name}</div>
                    <div className="text-sm font-medium text-gray-600">
                      {account.bankName} • {account.accountType}
                    </div>
                    {(account.accountNumber || account.ifscCode) && (
                      <div className="mt-1 text-xs text-gray-500">
                        {account.accountNumber && `A/C: ****${account.accountNumber.slice(-4)}`}
                        {account.accountNumber && account.ifscCode && ' • '}
                        {account.ifscCode && `IFSC: ${account.ifscCode}`}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(account)}
                      className="border-indigo-400 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(account.id, account.name)}
                      className="border-red-400 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Bank Account"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

