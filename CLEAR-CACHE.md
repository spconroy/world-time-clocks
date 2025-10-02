# How to Clear Cached Data

## The Problem
If you're seeing fewer clocks than expected (e.g., 18 instead of 40), it's because your browser has **old data cached in localStorage**.

## Quick Fix (No Coding Required)

### Method 1: Use the "All Timezones" Button
1. Open the app
2. Click **"All Timezones (40)"** button
3. This will **replace** all cached clocks with fresh data from the database
4. You should now see all 40 clocks!

### Method 2: Clear Browser Cache
1. Open the app
2. Press **F12** (or right-click → Inspect)
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** in left sidebar
5. Click on your site's URL
6. Click **Clear All** or delete `world-clocks-settings`
7. **Refresh the page** (F5)
8. The app will load fresh defaults based on your region

### Method 3: Incognito/Private Window
1. Open a **new incognito/private window**
2. Load the app
3. No cached data = fresh start!

## Why This Happens

The app saves your clock selection to **localStorage** so your preferences persist between visits. When the database structure changes (like when we added more timezones), old cached data can conflict with new code.

## Developer Fix

If you're running this locally and want to force-clear for all users, add this to `app/page.tsx`:

```typescript
// Add this in the useEffect where you initialize
useEffect(() => {
  if (isClient) {
    // Check version - if old, clear and reload
    const version = localStorage.getItem('world-clocks-version');
    if (version !== '2.0') {
      localStorage.removeItem('world-clocks-settings');
      localStorage.setItem('world-clocks-version', '2.0');
      window.location.reload();
    }
  }
}, [isClient]);
```

## Current Database
- **Total timezones:** 40
- North America: 9
- Asia: 10
- Europe: 5
- Oceania: 5
- South America: 4
- Africa: 4
- Middle East: 2
- Universal: 1 (UTC)

## Test It
After clearing:
1. Click **"All Timezones (40)"** - should show 40 clocks
2. Click **"North America (9)"** - should show 9 clocks
3. Click **"Asia (10)"** - should show 10 clocks
4. Click **"Default"** - shows all clocks from YOUR region

✅ **All working correctly!**
