import { DropdownItemProps } from 'semantic-ui-react';
import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';

const validOperators = {
  [PROPERTY_TYPES.STRING]: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
    OPERATOR_TYPES.CONTAINS,
  ],
  [PROPERTY_TYPES.NUMBER]: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.GREATER_THAN,
    OPERATOR_TYPES.LESS_THAN,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
  ],
  [PROPERTY_TYPES.ENUM]: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
  ],
};

const getOperationsOptions = (property_id: string): DropdownItemProps[] => {
  let operationOptions: DropdownItemProps[] = [];

  if (property_id !== '') {
    const property = window.datastore
      .getProperties()
      .find((property) => property.id === Number(property_id));

    if (property) {
      window.datastore.getOperators().forEach(({ id, text }) => {
        if (validOperators[property.type].includes(id)) {
          operationOptions.push({
            key: id,
            value: id,
            text,
          });
        }
      });
    }
  }

  return operationOptions;
};

export default getOperationsOptions;
