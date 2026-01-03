'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import { getPaymentTypes } from '@/services/transaction.service';
import { createPaymentType, updatePaymentType, deletePaymentType } from '@/services/management.service';
import type { PaymentType } from '@/services/transaction.service';

export function PaymentTypesTab() {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPaymentTypes();
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

  const loadPaymentTypes = async () => {
    setIsLoading(true);
    try {
      const result = await getPaymentTypes();
      if (result.success && result.data) {
        setPaymentTypes(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(undefined);

    try {
      if (editingId) {
        const result = await updatePaymentType(editingId, formData);
        if (!result.success) {
          setError(result.error || 'Failed to update payment type');
          return;
        }
      } else {
        const result = await createPaymentType(formData);
        if (!result.success) {
          setError(result.error || 'Failed to create payment type');
          return;
        }
      }

      setFormData({ name: '' });
      setEditingId(null);
      await loadPaymentTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (paymentType: PaymentType) => {
    setFormData({ name: paymentType.name });
    setEditingId(paymentType.id);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteModalOpen(false);
    try {
      const result = await deletePaymentType(itemToDelete.id);
      if (!result.success) {
        setError(result.error || 'Failed to delete payment type');
        return;
      }
      await loadPaymentTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-red-50/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-orange-900">
          {editingId ? '✏️ Edit Payment Type' : '➕ Add Payment Type'}
        </h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            ref={nameInputRef}
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1"
            placeholder="e.g., One-time, Recurring, Installment"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl"
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
        <h3 className="mb-4 text-lg font-semibold">Payment Types</h3>
        {paymentTypes.length === 0 ? (
          <p className="text-muted-foreground">No payment types yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {paymentTypes.map((paymentType, index) => {
              const colors = [
                'from-orange-100 to-red-100 border-orange-300',
                'from-red-100 to-pink-100 border-red-300',
                'from-amber-100 to-orange-100 border-amber-300',
                'from-yellow-100 to-amber-100 border-yellow-300',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div
                  key={paymentType.id}
                  className={`flex items-center justify-between rounded-xl border-2 bg-gradient-to-r ${colorClass} p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-800">{paymentType.name}</div>
                    {paymentType.userId === 'SYSTEM' && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        System
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(paymentType)}
                      className="border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(paymentType.id, paymentType.name)}
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
        title="Delete Payment Type"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

