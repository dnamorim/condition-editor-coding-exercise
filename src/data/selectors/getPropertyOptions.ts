import { DropdownItemProps } from 'semantic-ui-react';
import capitalize from 'utils/capitalize';

const getPropertyOptions = (): DropdownItemProps[] =>
  window.datastore.getProperties().map((property) => ({
    key: property.id,
    text: capitalize(property.name),
    value: String(property.id),
  }));

export default getPropertyOptions;
