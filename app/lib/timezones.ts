export interface TimeZoneData {
  id: string; // IANA timezone identifier
  name: string; // Display name
  abbreviation: string; // Short abbreviation
  country?: string; // Country name
  region?: string; // Geographic region
}

export const DEFAULT_TIMEZONES: TimeZoneData[] = [
  // US Time Zones
  { id: "America/Los_Angeles", name: "Pacific Time", abbreviation: "PST/PDT", country: "USA", region: "North America" },
  { id: "America/Denver", name: "Mountain Time", abbreviation: "MST/MDT", country: "USA", region: "North America" },
  { id: "America/Chicago", name: "Central Time", abbreviation: "CST/CDT", country: "USA", region: "North America" },
  { id: "America/New_York", name: "Eastern Time", abbreviation: "EST/EDT", country: "USA", region: "North America" },

  // Universal
  { id: "UTC", name: "Coordinated Universal Time", abbreviation: "UTC", region: "Universal" },

  // European Time Zones
  { id: "Europe/London", name: "Greenwich Mean Time", abbreviation: "GMT/BST", country: "UK", region: "Europe" },
  { id: "Europe/Paris", name: "Central European Time", abbreviation: "CET/CEST", country: "France", region: "Europe" },
  { id: "Europe/Berlin", name: "Central European Time", abbreviation: "CET/CEST", country: "Germany", region: "Europe" },
  { id: "Europe/Moscow", name: "Moscow Standard Time", abbreviation: "MSK", country: "Russia", region: "Europe" },
  { id: "Europe/Athens", name: "Eastern European Time", abbreviation: "EET/EEST", country: "Greece", region: "Europe" },

  // Asia-Pacific
  { id: "Asia/Tokyo", name: "Japan Standard Time", abbreviation: "JST", country: "Japan", region: "Asia" },
  { id: "Asia/Shanghai", name: "China Standard Time", abbreviation: "CST", country: "China", region: "Asia" },
  { id: "Asia/Hong_Kong", name: "Hong Kong Time", abbreviation: "HKT", country: "Hong Kong", region: "Asia" },
  { id: "Asia/Singapore", name: "Singapore Time", abbreviation: "SGT", country: "Singapore", region: "Asia" },
  { id: "Asia/Seoul", name: "Korean Standard Time", abbreviation: "KST", country: "South Korea", region: "Asia" },
  { id: "Asia/Kolkata", name: "India Standard Time", abbreviation: "IST", country: "India", region: "Asia" },
  { id: "Asia/Dubai", name: "Gulf Standard Time", abbreviation: "GST", country: "UAE", region: "Middle East" },
  { id: "Asia/Jerusalem", name: "Israel Standard Time", abbreviation: "IST", country: "Israel", region: "Middle East" },
  { id: "Asia/Bangkok", name: "Indochina Time", abbreviation: "ICT", country: "Thailand", region: "Asia" },
  { id: "Asia/Kathmandu", name: "Nepal Time", abbreviation: "NPT", country: "Nepal", region: "Asia" },
  { id: "Asia/Dhaka", name: "Bangladesh Time", abbreviation: "BST", country: "Bangladesh", region: "Asia" },
  { id: "Asia/Jakarta", name: "Western Indonesia Time", abbreviation: "WIB", country: "Indonesia", region: "Asia" },

  // Oceania
  { id: "Australia/Sydney", name: "Australian Eastern Time", abbreviation: "AEST/AEDT", country: "Australia", region: "Oceania" },
  { id: "Australia/Melbourne", name: "Australian Eastern Time", abbreviation: "AEST/AEDT", country: "Australia", region: "Oceania" },
  { id: "Australia/Perth", name: "Australian Western Time", abbreviation: "AWST", country: "Australia", region: "Oceania" },
  { id: "Pacific/Auckland", name: "New Zealand Standard Time", abbreviation: "NZST/NZDT", country: "New Zealand", region: "Oceania" },
  { id: "Pacific/Fiji", name: "Fiji Time", abbreviation: "FJT", country: "Fiji", region: "Oceania" },

  // Americas (South/Central)
  { id: "America/Sao_Paulo", name: "Brasilia Time", abbreviation: "BRT", country: "Brazil", region: "South America" },
  { id: "America/Argentina/Buenos_Aires", name: "Argentina Time", abbreviation: "ART", country: "Argentina", region: "South America" },
  { id: "America/Mexico_City", name: "Central Standard Time", abbreviation: "CST/CDT", country: "Mexico", region: "North America" },
  { id: "America/Lima", name: "Peru Time", abbreviation: "PET", country: "Peru", region: "South America" },
  { id: "America/Caracas", name: "Venezuelan Time", abbreviation: "VET", country: "Venezuela", region: "South America" },

  // Other North America
  { id: "America/Halifax", name: "Atlantic Standard Time", abbreviation: "AST/ADT", country: "Canada", region: "North America" },
  { id: "America/Anchorage", name: "Alaska Standard Time", abbreviation: "AKST/AKDT", country: "USA", region: "North America" },
  { id: "Pacific/Honolulu", name: "Hawaii-Aleutian Time", abbreviation: "HST", country: "USA", region: "North America" },
  { id: "America/St_Johns", name: "Newfoundland Time", abbreviation: "NST/NDT", country: "Canada", region: "North America" },

  // Africa
  { id: "Africa/Johannesburg", name: "South Africa Standard Time", abbreviation: "SAST", country: "South Africa", region: "Africa" },
  { id: "Africa/Cairo", name: "Eastern European Time", abbreviation: "EET", country: "Egypt", region: "Africa" },
  { id: "Africa/Nairobi", name: "East Africa Time", abbreviation: "EAT", country: "Kenya", region: "Africa" },
  { id: "Africa/Lagos", name: "West Africa Time", abbreviation: "WAT", country: "Nigeria", region: "Africa" },
];

// Get the user's local timezone
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Get user's region based on their timezone
export function getUserRegion(): string {
  const userTz = getUserTimezone();

  if (userTz.startsWith("America/")) return "North America";
  if (userTz.startsWith("Europe/")) return "Europe";
  if (userTz.startsWith("Asia/")) return "Asia";
  if (userTz.startsWith("Australia/") || userTz.startsWith("Pacific/")) return "Oceania";
  if (userTz.startsWith("Africa/")) return "Africa";

  return "North America"; // Fallback
}

// Get default clocks - loads ALL clocks from user's region
export function getDefaultClocks(): string[] {
  const userRegion = getUserRegion();

  // Load all timezones from the user's detected region
  const regionalClocks = DEFAULT_TIMEZONES
    .filter((tz) => tz.region === userRegion)
    .map((tz) => tz.id);

  // Always ensure UTC is included
  if (!regionalClocks.includes("UTC")) {
    regionalClocks.unshift("UTC");
  }

  return regionalClocks;
}

// Search timezones by name or abbreviation
export function searchTimezones(query: string): TimeZoneData[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return DEFAULT_TIMEZONES;

  return DEFAULT_TIMEZONES.filter(
    (tz) =>
      tz.name.toLowerCase().includes(lowerQuery) ||
      tz.abbreviation.toLowerCase().includes(lowerQuery) ||
      tz.id.toLowerCase().includes(lowerQuery) ||
      tz.country?.toLowerCase().includes(lowerQuery) ||
      tz.region?.toLowerCase().includes(lowerQuery)
  );
}

// Filter timezones by region
export function filterByRegion(timezoneIds: string[], region: string): string[] {
  if (region === "all") {
    return timezoneIds;
  }

  if (region === "default") {
    // Show only the user's clocks that are in the default set
    const defaultSet = new Set(getDefaultClocks());
    return timezoneIds.filter((id) => defaultSet.has(id));
  }

  // Filter by region
  return timezoneIds.filter((id) => {
    const tzData = DEFAULT_TIMEZONES.find((tz) => tz.id === id);
    return tzData?.region === region;
  });
}

// Get timezone data by ID
export function getTimezoneData(id: string): TimeZoneData | undefined {
  return DEFAULT_TIMEZONES.find((tz) => tz.id === id);
}
