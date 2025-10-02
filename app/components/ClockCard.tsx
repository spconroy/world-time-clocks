"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, Star, Trash2, Copy, Check } from "lucide-react";
import {
  formatTimeInZone,
  formatUTCOffset,
  getDSTInfo,
  isBusinessHours,
  getDayDifference,
} from "../lib/time-utils";
import { ClockConfig } from "../lib/types";
import { DEFAULT_TIMEZONES } from "../lib/timezones";
import { toast } from "sonner";

interface ClockCardProps {
  config: ClockConfig;
  size: "tiny" | "small" | "medium" | "large";
  timeFormat: "12h" | "24h";
  showSeconds: boolean;
  userTimezone: string;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  isFavorite: boolean;
}

export default function ClockCard({
  config,
  size,
  timeFormat,
  showSeconds,
  userTimezone,
  onToggleFavorite,
  onRemove,
  isFavorite,
}: ClockCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tzInfo = DEFAULT_TIMEZONES.find((tz) => tz.id === config.id);
  const displayName = config.label || tzInfo?.name || config.id;

  // Time formatting
  const formatStr = timeFormat === "12h"
    ? showSeconds
      ? "h:mm:ss a"
      : "h:mm a"
    : showSeconds
    ? "HH:mm:ss"
    : "HH:mm";

  const timeStr = formatTimeInZone(currentTime, config.id, formatStr);
  const dateStr = formatTimeInZone(currentTime, config.id, "MMM d, yyyy");
  const offsetStr = formatUTCOffset(config.id, currentTime);

  // DST and business hours
  const dstInfo = getDSTInfo(config.id);
  const inBusinessHours = isBusinessHours(currentTime, config.id);
  const dayDiff = getDayDifference(userTimezone, config.id, currentTime);

  // Sizing classes
  const sizeClasses = {
    tiny: "text-sm",
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  };

  const containerClasses = {
    tiny: "p-2",
    small: "p-3",
    medium: "p-4",
    large: "p-5",
  };

  const handleCopy = () => {
    const textToCopy = `${displayName}: ${timeStr} ${offsetStr}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Time copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all ${containerClasses[size]} ${
        isFavorite ? "ring-2 ring-yellow-400" : ""
      } ${inBusinessHours ? "border-l-4 border-l-green-500" : ""}`}
      style={{ borderLeftColor: config.color }}
    >
      {/* Header with actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold truncate ${
              size === "tiny" ? "text-xs" : size === "small" ? "text-sm" : "text-base"
            }`}
            title={displayName}
          >
            {displayName}
          </h3>
          {size !== "tiny" && tzInfo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {tzInfo.country || tzInfo.region}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(config.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              size={size === "tiny" ? 12 : 14}
              className={isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
            />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Copy time"
          >
            {copied ? (
              <Check size={size === "tiny" ? 12 : 14} className="text-green-500" />
            ) : (
              <Copy size={size === "tiny" ? 12 : 14} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => onRemove(config.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            title="Remove clock"
          >
            <Trash2 size={size === "tiny" ? 12 : 14} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Time display */}
      <div className="text-center space-y-1">
        <div className={`font-mono font-bold ${sizeClasses[size]} tabular-nums`}>
          {timeStr}
        </div>

        {size !== "tiny" && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {dateStr}
            {dayDiff !== 0 && (
              <span className="ml-1 text-orange-500 font-semibold">
                ({dayDiff > 0 ? "+1 day" : "-1 day"})
              </span>
            )}
          </div>
        )}

        {/* Offset and DST */}
        {size !== "tiny" && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">{offsetStr}</span>
            {dstInfo.isDST && (
              <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium">
                DST
              </span>
            )}
            {inBusinessHours && (
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px] font-medium">
                Business Hours
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
