import { useEffect, useState } from 'react';
import Clock from '../components/Clock';
import ClockControls from '../components/ClockControls';
import moment from 'moment-timezone';
import styles from '../styles/Home.module.css';

const timeZones = [
  { name: "Pacific Time (US)", abbreviation: "PST", id: "America/Los_Angeles" },
  { name: "Mountain Time (US)", abbreviation: "MST", id: "America/Denver" },
  { name: "Central Time (US)", abbreviation: "CST", id: "America/Chicago" },
  { name: "Eastern Time (US)", abbreviation: "EST", id: "America/New_York" },
  { name: "UTC", abbreviation: "UTC", id: "UTC" },
  { name: "Greenwich Mean Time", abbreviation: "GMT", id: "Etc/GMT" }, // Constant GMT without DST
  { name: "Western European Time", abbreviation: "WET", id: "Europe/Lisbon" }, // Correct WET with DST consideration
  { name: "Central European Time", abbreviation: "CET", id: "Europe/Berlin" },
  { name: "Moscow Standard Time", abbreviation: "MSK", id: "Europe/Moscow" },
  { name: "Japan Standard Time", abbreviation: "JST", id: "Asia/Tokyo" },
  { name: "Australian Eastern Time", abbreviation: "AEST", id: "Australia/Sydney" },
  { name: "Hawaii Standard Time", abbreviation: "HST", id: "Pacific/Honolulu" },
  { name: "Alaska Standard Time", abbreviation: "AKST", id: "America/Anchorage" },
  { name: "Newfoundland Standard Time", abbreviation: "NST", id: "America/St_Johns" },
  { name: "Brasilia Time", abbreviation: "BRT", id: "America/Sao_Paulo" },
  { name: "Argentina Time", abbreviation: "ART", id: "America/Argentina/Buenos_Aires" },
  { name: "Israel Standard Time", abbreviation: "IST", id: "Asia/Jerusalem" },
  { name: "India Standard Time", abbreviation: "IST", id: "Asia/Kolkata" },
  { name: "China Standard Time", abbreviation: "CST", id: "Asia/Shanghai" },
  { name: "Singapore Time", abbreviation: "SGT", id: "Asia/Singapore" },
  { name: "Dubai Time", abbreviation: "GST", id: "Asia/Dubai" },
  { name: "Korean Standard Time", abbreviation: "KST", id: "Asia/Seoul" },
  { name: "Eastern European Time", abbreviation: "EET", id: "Europe/Athens" },
  { name: "South Africa Standard Time", abbreviation: "SAST", id: "Africa/Johannesburg" },
  { name: "New Zealand Standard Time", abbreviation: "NZST", id: "Pacific/Auckland" },
  { name: "Atlantic Standard Time", abbreviation: "AST", id: "America/Halifax" },
  { name: "Bangladesh Time", abbreviation: "BST", id: "Asia/Dhaka" },
  { name: "Eastern Africa Time", abbreviation: "EAT", id: "Africa/Nairobi" },
  { name: "Western Indonesia Time", abbreviation: "WIB", id: "Asia/Jakarta" },
  { name: "Hong Kong Time", abbreviation: "HKT", id: "Asia/Hong_Kong" },
  { name: "Fiji Time", abbreviation: "FJT", id: "Pacific/Fiji" },
  { name: "Kamchatka Time", abbreviation: "PETT", id: "Asia/Kamchatka" },
  { name: "Venezuelan Time", abbreviation: "VET", id: "America/Caracas" },
  { name: "Peru Time", abbreviation: "PET", id: "America/Lima" },
  { name: "Central Africa Time", abbreviation: "CAT", id: "Africa/Harare" },
  { name: "Magadan Time", abbreviation: "MAGT", id: "Asia/Magadan" },
  { name: "Nepal Time", abbreviation: "NPT", id: "Asia/Kathmandu" }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('time');
  const [filteredTimeZones, setFilteredTimeZones] = useState(timeZones);

  useEffect(() => {
    filterAndSort();
  }, [search, sort]);

  const filterAndSort = () => {
    let filtered = timeZones.filter(zone =>
      zone.name.toLowerCase().includes(search.toLowerCase()) ||
      zone.abbreviation.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === 'time') {
      filtered.sort((a, b) => {
        const nowA = moment.tz(a.id).format('HH:mm:ss');
        const nowB = moment.tz(b.id).format('HH:mm:ss');
        return nowA.localeCompare(nowB);
      });
    } else if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'offset') {
      filtered.sort((a, b) => moment.tz(a.id).utcOffset() - moment.tz(b.id).utcOffset());
    }

    setFilteredTimeZones(filtered);
  };

  return (
    <div className={styles.container}>
      <h1>World Time Zone Clocks</h1>
      <ClockControls
        searchValue={search}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />
      <div className={styles.clocksContainer}>
        {filteredTimeZones.map(zone => (
          <Clock key={zone.id} zone={zone} highlight={zone.id === "UTC" || zone.id === moment.tz.guess()} />
        ))}
      </div>
    </div>
  );
}
