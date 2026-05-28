import React from 'react';
import { ClassEntry } from '../types';
import { TrashIcon } from './Icons';

interface TimetableTableProps {
  classes: ClassEntry[];
  onDeleteClass: (id: string) => void;
}

const TimetableTable: React.FC<TimetableTableProps> = ({ classes, onDeleteClass }) => {
  if (classes.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-[#1C1C1E] rounded-lg">
        <h3 className="text-lg font-medium text-white">Your Timetable is Empty</h3>
        <p className="text-sm text-gray-400 mt-2">Add classes using the forms above to see them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-black">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Course Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    End Time
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-[#1C1C1E] divide-y divide-gray-800">
                {classes.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-[#2C2C2E] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{classItem.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{classItem.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{classItem.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{classItem.endTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                        onClick={() => onDeleteClass(classItem.id)}
                        className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1E] focus:ring-red-500 rounded-md p-1"
                        aria-label={`Delete ${classItem.courseName}`}
                        >
                        <TrashIcon />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TimetableTable;