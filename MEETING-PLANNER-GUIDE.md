# Meeting Planner Guide

## What Is The Meeting Planner?

The Meeting Planner helps you find the best times to schedule meetings when your team members are in different time zones around the world.

## The Problem It Solves

**Example scenario:**
- You're in **Los Angeles** (PST)
- Your designer is in **London** (GMT)
- Your developer is in **Tokyo** (JST)
- You need to schedule a 1-hour video call

**The challenge:** When it's 9am in LA, it's 5pm in London and 2am in Tokyo 😴

The Meeting Planner automatically finds times when **everyone** is awake during reasonable working hours (9am-5pm).

## How To Use It

### Step 1: Add Time Zones
Add at least 2 time zones using the search bar:
- Search for cities like "Tokyo", "London", "New York"
- Click to add each location

### Step 2: Click "Meeting Planner"
Click the "Meeting Planner" button in the Quick Actions section

### Step 3: Click "Find Best Meeting Times"
This scans the **next 48 hours** and checks **every hour** to see when everyone is in business hours (9am-5pm)

### Step 4: Review Results

The planner shows you time slots with **color coding**:

#### 🟢 **Green = Perfect** (Everyone is in business hours)
```
Wed, Oct 2 at 8:00 am
✓ 3/3 in business hours

PST: 8:00 am  ✓ (Business hours)
GMT: 4:00 pm  ✓ (Business hours)
JST: 1:00 am  ✗ (Outside hours - sleeping!)
```

#### 🟡 **Yellow = Fair** (Most people are awake)
Some team members might be early morning or late evening

#### 🔴 **Red = Poor** (Many people sleeping)
Avoid these times unless absolutely necessary

## Understanding The Results

### Each Time Slot Shows:

1. **Date & Time** - "Wed, Oct 2 at 8:00 am"
2. **Quality Score** - "3/3 in business hours"
3. **Individual Times** - What time it will be in each location
4. **Visual Indicators**:
   - ✓ Green box = Person is in business hours (9am-5pm)
   - ✗ Gray box = Person is outside business hours

### Filter Options:

- **"Perfect times only"** (default) - Only shows times when ALL people are in business hours
- **"All times"** - Shows all options, including times when some people might be sleeping

## Example Use Cases

### Global Team Standup
**Team:** San Francisco, Berlin, Mumbai
**Best times:** Early morning SF / Mid-afternoon Berlin / Evening Mumbai

### Client Meeting
**Participants:** New York (you), Sydney (client)
**Challenge:** 14 hour time difference!
**Solution:** Late evening NY = Morning Sydney

### Training Session
**Attendees:** LA, Toronto, São Paulo
**Best window:** Mid-morning LA = Afternoon Toronto & São Paulo

## Tips for Better Results

### ✅ DO:
- Add all participant time zones
- Look for "perfect times" (all green)
- Book recurring meetings at the same slot to maintain consistency
- Consider rotating meeting times if no perfect slot exists

### ❌ DON'T:
- Force people to join at 3am their time
- Ignore the yellow/red warnings
- Forget about daylight saving time changes (the app handles this!)

## What If There Are No Perfect Times?

If the planner shows **"No perfect meeting times found"**, you have options:

1. **Click "All times"** to see fair/poor options
2. **Rotate meeting times** - Alternate between early/late to share the burden
3. **Reduce participants** - Can some people join async?
4. **Consider async collaboration** - Use Loom, Slack, email instead
5. **Split into regional meetings** - Americas meeting + EMEA meeting

## Real World Example

Let's say you have 5 clocks added:
- **San Francisco** (PST - UTC-8)
- **New York** (EST - UTC-5)
- **London** (GMT - UTC+0)
- **Dubai** (GST - UTC+4)
- **Singapore** (SGT - UTC+8)

**Click "Find Best Meeting Times"** and you might see:

```
✅ Wed, Oct 2 at 9:00 am (Perfect!)
5/5 in business hours

PST: 9:00 am  ✓
EST: 12:00 pm ✓
GMT: 5:00 pm  ✓
GST: 9:00 pm  ✗ (too late)
SGT: 1:00 am  ✗ (sleeping)
```

Hmm, only 3/5 are good. Let's try the next one:

```
✅ Thu, Oct 3 at 1:00 am (Perfect!)
5/5 in business hours

PST: 1:00 am  ✗ (sleeping)
EST: 4:00 am  ✗ (sleeping)
GMT: 9:00 am  ✓
GST: 1:00 pm  ✓
SGT: 5:00 pm  ✓
```

Still not ideal! This means your team spans **too many time zones** for a perfect meeting time.

**Solution:** Split into two meetings:
- **Americas + Europe:** 9am PST / 12pm EST / 5pm GMT
- **Europe + Asia:** 9am GMT / 1pm GST / 5pm SGT

## Advanced Features

### Current Hour Indicator
The current hour is highlighted with a blue ring so you can see options available right now

### Business Hours Definition
Business hours = 9am to 5pm in each time zone
(This is configurable in the code if you want different hours)

### 48-Hour Window
The planner checks every hour for the next 2 days, giving you ~48 potential time slots

### Automatic DST Handling
The app automatically accounts for daylight saving time differences between regions

## Common Questions

**Q: Why does it only show 20 results?**
A: To keep the list manageable. The best times are shown first.

**Q: Can I change business hours from 9-5?**
A: Yes, but you'll need to edit the code. It's in `app/lib/time-utils.ts`

**Q: Does it work for recurring meetings?**
A: Yes! Find a good time and schedule it weekly/daily. The app accounts for DST changes.

**Q: What if someone works different hours (e.g., 10am-6pm)?**
A: Currently it assumes 9-5 for everyone. You can mentally adjust +/- 1 hour.

---

## Summary

The Meeting Planner is like having a smart assistant that:
1. Checks when everyone is awake
2. Avoids asking people to join at 2am
3. Shows you exactly what time it will be in each location
4. Helps you find the fairest meeting time for your global team

**No more mental math or time zone confusion!** 🎉
