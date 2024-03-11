import { Dropdown, DropdownProps } from 'semantic-ui-react';

const FilterDropdown = (props: DropdownProps) => {
  return <Dropdown fluid selection {...props} />;
};

export default FilterDropdown;
