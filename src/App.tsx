import { useMemo, useState } from 'react';
import { Button, DropdownItemProps } from 'semantic-ui-react';

import ProductList from 'components/ProductList';
import FilterDropdown from 'components/FilterDropdown';
import ValueFilter from 'components/ValueFilter';

import useDebounce from 'utils/useDebounce';

import getFilteredProductsBy from 'data/selectors/getFilteredProductsBy';
import getPropertyOptions from 'data/selectors/getPropertyOptions';
import getOperationOptions from 'data/selectors/getOperationsOptions';
import getPropertyById from 'data/selectors/getPropertyById';
import { ProductListItem } from 'data/selectors/types';

import 'data/datastore';
import './App.css';

function App() {
  const [selectedPropertyId, setPropertyId] = useState('');
  const [selectedOperatorId, setOperatorId] = useState('');
  const [valueFilter, setValueFilter] = useState('');
  const debouncedValueFilter = useDebounce(valueFilter, 400);

  const propertyOptions = getPropertyOptions();
  const selectedProperty = useMemo(
    () => getPropertyById(selectedPropertyId),
    [selectedPropertyId],
  );
  const operationOptions = useMemo<DropdownItemProps[]>(
    () => getOperationOptions(selectedPropertyId),
    [selectedPropertyId],
  );

  const products = useMemo<ProductListItem[]>(
    () =>
      getFilteredProductsBy(
        selectedProperty,
        selectedOperatorId,
        debouncedValueFilter,
      ),
    [debouncedValueFilter, selectedProperty, selectedOperatorId],
  );

  const handleOnChangeProperty = (_: any, { value }: any) => {
    setPropertyId(value);
    setValueFilter('');
  };

  const handleOnChangeOperator = (_: any, { value }: any) => {
    setOperatorId(value);
  };

  const handleOnChangeValueFilter = (_: any, { value }: any) => {
    setValueFilter(value);
  };

  const handleOnClick = () => {
    setPropertyId('');
    setOperatorId('');
    setValueFilter('');
  };

  return (
    <div className="container">
      <div className="filters">
        <div className="filters-item">
          <FilterDropdown
            data-testid="propertyFilter"
            placeholder="Property"
            options={propertyOptions}
            onChange={handleOnChangeProperty}
            value={selectedPropertyId}
          />
        </div>
        <div className="filters-item">
          <FilterDropdown
            data-testid="operatorFilter"
            placeholder="Operator"
            disabled={!selectedProperty}
            options={operationOptions}
            onChange={handleOnChangeOperator}
            value={selectedOperatorId}
          />
        </div>
        <div className="filters-item dynamic-width">
          <ValueFilter
            data-testid="valueFilter"
            placeholder="Value(s)"
            property={selectedProperty}
            operator={selectedOperatorId}
            onChange={handleOnChangeValueFilter}
            value={valueFilter}
          />
        </div>
        <div className="item dynamic-width">
          <Button
            data-testid="clearButton"
            className="clearButton"
            onClick={handleOnClick}
          >
            Clear
          </Button>
        </div>
      </div>

      <ProductList properties={propertyOptions} products={products} />
    </div>
  );
}

export default App;
