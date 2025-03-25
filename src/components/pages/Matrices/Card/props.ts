export interface MatrixCardProps {
  title: string;
  slots: {
    title: string;
    address?: string;
  }[];
  status: 'completed' | 'pending';
}
