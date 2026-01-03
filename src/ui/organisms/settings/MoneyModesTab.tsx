'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import { getMoneyModes } from '@/services/transaction.service';
import { createMoneyMode, updateMoneyMode, deleteMoneyMode } from '@/services/management.service';
import type { MoneyMode } from '@/services/transaction.service';

export function MoneyModesTab() {
  const [moneyModes, setMoneyModes] = useState<MoneyMode[]>([]);
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
    loadMoneyModes();
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

  const loadMoneyModes = async () => {
    setIsLoading(true);
    try {
      const result = await getMoneyModes();
      if (result.success && result.data) {
        setMoneyModes(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load money modes');
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
        const result = await updateMoneyMode(editingId, formData);
        if (!result.success) {
          setError(result.error || 'Failed to update money mode');
          return;
        }
      } else {
        const result = await createMoneyMode(formData);
        if (!result.success) {
          setError(result.error || 'Failed to create money mode');
          return;
        }
      }

      setFormData({ name: '' });
      setEditingId(null);
      await loadMoneyModes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (moneyMode: MoneyMode) => {
    setFormData({ name: moneyMode.name });
    setEditingId(moneyMode.id);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteModalOpen(false);
    try {
      const result = await deleteMoneyMode(itemToDelete.id);
      if (!result.success) {
        setError(result.error || 'Failed to delete money mode');
        return;
      }
      await loadMoneyModes();
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
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-green-900">
          {editingId ? '✏️ Edit Money Mode' : '➕ Add Money Mode'}
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
            placeholder="e.g., Cash, UPI, Bank Transfer"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl"
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
        <h3 className="mb-4 text-lg font-semibold">Money Modes</h3>
        {moneyModes.length === 0 ? (
          <p className="text-muted-foreground">No money modes yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {moneyModes.map((moneyMode, index) => {
              const colors = [
                'from-green-100 to-emerald-100 border-green-300',
                'from-emerald-100 to-teal-100 border-emerald-300',
                'from-teal-100 to-cyan-100 border-teal-300',
                'from-cyan-100 to-blue-100 border-cyan-300',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div
                  key={moneyMode.id}
                  className={`flex items-center justify-between rounded-xl border-2 bg-gradient-to-r ${colorClass} p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-800">{moneyMode.name}</div>
                    {moneyMode.userId === 'SYSTEM' && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        System
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(moneyMode)}
                      className="border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(moneyMode.id, moneyMode.name)}
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
        title="Delete Money Mode"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

