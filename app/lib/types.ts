export interface ClockConfig {
  id: string; // IANA timezone ID
  label?: string; // Custom label
  color?: string; // Color coding
  pinned: boolean; // Pin to top
  hidden: boolean; // Hide from view
  order: number; // User-defined order
  showAnalog: boolean; // Show analog clock
  showDigital: boolean; // Show digital time
}

export interface UserSettings {
  theme: "light" | "dark" | "auto";
  timeFormat: "12h" | "24h";
  showSeconds: boolean;
  autoResize: boolean;
  gridColumns: number | "auto";
  clockSize: "tiny" | "small" | "medium" | "large";
  sortBy: "time" | "name" | "offset" | "custom";
  clocks: ClockConfig[];
  favoriteZones: string[]; // Quick access favorites
  groups: ClockGroup[]; // Named collections
}

export interface ClockGroup {
  id: string;
  name: string; // e.g., "My Team", "Client Zones"
  timezones: string[];
  color?: string;
}

export interface MeetingTimeSlot {
  time: Date;
  localTimes: Map<string, Date>; // timezone -> local time
  quality: "good" | "fair" | "poor"; // Based on business hours overlap
  awakeCount: number; // How many zones are in business hours
}

export interface DSTInfo {
  isDST: boolean;
  nextChange?: {
    date: Date;
    type: "spring" | "fall";
    offsetBefore: number;
    offsetAfter: number;
  };
}
