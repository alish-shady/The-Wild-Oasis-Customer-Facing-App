export interface Cabin {
  readonly id: number;
  readonly name: string;
  readonly maxCapacity: number;
  readonly regularPrice: number;
  readonly discount: number;
  readonly description?: string;
  readonly image: string;
}
export type CabinId = Cabin["id"];
