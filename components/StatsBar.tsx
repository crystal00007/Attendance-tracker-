import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface StatsBarProps {
  totalAttended: number;
  totalMissed: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ totalAttended, totalMissed }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-gray-800 p-3 z-50 shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-6 sm:gap-12 text-sm sm:text-base">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircleIcon className="h-6 w-6" />
          <div>
            <span className="font-bold">{totalAttended}</span>
            <span className="text-gray-400 ml-1.5">Attended</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-red-400">
          <XCircleIcon className="h-6 w-6" />
          <div>
            <span className="font-bold">{totalMissed}</span>
            <span className="text-gray-400 ml-1.5">Missed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
