import React, { useState, useEffect } from 'react';
import { Trip, TripStatus, FilterType } from './types';
import { getTrips, saveTrips, exportToExcel } from './services/tripService';
import StatsCards from './components/StatsCards';
import TripTable from './components/TripTable';
import TripModal from './components/TripModal';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load initial data
  useEffect(() => {
    const loadedTrips = getTrips();
    setTrips(loadedTrips);
  }, []);

  const handleAddTrip = (newTripData: Omit<Trip, 'id' | 'status'>) => {
    const newTrip: Trip = {
      ...newTripData,
      id: Date.now(),
      status: TripStatus.PENDING
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: number, status: TripStatus) => {
    const updatedTrips = trips.map(t => t.id === id ? { ...t, status } : t);
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lượt đăng ký này?')) {
      const updatedTrips = trips.filter(t => t.id !== id);
      setTrips(updatedTrips);
      saveTrips(updatedTrips);
    }
  };

  const handleExport = () => {
    exportToExcel(trips);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">VIMC Union</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
            Hệ thống Quản lý & Đăng ký Xe Công tác
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport} 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-semibold transition shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-md shadow-blue-900/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Đăng ký mới
          </button>
        </div>
      </header>

      {/* Statistics */}
      <StatsCards trips={trips} />

      {/* Main Table */}
      <TripTable 
        trips={trips} 
        filter={filter} 
        setFilter={setFilter} 
        onUpdateStatus={handleUpdateStatus} 
        onDelete={handleDelete}
      />

      {/* Modal */}
      <TripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddTrip}
        existingTrips={trips}
      />
    </div>
  );
};

export default App;