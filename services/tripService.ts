import { Trip, TripStatus } from '../types';

const STORAGE_KEY = 'vimc_car_trips';

export const getTrips = (): Trip[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load trips", e);
    return [];
  }
};

export const saveTrips = (trips: Trip[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error("Failed to save trips", e);
  }
};

export const exportToExcel = (trips: Trip[]): void => {
  if (trips.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  const data = trips.map(t => ({
    'Ngày đi': t.date,
    'Giờ đi': t.time,
    'Người đăng ký': t.name,
    'Loại xe': t.carType,
    'Điểm đến': t.destination,
    'Mục đích': t.purpose,
    'Trạng thái': t.status === TripStatus.APPROVED ? 'Đã duyệt' : (t.status === TripStatus.PENDING ? 'Chờ duyệt' : 'Từ chối')
  }));

  if (window.XLSX) {
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Lịch công tác");
    window.XLSX.writeFile(wb, `Dang_Ky_Xe_VIMC_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } else {
    alert("Thư viện Excel chưa tải xong. Vui lòng thử lại sau.");
  }
};

// Date helpers
export const isThisWeek = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  const day = now.getDay() || 7; 
  const monday = new Date(now.setDate(now.getDate() - day + 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(now.setDate(monday.getDate() + 6));
  sunday.setHours(23, 59, 59, 999);
  return date >= monday && date <= sunday;
};

export const isThisMonth = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};