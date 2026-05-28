import React, { useState } from 'react';
import { ClipboardPasteIcon, UploadIcon } from './Icons';

interface PasteInputProps {
    onProcessPaste: (text: string) => void;
}

const PasteInput: React.FC<PasteInputProps> = ({ onProcessPaste }) => {
    const [pastedText, setPastedText] = useState('');

    const handleProcess = () => {
        if (!pastedText.trim()) {
            alert('Please paste some text first.');
            return;
        }
        onProcessPaste(pastedText);
        setPastedText('');
    };

    return (
        <div className="bg-[#1C1C1E] p-6 rounded-lg w-full">
            <h2 className="text-xl font-bold text-white mb-4">Quick Add</h2>
            <p className="text-sm text-gray-400 mb-4">
                Paste your timetable from Excel, Sheets, or a PDF. Ensure columns are in the order: Course, Day, Start Time, End Time.
            </p>
            <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={8}
                className="mt-1 block w-full px-3 py-2 bg-black text-white border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:border-transparent sm:text-sm"
                placeholder="Data Structures	Monday	11:00	12:00&#10;Algorithms	Tuesday	14:00	15:30"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                 <button
                    onClick={handleProcess}
                    className="w-full flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#F472B6] hover:bg-[#EC4899] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1E] focus:ring-[#F472B6] transition-colors"
                    >
                    <ClipboardPasteIcon />
                    Process Pasted Text
                </button>
                 <button
                    disabled
                    className="w-full flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-900 cursor-not-allowed"
                    title="Feature coming soon"
                    >
                    <UploadIcon />
                    Upload CSV
                </button>
            </div>
        </div>
    );
};

export default PasteInput;