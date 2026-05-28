import React from 'react';

type View = 'week' | 'month' | 'semester';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views: View[] = ['week', 'month', 'semester'];

  return (
    <div className="flex justify-center bg-black p-1 rounded-lg">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:ring-offset-2 focus:ring-offset-black ${
            currentView === view
              ? 'bg-[#F472B6] text-black shadow'
              : 'text-gray-300 hover:bg-[#1C1C1E]'
          }`}
          aria-pressed={currentView === view}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)} View
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;