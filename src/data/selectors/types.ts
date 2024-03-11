export type ConditionFilterType = (value: any, filter: any) => boolean;

export type ProductListItem = {
  id: number;
  properties: Record<number, string>;
};
