import { Either } from './either';

export type Nullable<T> = Either<T, null>;
