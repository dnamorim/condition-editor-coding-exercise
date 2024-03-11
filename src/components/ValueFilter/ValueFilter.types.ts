import { Property } from 'data/datastore.types';

export type PropTypes = {
  placeholder: string;
  operator?: string;
  property?: Property;
  value?: string;
  onChange: (e: any, opt: any) => void;
};
