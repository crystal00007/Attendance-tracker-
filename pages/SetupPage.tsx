import React from 'react';
import { ClassEntry } from '../types';
import TimetableForm from '../components/TimetableForm';
import TimetableTable from '../components/TimetableTable';
import PasteInput from '../components/PasteInput';
import { ExclamationTriangleIcon } from '../components/Icons';

interface SetupPageProps {
    classes: ClassEntry[];
    onAddClass: (newClass: Omit<ClassEntry, 'id' | 'color'>) => void;
    onDeleteClass: (id: string) => void;
    onProcessPaste: (text: string) => void;
    onResetData: () => void;
}

const SetupPage: React.FC<SetupPageProps> = ({ classes, onAddClass, onDeleteClass, onProcessPaste, onResetData }) => {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <TimetableForm onAddClass={onAddClass} />
                <PasteInput onProcessPaste={onProcessPaste} />
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Your Class Schedule</h2>
                <TimetableTable classes={classes} onDeleteClass={onDeleteClass} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                <div className="bg-[#1C1C1E] p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-white">Reset Application Data</h3>
                    <p className="text-sm text-gray-400 mt-2 mb-4 max-w-md mx-auto">
                        This will permanently delete all your classes and attendance records from this browser. This action cannot be undone.
                    </p>
                    <button
                        onClick={onResetData}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1C1C1E] transition-colors"
                    >
                        <ExclamationTriangleIcon />
                        Reset All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetupPage;