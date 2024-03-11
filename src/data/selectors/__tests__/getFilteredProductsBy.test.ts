import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';
import getFilteredProductsBy from '../getFilteredProductsBy';

const mockOperators = [
  { id: OPERATOR_TYPES.EQUALS, text: 'Equals' },
  { id: OPERATOR_TYPES.ANY, text: 'Has any value' },
  { id: OPERATOR_TYPES.NONE, text: 'Has no value' },
  { id: OPERATOR_TYPES.IN, text: 'Is any of' },
  { id: OPERATOR_TYPES.CONTAINS, text: 'Contains' },
  { id: OPERATOR_TYPES.GREATER_THAN, text: 'Is greater than' },
  { id: OPERATOR_TYPES.LESS_THAN, text: 'Is less than' },
];
const mockProperties = {
  [PROPERTY_TYPES.STRING]: { id: 0, name: 'Name', type: PROPERTY_TYPES.STRING },
  [PROPERTY_TYPES.NUMBER]: {
    id: 1,
    name: 'Weight',
    type: PROPERTY_TYPES.NUMBER,
  },
  [PROPERTY_TYPES.ENUM]: {
    id: 2,
    name: 'Category',
    type: PROPERTY_TYPES.ENUM,
    values: ['tech', 'home'],
  },
};
const mockProducts = [
  {
    id: 123,
    property_values: [
      { property_id: 0, value: 'keyboard' },
      { property_id: 1, value: 2 },
      { property_id: 2, value: 'tech' },
    ],
  },
  {
    id: 456,
    property_values: [
      { property_id: 0, value: 'key' },
      { property_id: 1, value: 10 },
      { property_id: 2, value: 'house' },
    ],
  },
  {
    id: 789,
    property_values: [
      { property_id: 0, value: 'fridge' },
      { property_id: 1, value: 30 },
    ],
  },
];

const mockGetProducts = jest.fn();
const mockGetProperties = jest.fn();
const mockGetOperators = jest.fn();

describe('getFilteredProductsBy', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'datastore', {
      value: {
        getProperties: mockGetProperties,
        getProducts: mockGetProducts,
        mockGetOperators: mockGetOperators,
      },
    });
  });

  beforeEach(() => {
    mockGetProperties.mockReturnValue(Object.values(mockProperties));
    mockGetProducts.mockReturnValue(mockProducts);
    mockGetOperators.mockReturnValue(mockOperators);
  });

  it('should return no products when products are available', () => {
    mockGetProducts.mockReturnValueOnce([]);

    const property = undefined;
    const operator = '';
    const filteredProducts = getFilteredProductsBy(property, operator);

    expect(filteredProducts).toHaveLength(0);
  });

  it('should return products with properties correctly mapped', () => {
    const property = undefined;
    const operator = '';
    const filteredProducts = getFilteredProductsBy(property, operator);

    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        {
          id: mockProducts[0].id,
          properties: {
            [mockProducts[0].property_values[0].property_id]:
              mockProducts[0].property_values[0].value,
            [mockProducts[0].property_values[1].property_id]:
              mockProducts[0].property_values[1].value,
            [mockProducts[0].property_values[2].property_id]:
              mockProducts[0].property_values[2].value,
          },
        },
      ]),
    );
  });

  it('should return all products when no filters are specified', () => {
    const property = undefined;
    const operator = '';
    const filteredProducts = getFilteredProductsBy(property, operator);

    expect(filteredProducts).toHaveLength(mockProducts.length);
  });

  it('should return all products when no condition is specified', () => {
    const property = mockProperties[PROPERTY_TYPES.STRING];
    const operator = '';
    const filteredProducts = getFilteredProductsBy(property, operator);

    expect(filteredProducts).toHaveLength(mockProducts.length);
  });

  it(`should return all products that match the ${OPERATOR_TYPES.GREATER_THAN} operator`, () => {
    const property = mockProperties[PROPERTY_TYPES.NUMBER];
    const operator = OPERATOR_TYPES.GREATER_THAN;
    const value = '10';
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[2]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);
    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockProducts[2].id,
        }),
      ]),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.LESS_THAN} operator`, () => {
    const property = mockProperties[PROPERTY_TYPES.NUMBER];
    const operator = OPERATOR_TYPES.LESS_THAN;
    const value = '10';
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[0]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);
    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockProducts[0].id,
        }),
      ]),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.EQUALS} operator for ${PROPERTY_TYPES.NUMBER} type`, () => {
    const property = mockProperties[PROPERTY_TYPES.NUMBER];
    const operator = OPERATOR_TYPES.EQUALS;
    const value = '10';
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[1]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);
    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockProducts[1].id,
        }),
      ]),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.EQUALS} operator for ${PROPERTY_TYPES.STRING} type`, () => {
    const property = mockProperties[PROPERTY_TYPES.STRING];
    const operator = OPERATOR_TYPES.EQUALS;
    const value = 'keyboard';
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[0]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);
    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockProducts[0].id,
        }),
      ]),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.CONTAINS} operator`, () => {
    const property = mockProperties[PROPERTY_TYPES.STRING];
    const operator = OPERATOR_TYPES.CONTAINS;
    const value = 'key';
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[0], mockProducts[1]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);

    expectedProducts.map(({ id }) =>
      expect(filteredProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id, properties: expect.anything() }),
        ]),
      ),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.IN} operator for ${PROPERTY_TYPES.ENUM} type`, () => {
    const property = mockProperties[PROPERTY_TYPES.ENUM];
    const operator = OPERATOR_TYPES.IN;
    const value = ['tech', 'house'];
    const filteredProducts = getFilteredProductsBy(property, operator, value);

    const expectedProducts = [mockProducts[0], mockProducts[1]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);

    expectedProducts.map(({ id }) =>
      expect(filteredProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id, properties: expect.anything() }),
        ]),
      ),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.IN} operator for ${PROPERTY_TYPES.STRING} type`, () => {
    const property = mockProperties[PROPERTY_TYPES.STRING];
    const operator = OPERATOR_TYPES.IN;
    const expectedProducts = [mockProducts[1], mockProducts[2]];

    const filteredProductsColon = getFilteredProductsBy(
      property,
      operator,
      'key;fridge',
    );

    expect(filteredProductsColon).toHaveLength(expectedProducts.length);
    expectedProducts.map(({ id }) =>
      expect(filteredProductsColon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id, properties: expect.anything() }),
        ]),
      ),
    );

    const filteredProductsSemiColon = getFilteredProductsBy(
      property,
      operator,
      'key,fridge',
    );

    expect(filteredProductsSemiColon).toHaveLength(expectedProducts.length);
    expectedProducts.map(({ id }) =>
      expect(filteredProductsSemiColon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id, properties: expect.anything() }),
        ]),
      ),
    );

    expect(filteredProductsColon).toEqual(filteredProductsSemiColon);
  });

  it(`should return all products that match the ${OPERATOR_TYPES.ANY} operator`, () => {
    const property = mockProperties[PROPERTY_TYPES.ENUM];
    const operator = OPERATOR_TYPES.ANY;
    const filteredProducts = getFilteredProductsBy(property, operator);

    const expectedProducts = [mockProducts[0], mockProducts[1]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);

    expectedProducts.map(({ id }) =>
      expect(filteredProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id, properties: expect.anything() }),
        ]),
      ),
    );
  });

  it(`should return all products that match the ${OPERATOR_TYPES.NONE} operator`, () => {
    const property = mockProperties[PROPERTY_TYPES.ENUM];
    const operator = OPERATOR_TYPES.NONE;
    const filteredProducts = getFilteredProductsBy(property, operator);

    const expectedProducts = [mockProducts[2]];

    expect(filteredProducts).toHaveLength(expectedProducts.length);
    expect(filteredProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockProducts[2].id,
          properties: expect.anything(),
        }),
      ]),
    );
  });

  it(`should return all products if an invalid operator is provided`, () => {
    const property = mockProperties[PROPERTY_TYPES.ENUM];
    const operator = 'foo';
    const filteredProducts = getFilteredProductsBy(property, operator);

    expect(filteredProducts).toHaveLength(mockProducts.length);
  });
});
