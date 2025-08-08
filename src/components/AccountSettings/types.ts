export interface MaintenanceNote {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MaintenanceNoteApiResponse {
  statusCode?: number;
  data?: MaintenanceNote;
  message?: string;
  success?: boolean;
  // Direct response format
  title?: string;
  subtitle?: string;
  description?: string;
  status?: 'active' | 'inactive';
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface MaintenanceUpdatePayload {
  title: string;
  subtitle: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface NotificationFormData {
  title: string;
  message: string;
}