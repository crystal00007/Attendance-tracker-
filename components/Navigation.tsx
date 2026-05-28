import React from 'react';

type Page = 'dashboard' | 'setup';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems: { id: Page; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'setup', label: 'Setup Classes' },
  ];

  return (
    <header className="bg-[#1C1C1E] mb-8 sm:mb-12 rounded-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">Attendance Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1E] focus:ring-[#F472B6] ${
                    currentPage === item.id
                        ? 'bg-[#F472B6] text-black'
                        : 'text-gray-300 hover:bg-[#2C2C2E] hover:text-white'
                    }`}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                >
                    {item.label}
                </button>
                ))}
            </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;