export enum TripStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum CarType {
  SEAT_4 = '4 chỗ',
  SEAT_7 = '7 chỗ',
  SEAT_16 = '16 chỗ'
}

export interface Trip {
  id: number;
  name: string;
  date: string;
  time: string;
  carType: string;
  destination: string;
  purpose: string;
  status: TripStatus;
}

export type FilterType = 'all' | 'week' | 'month';

// Declare XLSX global since we are loading it via CDN
declare global {
  interface Window {
    XLSX: any;
  }
}