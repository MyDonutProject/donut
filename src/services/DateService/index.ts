import { Either } from '@/interfaces/either';

export abstract class DateService {
  static formatUTC(date: Either<Date, string>) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(date));
  }
}
