'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/ui/atoms/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the confirm button when modal opens
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  const variantStyles = {
    danger: {
      icon: '⚠️',
      iconBg: 'from-red-500 to-pink-500',
      confirmButton: 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50 hover:from-red-700 hover:to-pink-700',
    },
    warning: {
      icon: '⚠️',
      iconBg: 'from-orange-500 to-amber-500',
      confirmButton: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/50 hover:from-orange-700 hover:to-amber-700',
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'from-blue-500 to-cyan-500',
      confirmButton: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 hover:from-blue-700 hover:to-cyan-700',
    },
  };

  const styles = variantStyles[variant];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md transform rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${styles.iconBg} text-3xl shadow-lg`}
          >
            {styles.icon}
          </div>
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="mb-3 text-center text-2xl font-bold text-gray-900"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="modal-message"
          className="mb-6 text-center text-gray-700"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className={`flex-1 ${styles.confirmButton}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

