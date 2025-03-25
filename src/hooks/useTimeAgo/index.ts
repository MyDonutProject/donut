import { useCallback, useEffect, useState } from 'react';
import { UseTimeAgoProps } from './props';
import useTranslation from 'next-translate/useTranslation';
export default function useTimeAgo({ date }: UseTimeAgoProps) {
  const { t } = useTranslation('common');
  const calculateTimeAgo = useCallback(() => {
    if (!date) return '';

    const now = new Date().getTime();
    const diff = now - date.getTime();
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    switch (true) {
      case diff < minute:
        return t('time_ago_few_seconds');
      case diff < hour:
        const minutes = Math.round(diff / minute);

        if (minutes === 1) {
          return t('time_ago_a_minute');
        }

        return t('time_ago_minutes', {
          time: minutes,
        });
      case diff < day:
        const hours = Math.round(diff / hour);

        if (hours === 1) {
          return t('time_ago_an_hour');
        }

        return t('time_ago_hours', {
          time: hours,
        });
      case diff < month:
        const days = Math.round(diff / day);

        if (days === 1) {
          return t('time_ago_a_day');
        }

        return t('time_ago_days', {
          time: days,
        });
      case diff < year:
        const months = Math.round(diff / month);

        if (months === 1) {
          return t('time_ago_a_month');
        }

        return t('time_ago_months', {
          time: months,
        });
      case diff > year:
        const years = Math.round(diff / year);

        if (years === 1) {
          return t('time_ago_a_year');
        }

        return t('time_ago_years', {
          time: years,
        });
      default:
        return '';
    }
  }, [date, t]);

  const [timeAgo, setTimeAgo] = useState<string>(() => calculateTimeAgo());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [calculateTimeAgo]);

  return timeAgo;
}
