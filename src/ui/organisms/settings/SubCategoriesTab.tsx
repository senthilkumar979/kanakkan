'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import { SelectField } from '@/ui/molecules/SelectField';
import { getCategories, getSubCategories } from '@/services/transaction.service';
import { createSubCategory, updateSubCategory, deleteSubCategory } from '@/services/management.service';
import type { Category, SubCategory } from '@/services/transaction.service';

export function SubCategoriesTab() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, subCategoriesRes] = await Promise.all([
        getCategories(),
        getSubCategories(),
      ]);

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      if (subCategoriesRes.success && subCategoriesRes.data) {
        setSubCategories(subCategoriesRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
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
        const result = await updateSubCategory(editingId, formData);
        if (!result.success) {
          setError(result.error || 'Failed to update subcategory');
          return;
        }
      } else {
        const result = await createSubCategory(formData);
        if (!result.success) {
          setError(result.error || 'Failed to create subcategory');
          return;
        }
      }

      setFormData({ name: '', categoryId: '' });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setFormData({ name: subCategory.name, categoryId: subCategory.categoryId });
    setEditingId(subCategory.id);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteModalOpen(false);
    try {
      const result = await deleteSubCategory(itemToDelete.id);
      if (!result.success) {
        setError(result.error || 'Failed to delete subcategory');
        return;
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', categoryId: '' });
    setEditingId(null);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-purple-900">
          {editingId ? '✏️ Edit Subcategory' : '➕ Add Subcategory'}
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
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categoryOptions}
              placeholder="Select a category"
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
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
        <h3 className="mb-4 text-lg font-semibold">Subcategories</h3>
        {subCategories.length === 0 ? (
          <p className="text-muted-foreground">No subcategories yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {subCategories.map((subCategory, index) => {
              const category = categories.find((cat) => cat.id === subCategory.categoryId);
              const colors = [
                'from-purple-100 to-pink-100 border-purple-300',
                'from-pink-100 to-rose-100 border-pink-300',
                'from-indigo-100 to-purple-100 border-indigo-300',
                'from-violet-100 to-purple-100 border-violet-300',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div
                  key={subCategory.id}
                  className={`flex items-center justify-between rounded-xl border-2 bg-gradient-to-r ${colorClass} p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-800">{subCategory.name}</div>
                      {subCategory.userId === 'SYSTEM' && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          System
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {category?.name || 'Unknown category'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subCategory)}
                      className="border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(subCategory.id, subCategory.name)}
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
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

