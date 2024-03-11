import { ProductListItem } from 'data/selectors/types';

export type PropTypes = {
  products: ProductListItem[];
  properties: { [key: string]: any }[];
};
