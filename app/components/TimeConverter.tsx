"use client";

import { useState } from "react";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { convertTime, formatTimeInZone } from "../lib/time-utils";
import { DEFAULT_TIMEZONES } from "../lib/timezones";

interface TimeConverterProps {
  availableTimezones: string[];
  timeFormat: "12h" | "24h";
}

export default function TimeConverter({ availableTimezones, timeFormat }: TimeConverterProps) {
  const [fromTimezone, setFromTimezone] = useState(availableTimezones[0] || "UTC");
  const [toTimezone, setToTimezone] = useState(availableTimezones[1] || "America/New_York");
  const [inputTime, setInputTime] = useState(format(new Date(), "HH:mm"));
  const [inputDate, setInputDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    try {
      // Parse the input time and date
      const dateTimeStr = `${inputDate} ${inputTime}`;
      const parsedTime = parse(dateTimeStr, "yyyy-MM-dd HH:mm", new Date());

      // Convert
      const converted = convertTime(parsedTime, fromTimezone, toTimezone);

      // Format result
      const formatStr = timeFormat === "12h" ? "h:mm a 'on' MMM d, yyyy" : "HH:mm 'on' MMM d, yyyy";
      const resultStr = formatTimeInZone(converted, toTimezone, formatStr);

      setResult(resultStr);
    } catch (error) {
      setResult("Invalid time format");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CalendarIcon size={20} />
        Time Zone Converter
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* From section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            From
          </label>
          <select
            value={fromTimezone}
            onChange={(e) => setFromTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableTimezones.map((tz) => {
              const tzInfo = DEFAULT_TIMEZONES.find((t) => t.id === tz);
              return (
                <option key={tz} value={tz}>
                  {tzInfo?.name || tz} ({tzInfo?.abbreviation || ""})
                </option>
              );
            })}
          </select>

          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center md:flex-col">
          <ArrowRight size={24} className="text-gray-400 rotate-0 md:rotate-90" />
        </div>

        {/* To section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            To
          </label>
          <select
            value={toTimezone}
            onChange={(e) => setToTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableTimezones.map((tz) => {
              const tzInfo = DEFAULT_TIMEZONES.find((t) => t.id === tz);
              return (
                <option key={tz} value={tz}>
                  {tzInfo?.name || tz} ({tzInfo?.abbreviation || ""})
                </option>
              );
            })}
          </select>

          {result && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result:</p>
              <p className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                {result}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConvert}
        className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        Convert Time
      </button>
    </div>
  );
}
