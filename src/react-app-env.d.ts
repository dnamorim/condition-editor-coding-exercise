/// <reference types="react-scripts" />
import { Operator, Product, Property } from './data/datastore.types';

declare global {
  interface Window {
    datastore: {
      getOperators: () => Operator[];
      getProducts: () => Product[];
      getProperties: () => Property[];
    };
  }
}
