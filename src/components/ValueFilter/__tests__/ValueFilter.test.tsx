import { render, screen } from '@testing-library/react';
import ValueFilter from '..';
import { OPERATOR_TYPES, PROPERTY_TYPES } from 'utils/constants';

describe('ValueFilter', () => {
  const mockProps = {
    placeholder: 'Value(s)',
    onChange: jest.fn(),
    property: {
      id: 1,
      name: 'Product Name',
      type: PROPERTY_TYPES.STRING,
    },
  };

  describe('should not render', () => {
    it('when no property and operation is provided', () => {
      const { property, ...props } = mockProps;
      const { container } = render(<ValueFilter {...props} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('when no operator is provided', () => {
      const { container } = render(<ValueFilter {...mockProps} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('when operator is an empty string', () => {
      const operator = '';

      const { container } = render(
        <ValueFilter operator={operator} {...mockProps} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it(`when operator is "${OPERATOR_TYPES.ANY}"`, () => {
      const { container } = render(
        <ValueFilter operator={OPERATOR_TYPES.ANY} {...mockProps} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it(`when operator is "${OPERATOR_TYPES.NONE}"`, () => {
      const { container } = render(
        <ValueFilter operator={OPERATOR_TYPES.NONE} {...mockProps} />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  it(`should render a Dropdown when property type is ${PROPERTY_TYPES.ENUM}`, () => {
    const enumProperty = {
      id: 1,
      name: 'Product Type',
      type: PROPERTY_TYPES.ENUM,
      values: ['foo', 'bar'],
    };
    const operator = OPERATOR_TYPES.EQUALS;
    const props = {
      ...mockProps,
      property: enumProperty,
      operator,
    };
    const { container } = render(<ValueFilter {...props} />);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(
      enumProperty.values.length,
    );
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it(`should allow mutiple selection on Dropdown when property type is ${PROPERTY_TYPES.ENUM} and the operator is ${OPERATOR_TYPES.IN}`, () => {
    const enumProperty = {
      id: 1,
      name: 'Product Type',
      type: PROPERTY_TYPES.ENUM,
      values: ['foo', 'bar'],
    };
    const operator = OPERATOR_TYPES.IN;
    const props = {
      ...mockProps,
      property: enumProperty,
      operator,
    };
    const { container } = render(<ValueFilter {...props} />);

    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-multiselectable',
      'true',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(
      enumProperty.values.length,
    );
    expect(container).toMatchSnapshot();
  });

  it(`should not render options when property type is ${PROPERTY_TYPES.ENUM} doesn't have values`, () => {
    const enumProperty = {
      id: 1,
      name: 'Product Type',
      type: PROPERTY_TYPES.ENUM,
    };
    const operator = OPERATOR_TYPES.IN;
    const props = {
      ...mockProps,
      property: enumProperty,
      operator,
    };
    const { container } = render(<ValueFilter {...props} />);

    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-multiselectable',
      'true',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(container).toMatchSnapshot();
  });

  it(`should render an Input when property type is ${PROPERTY_TYPES.STRING}`, () => {
    const enumProperty = {
      id: 1,
      name: 'Product Name',
      type: PROPERTY_TYPES.STRING,
    };
    const operator = OPERATOR_TYPES.EQUALS;
    const props = {
      ...mockProps,
      property: enumProperty,
      operator,
    };
    const { container } = render(<ValueFilter {...props} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
