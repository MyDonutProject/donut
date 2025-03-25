import { AreaData, WhitespaceData } from 'lightweight-charts';

export interface AreaChartProps {
  isLoading: boolean;
  data?: (AreaData | WhitespaceData)[];
  currency?: boolean;
}
