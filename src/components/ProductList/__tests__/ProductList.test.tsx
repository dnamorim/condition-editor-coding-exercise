import { render, screen } from '@testing-library/react';
import ProductList from '..';

describe('ProductList', () => {
  const mockProps = {
    properties: [
      {
        key: 0,
        text: 'Product Name',
      },
      {
        key: 1,
        text: 'Color',
      },
    ],
    products: [
      {
        id: 0,
        properties: {
          0: 'Foo',
          1: 'Bar',
        },
      },
      {
        id: 1,
        properties: {
          0: 'Bizz',
          1: 'Buzz',
        },
      },
    ],
  };

  it('should render correctly', () => {
    const { container } = render(<ProductList {...mockProps} />);
    const renderedProducts = screen.getAllByRole('rowgroup')[1].childNodes;

    expect(renderedProducts).toHaveLength(mockProps.products.length);
    expect(container).toMatchSnapshot();
  });

  it("should render an empty cell when a property value doesn't exist", () => {
    const extraProduct = {
      id: 2,
      properties: { 0: 'Sample' },
    };
    const props = {
      ...mockProps,
      products: [...mockProps.products, extraProduct],
    };
    const { container } = render(<ProductList {...props} />);

    const extraProductEmptyCell =
      screen.getAllByRole('rowgroup')[1].childNodes[2].childNodes[1];

    expect(extraProductEmptyCell).toBeEmptyDOMElement();
    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
