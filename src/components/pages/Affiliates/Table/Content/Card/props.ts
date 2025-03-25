import { options } from '../../Header/Select/options';

export interface AffiliatesCardProps {
  name: string;
  date: Date;
  rank: (typeof options)[number];
  address: string;
  position: number;
}
