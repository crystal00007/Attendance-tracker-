import React, { useState } from 'react';
import { ClassEntry, DayOfWeek } from '../types';
import { PlusIcon } from './Icons';

interface TimetableFormProps {
  // FIX: Update onAddClass prop to not expect 'color', as it's generated in the parent.
  onAddClass: (newClass: Omit<ClassEntry, 'id' | 'color'>) => void;
}

const TimetableForm: React.FC<TimetableFormProps> = ({ onAddClass }) => {
  const [courseName, setCourseName] = useState('');
  const [day, setDay] = useState<DayOfWeek>(DayOfWeek.Monday);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !day || !startTime || !endTime) {
      alert('Please fill all fields');
      return;
    }
    if (startTime >= endTime) {
        alert('Start time must be before end time.');
        return;
    }
    onAddClass({ courseName, day, startTime, endTime });
    setCourseName('');
  };

  return (
    <div className="bg-[#1C1C1E] p-6 rounded-lg w-full">
      <h2 className="text-xl font-bold text-white mb-4">Add a Class Manually</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium text-gray-400">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black text-white border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:border-transparent sm:text-sm"
            placeholder="e.g., Introduction to React"
            required
          />
        </div>

        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-400">
            Day of the Week
          </label>
          <select
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value as DayOfWeek)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:border-transparent sm:text-sm rounded-md"
          >
            {Object.values(DayOfWeek).map((dayValue) => (
              <option key={dayValue} value={dayValue}>{dayValue}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-400">
                Start Time
            </label>
            <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-black text-white border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:border-transparent sm:text-sm"
                required
                style={{ colorScheme: 'dark' }}
            />
            </div>
            <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-400">
                End Time
            </label>
            <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-black text-white border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:border-transparent sm:text-sm"
                required
                style={{ colorScheme: 'dark' }}
            />
            </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#F472B6] hover:bg-[#EC4899] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1E] focus:ring-[#F472B6] transition-colors"
        >
            <PlusIcon />
            Add Class
        </button>
      </form>
    </div>
  );
};

export default TimetableForm;