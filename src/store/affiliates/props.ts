export type AffiliatesFilterProps = {
  filter: string | null;
};

export enum AffiliatesFilterActions {
  SetFilter = 'affiliates-filter/set-filter',
}

export interface AffiliatesFilterBasePayload<
  T extends AffiliatesFilterActions,
  V = null,
> {
  type: T;
  payload: V;
}

export type AffiliatesFilterStatePayload = AffiliatesFilterBasePayload<
  AffiliatesFilterActions.SetFilter,
  AffiliatesFilterProps
>;
