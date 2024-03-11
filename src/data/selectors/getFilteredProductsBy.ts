import { Property, PropertyValue } from 'data/datastore.types';
import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';
import { ConditionFilterType, ProductListItem } from './types';

const getPropertyValue = (
  propertyValues: PropertyValue[],
  selectedProperty: number,
) => propertyValues.find(({ property_id }) => property_id === selectedProperty);

const getConditionFilter = (
  selectedProperty: Property,
  selectedOperator: string,
) => {
  let conditionFilter: ConditionFilterType = () => true;

  switch (selectedOperator) {
    case OPERATOR_TYPES.GREATER_THAN:
      conditionFilter = (value, filter) => Number(value) > Number(filter);
      break;
    case OPERATOR_TYPES.LESS_THAN:
      conditionFilter = (value, filter) => Number(value) < Number(filter);
      break;
    case OPERATOR_TYPES.EQUALS:
      conditionFilter = (value, filter) =>
        selectedProperty.type === PROPERTY_TYPES.NUMBER
          ? Number(value) === Number(filter)
          : value === filter;
      break;
    case OPERATOR_TYPES.CONTAINS:
      conditionFilter = (value, filter) => value.includes(filter);
      break;
    case OPERATOR_TYPES.IN:
      conditionFilter = (value, filter) =>
        selectedProperty.type === PROPERTY_TYPES.ENUM
          ? filter?.includes(value) || false
          : filter?.split(/;|,/).includes(`${value}`) ?? false;
      break;
    case OPERATOR_TYPES.ANY:
      conditionFilter = (value, _) => !!value;
      break;
    case OPERATOR_TYPES.NONE:
      conditionFilter = (value, _) => value === null || value === undefined;
      break;
    default:
      conditionFilter = () => true;
      break;
  }

  return conditionFilter;
};

const getFilteredProductsBy = (
  selectedProperty: Property | undefined,
  selectedOperator: string,
  valueFilter?: string | string[] | undefined,
): ProductListItem[] => {
  const products = window.datastore.getProducts();
  let productList = products;

  if (selectedProperty !== undefined && selectedOperator !== '') {
    const formattedFilter =
      typeof valueFilter === PROPERTY_TYPES.STRING
        ? (valueFilter as string).toLowerCase()
        : valueFilter;

    const conditionFilter = getConditionFilter(
      selectedProperty,
      selectedOperator,
    );

    productList = productList.filter((product) => {
      let propertyValue = getPropertyValue(
        product.property_values,
        selectedProperty.id,
      )?.value;

      propertyValue =
        typeof propertyValue === PROPERTY_TYPES.STRING
          ? propertyValue?.toLowerCase()
          : propertyValue;

      return conditionFilter(propertyValue, formattedFilter);
    });
  }

  return productList.map((product) => {
    const properties = product.property_values.reduce(
      (dictionary, propertyValue) => {
        dictionary[propertyValue.property_id] = propertyValue.value;
        return dictionary;
      },
      {} as Record<number, string>,
    );

    return {
      id: product.id,
      properties,
    };
  });
};

export default getFilteredProductsBy;
