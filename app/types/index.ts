export interface CreateEventDTO {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  is_all_day?: boolean;
  recurrence_rule?: string;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  color?: string;
  is_all_day?: boolean;
  recurrence_rule?: string;
}

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
