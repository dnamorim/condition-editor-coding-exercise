import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';
import getOperationsOptions from '../getOperationsOptions';

const mockGetOperators = jest.fn();
const mockGetProperties = jest.fn();

const mockOperators = [
  { id: OPERATOR_TYPES.EQUALS, text: 'Equals' },
  { id: OPERATOR_TYPES.ANY, text: 'Has any value' },
  { id: OPERATOR_TYPES.NONE, text: 'Has no value' },
  { id: OPERATOR_TYPES.IN, text: 'Is any of' },
  { id: OPERATOR_TYPES.CONTAINS, text: 'Contains' },
  { id: OPERATOR_TYPES.GREATER_THAN, text: 'Is greater than' },
  { id: OPERATOR_TYPES.LESS_THAN, text: 'Is less than' },
];

describe('getOperationsOptions', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'datastore', {
      value: {
        getProperties: mockGetProperties,
        getProducts: jest.fn(),
        getOperators: mockGetOperators,
      },
    });
  });

  beforeEach(jest.clearAllMocks);

  it('should return an emtpy array when no properties are available', () => {
    mockGetProperties.mockReturnValue([]);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(0);
  });

  it('should return an emtpy array when no operations are available', () => {
    mockGetProperties.mockReturnValue([
      { id: 0, name: 'product name', type: 'string' },
    ]);
    mockGetOperators.mockReturnValue([]);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(0);
  });

  it(`should valid options for a property of ${PROPERTY_TYPES.STRING} type`, () => {
    const stringValidOperators = [
      OPERATOR_TYPES.EQUALS,
      OPERATOR_TYPES.ANY,
      OPERATOR_TYPES.NONE,
      OPERATOR_TYPES.IN,
      OPERATOR_TYPES.CONTAINS,
    ];

    mockGetProperties.mockReturnValue([
      { id: 0, name: 'product name', type: PROPERTY_TYPES.STRING },
    ]);
    mockGetOperators.mockReturnValue(mockOperators);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(stringValidOperators.length);
    stringValidOperators.forEach((operatorId) =>
      expect(propertyOptions).toEqual(
        expect.arrayContaining([
          {
            key: operatorId,
            text: expect.any(String),
            value: operatorId,
          },
        ]),
      ),
    );
  });

  it(`should valid options for a property of ${PROPERTY_TYPES.ENUM} type`, () => {
    const enumValidOperators = [
      OPERATOR_TYPES.EQUALS,
      OPERATOR_TYPES.ANY,
      OPERATOR_TYPES.NONE,
      OPERATOR_TYPES.IN,
    ];

    mockGetProperties.mockReturnValue([
      {
        id: 0,
        name: 'category',
        type: PROPERTY_TYPES.ENUM,
        values: ['dress', 'tech'],
      },
    ]);
    mockGetOperators.mockReturnValue(mockOperators);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(enumValidOperators.length);
    enumValidOperators.forEach((operatorId) =>
      expect(propertyOptions).toEqual(
        expect.arrayContaining([
          {
            key: operatorId,
            text: expect.any(String),
            value: operatorId,
          },
        ]),
      ),
    );
  });

  it(`should valid options for a property of ${PROPERTY_TYPES.NUMBER} type`, () => {
    const numberValidOperators = [
      OPERATOR_TYPES.EQUALS,
      OPERATOR_TYPES.ANY,
      OPERATOR_TYPES.NONE,
      OPERATOR_TYPES.IN,
      OPERATOR_TYPES.GREATER_THAN,
      OPERATOR_TYPES.LESS_THAN,
    ];

    mockGetProperties.mockReturnValue([
      { id: 0, name: 'weight', type: PROPERTY_TYPES.NUMBER },
    ]);
    mockGetOperators.mockReturnValue(mockOperators);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(numberValidOperators.length);
    numberValidOperators.forEach((operatorId) =>
      expect(propertyOptions).toEqual(
        expect.arrayContaining([
          {
            key: operatorId,
            text: expect.any(String),
            value: operatorId,
          },
        ]),
      ),
    );
  });

  it('should valid options for a property of number type', () => {
    mockGetProperties.mockReturnValue([
      { id: 0, name: 'product name', type: 'string' },
    ]);
    mockGetOperators.mockReturnValue([]);

    const mockProductId = '0';
    const propertyOptions = getOperationsOptions(mockProductId);

    expect(propertyOptions).toHaveLength(0);
  });
});
