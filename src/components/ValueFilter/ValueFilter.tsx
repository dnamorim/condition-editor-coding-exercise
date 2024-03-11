import { Dropdown, Input } from 'semantic-ui-react';
import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';
import { PropTypes } from './ValueFilter.types';

const ValueFilter = ({
  placeholder,
  operator,
  property,
  onChange,
  value,
  ...otherProps
}: PropTypes) => {
  if (
    !property ||
    !operator ||
    operator === '' ||
    operator === OPERATOR_TYPES.ANY ||
    operator === OPERATOR_TYPES.NONE
  ) {
    return <></>;
  }

  if (property.type === PROPERTY_TYPES.ENUM) {
    const options =
      property?.values?.map((value: string) => ({
        key: value,
        text: value,
        value,
      })) ?? [];

    return (
      <Dropdown
        fluid
        selection
        placeholder={placeholder}
        multiple={operator === OPERATOR_TYPES.IN}
        options={options}
        onChange={onChange}
        {...otherProps}
      />
    );
  }

  return (
    <Input
      fluid
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...otherProps}
    />
  );
};

export default ValueFilter;
