export type PropertyValue = {
  property_id: number;
  value: string;
};

export type Property = {
  id: number;
  name: string;
  type: string;
  values?: string[];
};

export type Operator = {
  id: string;
  text: string;
};

export type Product = {
  id: number;
  property_values: PropertyValue[];
};
