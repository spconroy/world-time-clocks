import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import styles from '../styles/Home.module.css';

const Clock = ({ zone, highlight }) => {
  const [time, setTime] = useState(moment.tz(zone.id));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure we are in the client-side
    const intervalId = setInterval(() => {
      setTime(moment.tz(zone.id));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [zone.id]);

  if (!isClient) {
    return null; // Prevent mismatch during SSR
  }

  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  // Correct degree calculations for each hand
  const secondDegrees = (seconds / 60) * 360 - 90; // No 90-degree offset needed
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 - 90; // Moves based on seconds too
  const hourDegrees = ((hours % 12) / 12) * 360 + (minutes / 60) * 30 - 90; // Moves based on minutes too

  return (
    <div className={`${styles.clockContainer} ${highlight ? styles.highlight : ''}`}>
      <div className={styles.clock}>
        <div className={`${styles.hand} ${styles.hour}`} style={{ transform: `rotate(${hourDegrees}deg)` }} />
        <div className={`${styles.hand} ${styles.minute}`} style={{ transform: `rotate(${minuteDegrees}deg)` }} />
        <div className={`${styles.hand} ${styles.second}`} style={{ transform: `rotate(${secondDegrees}deg)` }} />
      </div>
      <div className={styles.digitalClock}>
        {time.format('hh:mm:ss A')}
      </div>
      <div>{zone.name} ({zone.abbreviation})</div>
    </div>
  );
};

export default Clock;
