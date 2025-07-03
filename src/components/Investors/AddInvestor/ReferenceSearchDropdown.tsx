import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { Reference } from './types';

interface ReferenceSearchDropdownProps {
  references: Reference[];
  selectedReference: Reference | null;
  onSelect: (reference: Reference) => void;
  onSearch: (searchTerm: string) => void;
  loading: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const ReferenceSearchDropdown: React.FC<ReferenceSearchDropdownProps> = ({
  references,
  selectedReference,
  onSelect,
  onSearch,
  loading,
  error,
  placeholder = "Select Reference Person",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleReferenceSelect = (reference: Reference) => {
    onSelect(reference);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {required && <span className="text-red-500 mr-1">*</span>}
        Reference Person
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {selectedReference ? (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {selectedReference.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {selectedReference.referenceId}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search references..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* References List */}
          {!loading && !error && (
            <div className="max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleReferenceSelect({ 
                  id: "0", 
                  name: "- NA", 
                  referenceId: "0", 
                  deleted: false, 
                  updatedAt: new Date().toISOString(),
                  totalInvestors: 0
                })}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedReference?.referenceId === "0" ? 'bg-cyan-50 text-cyan-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">- NA</span>
                  {selectedReference?.referenceId === "0" && (
                    <Check size={16} className="text-cyan-500" />
                  )}
                </div>
              </button>
              
              {references.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    {searchTerm ? `No references found for "${searchTerm}"` : 'No references available'}
                  </p>
                </div>
              ) : (
                references.map((reference) => (
                  <button
                    key={reference.id}
                    type="button"
                    onClick={() => handleReferenceSelect(reference)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedReference?.id === reference.id ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{reference.name}</div>
                        <div className="text-xs text-gray-500">{reference.referenceId}</div>
                      </div>
                      {selectedReference?.id === reference.id && (
                        <Check size={16} className="text-cyan-500" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ReferenceSearchDropdown;