'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { ErrorMessage } from '../molecules/ErrorMessage';
import {
  loginSchema,
  registerSchema,
  type RegisterInput,
  type LoginInput,
} from '@/modules/auth/auth.schema';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: RegisterInput | LoginInput) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  error,
}: AuthFormProps) {
  const isLogin = mode === 'login';
  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput | LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: RegisterInput | LoginInput) => {
    try {
      await onSubmit(data);
    } catch {
      // Error is handled by parent component
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
    >
      {error && (
        <div className="rounded-xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 p-4 shadow-lg">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      <div className="space-y-5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full shadow-xl"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLogin ? '🔐 Sign In' : '✨ Create Account'}
      </Button>
    </form>
  );
}

