export interface MoneyMode {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PaymentType {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Card {
  id: string;
  providerName: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateMoneyModeInput {
  name: string;
}

export interface UpdateMoneyModeInput {
  name?: string;
}

export interface CreatePaymentTypeInput {
  name: string;
}

export interface UpdatePaymentTypeInput {
  name?: string;
}

export interface CreateCardInput {
  providerName: string;
}

export interface UpdateCardInput {
  providerName?: string;
}

