import { useMemo, useState } from 'react';
import { formatDateRange } from '../utils/calculations';

export const useMonthFilter = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const goToPrevious = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToCurrent = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const isCurrent = year === now.getFullYear() && month === now.getMonth();
  const label = useMemo(() => formatDateRange(year, month), [year, month]);

  return { year, month, label, goToPrevious, goToNext, goToCurrent, isCurrent };
};
