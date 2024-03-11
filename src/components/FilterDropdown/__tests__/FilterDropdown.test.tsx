import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import FilterDropdown from '..';

describe('FilterDropdown', () => {
  const mockOptions = [
    { key: 'foo', text: 'Foo', value: 'foo' },
    { key: 'bar', text: 'Bar', value: 'bar' },
  ];

  it('should render correctly', () => {
    const { container } = render(<FilterDropdown options={mockOptions} />);

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should render with placeholder', () => {
    const placeholder = 'Select an option';
    const { container } = render(
      <FilterDropdown placeholder={placeholder} options={mockOptions} />,
    );

    expect(screen.getByText(placeholder)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should have the selected option', () => {
    const selectedOption = mockOptions[1];
    const { container } = render(
      <FilterDropdown options={mockOptions} value={selectedOption.value} />,
    );

    const option = screen.getByRole('option', { selected: true });

    expect(option).toHaveTextContent(selectedOption.text);
    expect(container).toMatchSnapshot();
  });

  it('should update when an option is changed', () => {
    const mockOnChange = jest.fn();
    const optionIndex = 1;
    const expectedValue = mockOptions[optionIndex].value;

    render(<FilterDropdown options={mockOptions} onChange={mockOnChange} />);

    const element = screen.getByRole('listbox');

    fireEvent.click(element);

    const dropdownOptions = within(element).getAllByRole('option');

    fireEvent.click(dropdownOptions[optionIndex]);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ value: expectedValue }),
    );
  });
});
