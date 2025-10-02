"use client";

import { Globe, MapPin } from "lucide-react";
import { DEFAULT_TIMEZONES } from "../lib/timezones";

interface RegionFiltersProps {
  onLoadRegion: (region: string) => void;
  currentRegion: string;
}

// Calculate counts dynamically
const ALL_COUNT = DEFAULT_TIMEZONES.length;
const NA_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "North America").length;
const EU_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Europe").length;
const ASIA_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Asia").length;
const OCEANIA_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Oceania").length;
const SA_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "South America").length;
const AFRICA_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Africa").length;
const ME_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Middle East").length;
const UNIVERSAL_COUNT = DEFAULT_TIMEZONES.filter(tz => tz.region === "Universal").length;

const REGIONS = [
  { id: "all", name: "All Timezones", icon: Globe, count: ALL_COUNT },
  { id: "default", name: "Default (Your Region)", icon: MapPin, count: "?" },
  { id: "North America", name: "North America", icon: MapPin, count: NA_COUNT },
  { id: "Europe", name: "Europe", icon: MapPin, count: EU_COUNT },
  { id: "Asia", name: "Asia", icon: MapPin, count: ASIA_COUNT },
  { id: "Oceania", name: "Oceania", icon: MapPin, count: OCEANIA_COUNT },
  { id: "South America", name: "South America", icon: MapPin, count: SA_COUNT },
  { id: "Africa", name: "Africa", icon: MapPin, count: AFRICA_COUNT },
  { id: "Middle East", name: "Middle East", icon: MapPin, count: ME_COUNT },
];

export default function RegionFilters({
  onLoadRegion,
  currentRegion,
}: RegionFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quick Load Regions
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click any region to load all clocks from that area
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REGIONS.map((region) => {
          const Icon = region.icon;
          const isActive = currentRegion === region.id;

          return (
            <button
              key={region.id}
              onClick={() => onLoadRegion(region.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-300"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
              }`}
            >
              <Icon size={16} />
              {region.name}
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}>
                {region.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
