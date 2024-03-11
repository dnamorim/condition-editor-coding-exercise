import { fireEvent, render, screen, within } from '@testing-library/react';
import getFilteredProductsBy from 'data/selectors/getFilteredProductsBy';
import getPropertyOptions from 'data/selectors/getPropertyOptions';
import getOperationOptions from 'data/selectors/getOperationsOptions';
import getPropertyById from 'data/selectors/getPropertyById';
import { PROPERTY_TYPES } from 'utils/constants';

import App from '../App';

jest.mock('data/selectors/getFilteredProductsBy');
jest.mock('data/selectors/getOperationsOptions');
jest.mock('data/selectors/getPropertyOptions');
jest.mock('data/selectors/getPropertyById');
// @ts-expect-error error
jest.mock('utils/useDebounce.ts', () => (value) => value);

const mockPropertyOptions = [
  {
    key: 0,
    text: 'Name',
    value: '0',
  },
  {
    key: 1,
    text: 'Weight',
    value: '1',
  },
];

const mockOperationOptions = [
  {
    key: 'equals',
    text: 'Equals',
    value: 'equals',
  },
  {
    key: 'contains',
    text: 'Contains',
    value: 'contains',
  },
];

const mockProductList = [
  { id: 111, properties: { 0: 'Keyboard', 1: 5 } },
  { id: 222, properties: { 0: 'Cup', 1: 3 } },
];

const mockProperty = {
  id: mockPropertyOptions[0].key,
  name: mockOperationOptions[0].text,
  type: PROPERTY_TYPES.STRING,
};

describe('App', () => {
  beforeEach(jest.clearAllMocks);

  it('should render correcty when no products are available', () => {
    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue([]);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue([]);

    const { container } = render(<App />);

    const productRows = screen.getAllByRole('rowgroup')[1].childNodes;

    expect(productRows).toHaveLength(0);
    expect(screen.getByTestId('propertyFilter')).toBeInTheDocument();
    expect(screen.getByTestId('operatorFilter')).toBeInTheDocument();
    expect(screen.getByTestId('clearButton')).toBeInTheDocument();
    expect(screen.queryByTestId('valueFilter')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render a list of products correctly', () => {
    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue(mockProductList);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue([]);

    const { container } = render(<App />);

    const productRows = screen.getAllByRole('rowgroup')[1].childNodes;

    expect(productRows).toHaveLength(mockProductList.length);
    expect(
      screen.getByText(mockProductList[0].properties[0]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProductList[1].properties[0]),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should allow operator selection when the property is set', () => {
    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue([]);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue(mockOperationOptions);
    // @ts-expect-error error
    getPropertyById.mockReturnValueOnce().mockReturnValueOnce(mockProperty);

    render(<App />);

    expect(screen.getByTestId('operatorFilter')).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    const propertyElement = screen.getByTestId('propertyFilter');
    fireEvent.click(screen.getByTestId('propertyFilter'));
    const propertyOptions = within(propertyElement).getAllByRole('option');
    fireEvent.click(propertyOptions[0]);

    expect(screen.getByTestId('operatorFilter')).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('should display the value filter when the property and operator are set', () => {
    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue([]);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue(mockOperationOptions);
    // @ts-expect-error error
    getPropertyById.mockReturnValue(mockProperty);

    const { container } = render(<App />);

    expect(screen.queryByTestId('valueFilter')).not.toBeInTheDocument();

    const propertyElement = screen.getByTestId('propertyFilter');
    fireEvent.click(screen.getByTestId('propertyFilter'));
    const propertyOptions = within(propertyElement).getAllByRole('option');
    fireEvent.click(propertyOptions[0]);

    const operatorElement = screen.getByTestId('operatorFilter');
    fireEvent.click(operatorElement);
    const operationOptions = within(operatorElement).getAllByRole('option');
    fireEvent.click(operationOptions[0]);

    expect(screen.getByTestId('valueFilter')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should fetch products when all the filters are selected', () => {
    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue([]);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue(mockOperationOptions);
    // @ts-expect-error error
    getPropertyById.mockReturnValue(mockProperty);

    render(<App />);

    const propertyElement = screen.getByTestId('propertyFilter');
    fireEvent.click(screen.getByTestId('propertyFilter'));
    const propertyOptions = within(propertyElement).getAllByRole('option');
    fireEvent.click(propertyOptions[0]);

    const operatorElement = screen.getByTestId('operatorFilter');
    fireEvent.click(operatorElement);
    const operationOptions = within(operatorElement).getAllByRole('option');
    fireEvent.click(operationOptions[0]);

    const mockValueFilter = 'foo';
    const valueElement = within(screen.getByTestId('valueFilter')).getByRole(
      'textbox',
    );
    fireEvent.change(valueElement, { target: { value: mockValueFilter } });

    expect(getFilteredProductsBy).toHaveBeenLastCalledWith(
      mockProperty,
      mockOperationOptions[0].value,
      mockValueFilter,
    );
  });

  it('should reset all filters and show all products', () => {
    const filteredList = [mockProductList[1]];
    let productRows;

    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValue(filteredList);
    // @ts-expect-error error
    getPropertyOptions.mockReturnValue(mockPropertyOptions);
    // @ts-expect-error error
    getOperationOptions.mockReturnValue(mockOperationOptions);
    // @ts-expect-error error
    getPropertyById.mockReturnValue(mockProperty);

    render(<App />);

    const propertyElement = screen.getByTestId('propertyFilter');
    fireEvent.click(screen.getByTestId('propertyFilter'));
    const propertyOptions = within(propertyElement).getAllByRole('option');
    fireEvent.click(propertyOptions[0]);

    const operatorElement = screen.getByTestId('operatorFilter');
    fireEvent.click(operatorElement);
    const operationOptions = within(operatorElement).getAllByRole('option');
    fireEvent.click(operationOptions[0]);

    const mockValueFilter = 'foo';
    const valueElement = within(screen.getByTestId('valueFilter')).getByRole(
      'textbox',
    );
    fireEvent.change(valueElement, { target: { value: mockValueFilter } });

    productRows = screen.getAllByRole('rowgroup')[1].childNodes;

    expect(productRows).toHaveLength(filteredList.length);

    // @ts-expect-error error
    getFilteredProductsBy.mockReturnValueOnce(mockProductList);

    const clearButton = screen.getByTestId('clearButton');
    fireEvent.click(clearButton);

    productRows = screen.getAllByRole('rowgroup')[1].childNodes;

    expect(productRows).toHaveLength(mockProductList.length);
    expect(
      within(screen.getByTestId('propertyFilter')).getByText('Property'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('operatorFilter')).getByText('Operator'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('valueFilter')).not.toBeInTheDocument();
  });
});
