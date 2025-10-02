import { format, toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { addHours, differenceInMinutes, parseISO } from "date-fns";
import { DSTInfo, MeetingTimeSlot } from "./types";

/**
 * Get current time in a specific timezone
 */
export function getTimeInZone(timezone: string, date: Date = new Date()): Date {
  return toZonedTime(date, timezone);
}

/**
 * Format time in a specific timezone
 */
export function formatTimeInZone(
  date: Date,
  timezone: string,
  formatStr: string = "HH:mm:ss"
): string {
  return formatInTimeZone(date, timezone, formatStr);
}

/**
 * Get UTC offset for a timezone in minutes
 */
export function getUTCOffset(timezone: string, date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });

  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  if (!offsetPart || offsetPart.value === "GMT") return 0;

  // Parse offset like "GMT+5:30" or "GMT-8"
  const match = offsetPart.value.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;

  return sign * (hours * 60 + minutes);
}

/**
 * Format UTC offset as string (e.g., "UTC+5:30", "UTC-8")
 */
export function formatUTCOffset(timezone: string, date: Date = new Date()): string {
  const offset = getUTCOffset(timezone, date);
  if (offset === 0) return "UTC";

  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Check if timezone is currently observing DST
 * This is a simplified check - comparing Jan and July offsets
 */
export function getDSTInfo(timezone: string): DSTInfo {
  const now = new Date();
  const january = new Date(now.getFullYear(), 0, 1);
  const july = new Date(now.getFullYear(), 6, 1);

  const janOffset = getUTCOffset(timezone, january);
  const julOffset = getUTCOffset(timezone, july);
  const currentOffset = getUTCOffset(timezone, now);

  // No DST if offsets are the same year-round
  if (janOffset === julOffset) {
    return { isDST: false };
  }

  // Northern hemisphere: DST in summer (July offset > Jan offset)
  // Southern hemisphere: DST in winter (Jan offset > July offset)
  const isDST = currentOffset !== Math.min(janOffset, julOffset);

  return { isDST };
}

/**
 * Check if time is within business hours (9 AM - 5 PM)
 */
export function isBusinessHours(date: Date, timezone: string): boolean {
  const zonedTime = toZonedTime(date, timezone);
  const hours = zonedTime.getHours();
  return hours >= 9 && hours < 17;
}

/**
 * Get time difference in human-readable format
 */
export function getTimeDifference(fromTz: string, toTz: string, date: Date = new Date()): string {
  const fromOffset = getUTCOffset(fromTz, date);
  const toOffset = getUTCOffset(toTz, date);
  const diffMinutes = toOffset - fromOffset;

  if (diffMinutes === 0) return "Same time";

  const hours = Math.floor(Math.abs(diffMinutes) / 60);
  const minutes = Math.abs(diffMinutes) % 60;

  const sign = diffMinutes > 0 ? "+" : "-";
  let result = `${sign}${hours}`;
  if (minutes > 0) {
    result += `:${minutes.toString().padStart(2, "0")}`;
  }
  result += diffMinutes > 0 ? " hours ahead" : " hours behind";

  return result;
}

/**
 * Check if the date is a different day
 */
export function getDayDifference(fromTz: string, toTz: string, date: Date = new Date()): number {
  const fromDate = toZonedTime(date, fromTz);
  const toDate = toZonedTime(date, toTz);

  const fromDay = fromDate.getDate();
  const toDay = toDate.getDate();

  if (fromDay === toDay) return 0;
  if (toDay > fromDay) return 1;
  return -1;
}

/**
 * Find optimal meeting times across multiple timezones
 */
export function findMeetingTimes(
  timezones: string[],
  startDate: Date = new Date(),
  durationHours: number = 24
): MeetingTimeSlot[] {
  const slots: MeetingTimeSlot[] = [];

  // Check every hour for the next N hours
  for (let i = 0; i < durationHours; i++) {
    const time = addHours(startDate, i);
    const localTimes = new Map<string, Date>();
    let awakeCount = 0;

    timezones.forEach((tz) => {
      const zonedTime = toZonedTime(time, tz);
      localTimes.set(tz, zonedTime);

      if (isBusinessHours(time, tz)) {
        awakeCount++;
      }
    });

    // Determine quality based on how many zones are in business hours
    const percentage = awakeCount / timezones.length;
    let quality: "good" | "fair" | "poor";
    if (percentage >= 0.8) quality = "good";
    else if (percentage >= 0.5) quality = "fair";
    else quality = "poor";

    slots.push({
      time,
      localTimes,
      quality,
      awakeCount,
    });
  }

  return slots;
}

/**
 * Convert a specific time from one timezone to another
 */
export function convertTime(
  time: Date,
  fromTimezone: string,
  toTimezone: string
): Date {
  // Create a zoned time in the source timezone
  const zonedTime = fromZonedTime(time, fromTimezone);
  // Convert to target timezone
  return toZonedTime(zonedTime, toTimezone);
}
