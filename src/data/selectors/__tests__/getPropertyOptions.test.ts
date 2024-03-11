import getPropertyOptions from '../getPropertyOptions';

const mockGetProperties = jest.fn();

describe('getPropertyOptions', () => {
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

  it('should return an emtpy array when no properties are available', () => {
    mockGetProperties.mockReturnValue([]);
    const propertyOptions = getPropertyOptions();

    expect(propertyOptions).toHaveLength(0);
  });

  it('should return valid options', () => {
    const properties = [
      {
        id: 0,
        name: 'Name',
      },
      {
        id: 1,
        name: 'Weight',
      },
    ];
    mockGetProperties.mockReturnValue(properties);
    const propertyOptions = getPropertyOptions();

    expect(propertyOptions).toHaveLength(properties.length);
    expect(propertyOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: expect.any(Number),
          text: expect.any(String),
          value: expect.any(String),
        }),
      ]),
    );
    expect(propertyOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: properties[0].id,
          text: properties[0].name,
          value: properties[0].id.toString(),
        }),
      ]),
    );
  });
});
