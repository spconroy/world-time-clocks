import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import styles from '../styles/Home.module.css';

const Clock = ({ zone, highlight }) => {
  const [time, setTime] = useState(moment.tz(zone.id));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment.tz(zone.id));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [zone.id]);

  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  const secondDegrees = ((seconds / 60) * 360) + 90;
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
  const hourDegrees = ((hours % 12) / 12 * 360) + ((minutes / 60) * 30) + 90;

  return (
    <div className={`${styles.clockContainer} ${highlight ? styles.highlight : ''}`}>
      <div className={styles.clock}>
        <div className={styles.hand} style={{ transform: `rotate(${hourDegrees}deg)` }} />
        <div className={styles.hand} style={{ transform: `rotate(${minuteDegrees}deg)` }} />
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
