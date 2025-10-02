"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Moon, Sun, Share2, Download } from "lucide-react";
import ClockCard from "./components/ClockCard";
import TimezoneSearch from "./components/TimezoneSearch";
import MeetingTimeFinder from "./components/MeetingTimeFinder";
import TimeConverter from "./components/TimeConverter";
import RegionFilters from "./components/RegionFilters";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAutoResize } from "./hooks/useAutoResize";
import { ClockConfig, UserSettings } from "./lib/types";
import { getDefaultClocks, getUserTimezone, DEFAULT_TIMEZONES } from "./lib/timezones";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // User settings with localStorage
  const [settings, setSettings, isClient] = useLocalStorage<UserSettings>("world-clocks-settings", {
    theme: "auto",
    timeFormat: "12h",
    showSeconds: true,
    autoResize: true,
    gridColumns: "auto",
    clockSize: "medium",
    sortBy: "custom",
    clocks: [],
    favoriteZones: [],
    groups: [],
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showMeetingFinder, setShowMeetingFinder] = useState(false);
  const [currentRegion, setCurrentRegion] = useState("default");

  // Auto-resize hook
  const { columns, clockSize } = useAutoResize(
    containerRef,
    settings.gridColumns === "auto"
  );

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize with default clocks on first visit
  useEffect(() => {
    if (isClient && settings.clocks.length === 0) {
      const defaultTimezones = getDefaultClocks();
      const defaultClocks: ClockConfig[] = defaultTimezones.map((tz, index) => ({
        id: tz,
        pinned: tz === "UTC",
        hidden: false,
        order: index,
        showAnalog: true,
        showDigital: true,
      }));

      setSettings((prev) => ({
        ...prev,
        clocks: defaultClocks,
      }));
    }
  }, [isClient]);

  // Iframe height communication
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage(
        {
          type: "resize",
          height: height,
        },
        "*"
      );
    };

    // Send initial height
    sendHeight();

    // Send height on every render (when clocks change)
    const observer = new ResizeObserver(() => {
      sendHeight();
    });

    observer.observe(document.body);

    // Also send on window resize
    window.addEventListener("resize", sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sendHeight);
    };
  }, [settings.clocks.length, showConverter]);

  const handleAddTimezone = (timezoneId: string) => {
    const newClock: ClockConfig = {
      id: timezoneId,
      pinned: false,
      hidden: false,
      order: settings.clocks.length,
      showAnalog: true,
      showDigital: true,
    };

    setSettings((prev) => ({
      ...prev,
      clocks: [...prev.clocks, newClock],
    }));
  };

  const handleRemoveTimezone = (timezoneId: string) => {
    setSettings((prev) => ({
      ...prev,
      clocks: prev.clocks.filter((c) => c.id !== timezoneId),
      favoriteZones: prev.favoriteZones.filter((f) => f !== timezoneId),
    }));
    toast.success("Clock removed");
  };

  const handleToggleFavorite = (timezoneId: string) => {
    setSettings((prev) => {
      const isFavorite = prev.favoriteZones.includes(timezoneId);
      return {
        ...prev,
        favoriteZones: isFavorite
          ? prev.favoriteZones.filter((f) => f !== timezoneId)
          : [...prev.favoriteZones, timezoneId],
      };
    });
  };

  const handleLoadRegion = (region: string) => {
    let timezoneIds: string[];

    if (region === "all") {
      // Load ALL timezones from the database (40 total)
      timezoneIds = DEFAULT_TIMEZONES.map((tz) => tz.id);
      console.log(`Loading ALL timezones: ${timezoneIds.length} from database of ${DEFAULT_TIMEZONES.length}`);
    } else if (region === "default") {
      // Load smart defaults based on user location
      timezoneIds = getDefaultClocks();
      console.log(`Loading default timezones: ${timezoneIds.length}`);
    } else {
      // Load all timezones from specific region
      timezoneIds = DEFAULT_TIMEZONES
        .filter((tz) => tz.region === region)
        .map((tz) => tz.id);
      console.log(`Loading ${region} timezones: ${timezoneIds.length}`);
    }

    // Replace ALL clocks with new selection
    const newClocks: ClockConfig[] = timezoneIds.map((id, index) => ({
      id,
      pinned: false,
      hidden: false,
      order: index,
      showAnalog: true,
      showDigital: true,
    }));

    setSettings((prev) => ({
      ...prev,
      clocks: newClocks,
      favoriteZones: [], // Clear favorites when loading new region
    }));

    setCurrentRegion(region);

    const regionName = region === "all" ? "All Timezones" : region === "default" ? "Default" : region;
    toast.success(`Loaded ${timezoneIds.length} ${regionName} clock${timezoneIds.length > 1 ? "s" : ""}!`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSettings((prev) => {
        const oldIndex = prev.clocks.findIndex((c) => c.id === active.id);
        const newIndex = prev.clocks.findIndex((c) => c.id === over.id);

        const reordered = arrayMove(prev.clocks, oldIndex, newIndex);
        return {
          ...prev,
          clocks: reordered.map((c, index) => ({ ...c, order: index })),
        };
      });
    }
  };

  const handleThemeToggle = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleShare = async () => {
    const timezoneIds = settings.clocks.map((c) => c.id).join(",");
    const url = `${window.location.origin}?tz=${encodeURIComponent(timezoneIds)}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleExport = () => {
    const exportData = {
      settings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `world-clocks-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported!");
  };

  // Apply theme on mount
  useEffect(() => {
    if (isClient) {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isClient, settings.theme]);

  // Sort clocks: favorites first, then by order
  const sortedClocks = [...settings.clocks].sort((a, b) => {
    const aFav = settings.favoriteZones.includes(a.id);
    const bFav = settings.favoriteZones.includes(b.id);

    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.order - b.order;
  });

  const visibleClocks = sortedClocks.filter((c) => !c.hidden);
  const userTimezone = isClient ? getUserTimezone() : "UTC";

  if (!isClient) {
    return null; // Prevent SSR mismatch
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">World Time Clocks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track time zones, plan meetings, convert times
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {settings.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Share configuration"
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={handleExport}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Export settings"
            >
              <Download size={20} />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Time Format</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      timeFormat: e.target.value as "12h" | "24h",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="12h">12-hour (3:45 PM)</option>
                  <option value="24h">24-hour (15:45)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showSeconds}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        showSeconds: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Show seconds</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex justify-center">
          <TimezoneSearch
            onAdd={handleAddTimezone}
            existingTimezones={settings.clocks.map((c) => c.id)}
          />
        </div>

        {/* Region Filters */}
        <RegionFilters
          onLoadRegion={handleLoadRegion}
          currentRegion={currentRegion}
        />

        {/* Quick action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowConverter(!showConverter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showConverter
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Time Converter
          </button>
        </div>

        {/* Time Converter */}
        {showConverter && (
          <TimeConverter
            availableTimezones={settings.clocks.map((c) => c.id)}
            timeFormat={settings.timeFormat}
          />
        )}

        {/* Clocks Grid */}
        <div ref={containerRef}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleClocks.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns:
                    settings.gridColumns === "auto"
                      ? `repeat(${columns}, minmax(0, 1fr))`
                      : `repeat(${settings.gridColumns}, minmax(0, 1fr))`,
                }}
              >
                {visibleClocks.map((clock) => (
                  <ClockCard
                    key={clock.id}
                    config={clock}
                    size={settings.gridColumns === "auto" ? clockSize : settings.clockSize}
                    timeFormat={settings.timeFormat}
                    showSeconds={settings.showSeconds}
                    userTimezone={userTimezone}
                    onToggleFavorite={handleToggleFavorite}
                    onRemove={handleRemoveTimezone}
                    isFavorite={settings.favoriteZones.includes(clock.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {visibleClocks.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No clocks added yet</p>
            <p className="text-sm">Search for a city or time zone above to get started</p>
          </div>
        )}
      </div>
    </main>
  );
}
