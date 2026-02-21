import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../services/rankingService';
import styles from '../styles/Timer.module.css';

type TimerProps = {
  isRunning: boolean;
  onTimeUpdate: (seconds: number) => void;
  reset: number;
};

export function Timer({ isRunning, onTimeUpdate, reset }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(0);
    onTimeUpdate(0);
  }, [reset, onTimeUpdate]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          onTimeUpdate(next);
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  return (
    <div className={styles.container}>
      <span className={styles.icon}>⏱️</span>
      <span className={styles.time}>{formatTime(seconds)}</span>
    </div>
  );
}
