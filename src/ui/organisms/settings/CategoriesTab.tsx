'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import { SelectField } from '@/ui/molecules/SelectField';
import { getCategories } from '@/services/transaction.service';
import { createCategory, updateCategory, deleteCategory } from '@/services/management.service';
import type { Category } from '@/services/transaction.service';

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'EXPENSE' as 'EXPENSE' | 'INCOME' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();
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

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
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
        const result = await updateCategory(editingId, formData);
        if (!result.success) {
          setError(result.error || 'Failed to update category');
          return;
        }
      } else {
        const result = await createCategory(formData);
        if (!result.success) {
          setError(result.error || 'Failed to create category');
          return;
        }
      }

      setFormData({ name: '', type: 'EXPENSE' });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, type: (category as unknown as { type?: 'EXPENSE' | 'INCOME' }).type || 'EXPENSE' });
    setEditingId(category.id);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteModalOpen(false);
    try {
      const result = await deleteCategory(itemToDelete.id);
      if (!result.success) {
        setError(result.error || 'Failed to delete category');
        return;
      }
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', type: 'EXPENSE' });
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-blue-900">
          {editingId ? '✏️ Edit Category' : '➕ Add Category'}
        </h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              ref={nameInputRef}
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <SelectField
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'EXPENSE' | 'INCOME' })}
              options={[
                { value: 'EXPENSE', label: 'Expense' },
                { value: 'INCOME', label: 'Income' },
              ]}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl"
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
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => {
              const colors = [
                'from-blue-100 to-cyan-100 border-blue-300',
                'from-purple-100 to-pink-100 border-purple-300',
                'from-green-100 to-emerald-100 border-green-300',
                'from-orange-100 to-red-100 border-orange-300',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div
                  key={category.id}
                  className={`flex items-center justify-between rounded-xl border-2 bg-gradient-to-r ${colorClass} p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-800">{category.name}</div>
                      {category.userId === 'SYSTEM' && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          System
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {(category as unknown as { type?: string }).type || 'EXPENSE'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(category.id, category.name)}
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
        title="Delete Category"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

