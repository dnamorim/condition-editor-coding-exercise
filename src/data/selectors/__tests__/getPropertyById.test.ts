import getPropertyById from '../getPropertyById';

const mockGetProperties = jest.fn();
const mockProperties = [
  {
    id: 0,
    name: 'Name',
  },
  {
    id: 1,
    name: 'Weight',
  },
];

describe('getPropertyById', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'datastore', {
      value: {
        getProperties: mockGetProperties,
        getProducts: jest.fn(),
        mockGetOperators: jest.fn(),
      },
    });
  });

  beforeEach(jest.clearAllMocks);

  it('should not return when no properties are available', () => {
    mockGetProperties.mockReturnValue([]);
    const propertyOptions = getPropertyById('0');

    expect(propertyOptions).toBeUndefined();
  });

  it('should return correct property', () => {
    mockGetProperties.mockReturnValue(mockProperties);
    const expectedProperty = mockProperties[1];
    const propertyId = '1';
    const property = getPropertyById(propertyId);

    expect(property).toEqual(expectedProperty);
  });

  it("should not return when the property doesn't exist", () => {
    mockGetProperties.mockReturnValue(mockProperties);
    const propertyOptions = getPropertyById('5');

    expect(propertyOptions).toBeUndefined();
  });
});
