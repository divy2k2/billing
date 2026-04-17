export interface Product {
  id: number;
  category: string;
  title: string;
  snippet: string;
  specs: string;
  image: string;
  price: string;
}

export interface Plumber {
  id: number;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  rating: number;
  completedJobs: number;
  available: boolean;
  description: string;
}

export interface Booking {
  id: string;
  name?: string;
  customer_name?: string;
  phone: string;
  email?: string;
  service?: string;
  service_type?: string;
  preferred_date?: string;
  preferred_time?: string;
  description?: string;
  status: string;
  booking_type: string;
  plumber_id?: number;
  plumber_name?: string;
  address?: string;
  created_at: string;
}
