"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, XCircle, X } from "lucide-react";
import { format } from "date-fns";
import { findMeetingTimes, formatTimeInZone, isBusinessHours } from "../lib/time-utils";
import { MeetingTimeSlot } from "../lib/types";
import { DEFAULT_TIMEZONES } from "../lib/timezones";

interface MeetingTimeFinderProps {
  selectedTimezones: string[];
  timeFormat: "12h" | "24h";
  onRemoveTimezone?: (timezoneId: string) => void;
}

export default function MeetingTimeFinder({ selectedTimezones, timeFormat, onRemoveTimezone }: MeetingTimeFinderProps) {
  const [showFinder, setShowFinder] = useState(false);
  const [slots, setSlots] = useState<MeetingTimeSlot[]>([]);
  const [showAllTimes, setShowAllTimes] = useState(false);

  const handleFindTimes = () => {
    if (selectedTimezones.length < 2) {
      return;
    }

    const meetingSlots = findMeetingTimes(selectedTimezones, new Date(), 48);
    setSlots(meetingSlots);
    setShowFinder(true);
  };

  // Auto-recalculate when timezones change and finder is open
  useEffect(() => {
    if (showFinder && selectedTimezones.length >= 2) {
      const meetingSlots = findMeetingTimes(selectedTimezones, new Date(), 48);
      setSlots(meetingSlots);
    } else if (selectedTimezones.length < 2) {
      setShowFinder(false);
      setSlots([]);
    }
  }, [selectedTimezones, showFinder]);

  if (selectedTimezones.length < 2) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700">
        <div className="text-center">
          <Users className="mx-auto mb-3 text-blue-500" size={32} />
          <h3 className="font-semibold text-lg mb-2">Meeting Planner</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add at least 2 time zones to find the best meeting times that work for everyone.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>✓ Finds times when everyone is awake (9am-5pm)</p>
            <p>✓ Checks the next 48 hours</p>
            <p>✓ Shows you what time it will be in each location</p>
          </div>
        </div>
      </div>
    );
  }

  const formatStr = timeFormat === "12h" ? "h:mm a" : "HH:mm";

  // Filter slots based on user preference
  const filteredSlots = showAllTimes
    ? slots
    : slots.filter((slot) => slot.quality === "good");

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
      {!showFinder && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold">Meeting Planner</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find times when all {selectedTimezones.length} locations are in business hours (9am-5pm)
              </p>
            </div>
          </div>

          <button
            onClick={handleFindTimes}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Calendar size={20} />
            Find Best Meeting Times
          </button>
        </>
      )}

      {showFinder && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold">Best Meeting Times</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next 48 hours • {selectedTimezones.length} time zones
              </p>
            </div>
            <button
              onClick={() => setShowFinder(false)}
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Timezone Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Comparing {selectedTimezones.length} time zones • Click X to remove
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTimezones.map((tz) => {
                const tzInfo = DEFAULT_TIMEZONES.find((t) => t.id === tz);
                return (
                  <div
                    key={tz}
                    className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                  >
                    <span>{tzInfo?.name || tz}</span>
                    {onRemoveTimezone && (
                      <button
                        onClick={() => onRemoveTimezone(tz)}
                        className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={`Remove ${tzInfo?.name || tz}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</span>
            <button
              onClick={() => setShowAllTimes(false)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                !showAllTimes
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <CheckCircle className="inline mr-1" size={14} />
              Perfect times only
            </button>
            <button
              onClick={() => setShowAllTimes(true)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                showAllTimes
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              All times
            </button>
          </div>

          {/* Meeting time slots */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredSlots.slice(0, 20).map((slot, index) => {
              const now = new Date();
              const isNow = slot.time.getHours() === now.getHours() &&
                           slot.time.getDate() === now.getDate();

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    slot.quality === "good"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                      : slot.quality === "fair"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800"
                  } ${isNow ? "ring-2 ring-blue-400" : ""}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className={
                        slot.quality === "good" ? "text-green-600 dark:text-green-400" :
                        slot.quality === "fair" ? "text-yellow-600 dark:text-yellow-400" :
                        "text-red-600 dark:text-red-400"
                      } />
                      <span className="font-semibold text-base">
                        {format(slot.time, "EEE, MMM d 'at' h:mm a")}
                      </span>
                      {isNow && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                          Current hour
                        </span>
                      )}
                    </div>

                    {/* Quality indicator */}
                    <div className="flex items-center gap-1.5">
                      {slot.quality === "good" ? (
                        <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      ) : slot.quality === "fair" ? (
                        <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <XCircle size={16} className="text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          slot.quality === "good"
                            ? "text-green-700 dark:text-green-300"
                            : slot.quality === "fair"
                            ? "text-yellow-700 dark:text-yellow-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {slot.awakeCount}/{selectedTimezones.length} in business hours
                      </span>
                    </div>
                  </div>

                  {/* Time in each zone */}
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {selectedTimezones.map((tz) => {
                      const localTime = slot.localTimes.get(tz);
                      if (!localTime) return null;

                      const tzInfo = DEFAULT_TIMEZONES.find((t) => t.id === tz);
                      const timeStr = formatTimeInZone(slot.time, tz, formatStr);
                      const inBusinessHours = isBusinessHours(slot.time, tz);

                      return (
                        <div
                          key={tz}
                          className={`flex items-center justify-between px-3 py-2 rounded-md ${
                            inBusinessHours
                              ? "bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800"
                              : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {inBusinessHours ? (
                              <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0" />
                            ) : (
                              <XCircle size={14} className="text-gray-400 shrink-0" />
                            )}
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {tzInfo?.abbreviation || tz}
                            </span>
                          </div>
                          <span className={`font-mono font-semibold text-sm ml-2 ${
                            inBusinessHours
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {timeStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredSlots.length === 0 && (
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
              <AlertCircle className="mx-auto mb-3 text-yellow-600 dark:text-yellow-400" size={32} />
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                No {showAllTimes ? "" : "perfect "}meeting times found
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {!showAllTimes ? (
                  <>Try clicking "All times" to see options where some people might be outside business hours.</>
                ) : (
                  <>The selected time zones have very different working hours. Consider asynchronous communication.</>
                )}
              </p>
            </div>
          )}

          {/* Results count */}
          {filteredSlots.length > 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              Showing {Math.min(filteredSlots.length, 20)} of {filteredSlots.length} available time slots
              {filteredSlots.length > 20 && " (top 20 displayed)"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
