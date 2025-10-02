"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { DEFAULT_TIMEZONES, searchTimezones } from "../lib/timezones";
import { toast } from "sonner";

interface TimezoneSearchProps {
  onAdd: (timezoneId: string) => void;
  existingTimezones: string[];
}

export default function TimezoneSearch({ onAdd, existingTimezones }: TimezoneSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(DEFAULT_TIMEZONES);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchTimezones(query));
      setIsOpen(true);
    } else {
      setResults(DEFAULT_TIMEZONES);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (timezoneId: string) => {
    if (existingTimezones.includes(timezoneId)) {
      toast.error("This timezone is already added!");
      return;
    }

    onAdd(timezoneId);
    setQuery("");
    setIsOpen(false);
    toast.success("Timezone added!");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities or time zones..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
        />
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.slice(0, 20).map((tz) => {
            const isAdded = existingTimezones.includes(tz.id);

            return (
              <button
                key={tz.id}
                onClick={() => !isAdded && handleAdd(tz.id)}
                disabled={isAdded}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                  isAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {tz.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {tz.country && `${tz.country} • `}
                      {tz.abbreviation}
                    </div>
                  </div>
                  {!isAdded && (
                    <Plus size={18} className="text-blue-500 shrink-0 mt-1" />
                  )}
                  {isAdded && (
                    <span className="text-xs text-gray-400 shrink-0 mt-1">Added</span>
                  )}
                </div>
              </button>
            );
          })}

          {results.length > 20 && (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
              Showing 20 of {results.length} results
            </div>
          )}
        </div>
      )}

      {isOpen && results.length === 0 && query && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          No time zones found for "{query}"
        </div>
      )}
    </div>
  );
}
