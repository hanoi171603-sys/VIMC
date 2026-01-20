import React, { useState } from 'react';
import { CarType, Trip, TripStatus } from '../types';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trip: Omit<Trip, 'id' | 'status'>) => void;
  existingTrips: Trip[];
}

const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, onSubmit, existingTrips }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    carType: CarType.SEAT_4,
    destination: '',
    purpose: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkConflict = (): boolean => {
    // Check if there is already a trip with same date, same start time, and same car type
    // Exclude REJECTED trips from conflict check
    const conflict = existingTrips.find(trip => 
      trip.status !== TripStatus.REJECTED &&
      trip.date === formData.date &&
      trip.time === formData.time &&
      trip.carType === formData.carType
    );

    return !!conflict;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (checkConflict()) {
      const confirmMsg = `⚠️ CẢNH BÁO TRÙNG LỊCH!\n\nĐã có người đăng ký ${formData.carType} vào lúc ${formData.time} ngày ${formData.date.split('-').reverse().join('/')}.\n\nBạn có chắc chắn muốn tiếp tục đăng ký không?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }

    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      date: '',
      time: '',
      carType: CarType.SEAT_4,
      destination: '',
      purpose: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-900">
          <div>
            <h2 className="text-xl font-bold text-white">Đăng ký xe mới</h2>
            <p className="text-blue-200 text-xs mt-1">Vui lòng điền đầy đủ thông tin chuyến đi</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Người đăng ký / Đi công tác <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              placeholder="Nhập họ tên người đi" 
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Ngày đi <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Giờ khởi hành <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                name="time" 
                value={formData.time} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Loại xe yêu cầu</label>
            <div className="relative">
              <select 
                name="carType" 
                value={formData.carType} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-gray-50 focus:bg-white"
              >
                <option value={CarType.SEAT_4}>Xe 4 chỗ (Sedan)</option>
                <option value={CarType.SEAT_7}>Xe 7 chỗ (SUV/MPV)</option>
                <option value={CarType.SEAT_16}>Xe 16 chỗ (Van)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Điểm đến <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="destination" 
              value={formData.destination} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              placeholder="VD: Sân bay Nội Bài, Cảng Hải Phòng..." 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Mục đích công tác <span className="text-red-500">*</span></label>
            <textarea 
              name="purpose" 
              rows={3} 
              value={formData.purpose} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white resize-none" 
              placeholder="Chi tiết công việc..."
            ></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg transition shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2">
              <span>Xác nhận Đăng ký</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;