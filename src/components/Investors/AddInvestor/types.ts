export interface InvestorFormData {
  // Basic Details
  nameAsPanCard: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // Investment Details
  amount: number;
  paymentSystem: string;
  referencePerson: string;

  // Payment Details
  paymentReceivedAccount: string;
  date: string;

  // Bank Details
  bankName: string;
  bankAccountNumber: string;
  ifsc: string;

  // Nominee Details
  nomineeName: string;
  nomineeRelation: string;
  nomineeAadharNumber: string;

  // Personal Details
  panCardAccountType: string;
  panCardNumber: string;
  aadharCard: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;

  // Documents
  aadharCardFile?: File;
  panCardFile?: File;
  chequePassbookFile?: File;
  bankStatementFile?: File;
  signatureFile?: File;
  description: string;

  // Status
  activeInvestor: boolean;
}
export interface InvestorUpdateFormData {
  // Basic Details
  nameAsPanCard: string;
  email: string;
  phoneNumber: string;

  // Investment Details
  amount: number;
  paymentSystem: string;
  referencePerson: string;

  // Bank Details
  bankName: string;
  bankAccountNumber: string;
  ifsc: string;

  // Nominee Details
  nomineeName: string;
  nomineeRelation: string;
  nomineeAadharNumber: string;

  // Personal Details
  panCardAccountType: string;
  panCardNumber: string;
  aadharCard: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;

  // Documents
  aadharCardFile?: File;
  panCardFile?: File;
  chequePassbookFile?: File;
  bankStatementFile?: File;
  signatureFile?: File;
  description: string;

  // Status
  activeInvestor: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface Reference {
  id: string;
  name: string;
  referenceId: string;
  deleted: boolean;
  updatedAt: string;
  totalInvestors: number;
}

export interface PaymentSystem {
  paymentSystemId: number;
  name: string;
}

export interface Account {
  accountId: string;
  name: string;
  balance: number;
  amountColour: string;
  accountTypeId: number;
}

export interface PanCardType {
  id: number;
  label: string;
}
