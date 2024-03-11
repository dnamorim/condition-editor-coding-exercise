# Product Filtering Condition Editor UI

The resolution of the [Coding Exercise for Salsify](https://github.com/salsify/condition-editor-coding-exercise)

## Project

For this exercise, the project was divided in the following areas:

- the [visual components](./src/components) for the application
- the [data](./src/data) for the application
- the [main page](./src/App.tsx) for the application

This exercise is deployed using GitHib Pages and is available on <https://dnamorim.github.io/condition-editor-coding-exercise>.

### Visual Components

For this exercise, the following React components were created:

- [FilterDropdown](./src/components/FilterDropdown), used to show the `Property` and `Operator` filters. It uses the `Dropdown` component from the `semantic-ui-react` library
- [ProductList](./src/components/ProductList), used to present the list of products (all or filtered according to the specified conditions). It uses the `Table` component from the `semantic-ui-react` library
- [ValueFilter](./src/components/ValueFilter), used to specify the value to filter by. Based on the type of `Property` that was previously defined, this field can be a `Dropdown` (for properties of `enumerable` type) or `Input` (for properties of `string` or `number` types) . This custom component uses the `Input` and `Dropdown` from the `semantic-ui-react` library

### Data

On this area, it contains all things related with the data - to fetch and to filter by:

- [datastore](./src/data/datastore.js): the initial mockstore provided to the exercise. It was created the following types:

  - [datastore.types.ts](./src/data/datastore.types.ts): all types for the data in the mockstore
  - [react-app-env.d.ts](./src/react-app-env.d.ts): added a `Window` interface to represent the `datastore` to prevent TypeScript errors

- [selectors](./src/data/selectors): the selectors that allows to fetch and process the data from the mockstore to be used by the application:

  - [getOperationsOptions](./src/data/selectors/getOperationsOptions.ts): returns the dropdown options for all the valid operations for a given property. Since the operators and types are static, it uses an internal dictionary to specify the valid operators per type. The operations are returned in the format:

  ```ts
  [
    { key: 'equals', value: 'equals', text: 'Equals' },
    { key: 'in', value: 'in', text: 'Contains' },
    // ...
  ];
  ```

  - [getPropertyById](./src/data/selectors/getPropertyById.ts): returns the full property object for a given property id.
  - [getPropertyOptions](./src/data/selectors/getOperationsOptions.ts): returns the dropdown options for all the properties available on the mockstore. The operations are returned in the format:

  ```ts
  [
    { key: 0, value: 0, text: 'Product Name' },
    { key: 1, value: 0, text: 'Color' },
    // ...
  ];
  ```

  - [getFilteredProductsBy](./src/data/selectors/getFilteredProductsBy.ts): based on the selected property, operator and filter value, returns all the products that match the filters provided. This list is returned with a different format, so the `ProductList` component can show all the properties of the product in the same order as in the table header. e products are returned in the format:

  ```ts
  [
    {
      id: 2,
      properties: {
        0: 'Keyboard',
        1: 'grey',
        2: 5,
        3: 'electronics',
        4: 'false',
      },
      id: 3,
      properties: { 0: 'Cup', 1: 'white', 2: 3, 3: 'kitchenware' },
      // ...
    },
  ];
  ```

### Main Application

The main application, which is basically a Single-Page Application (SPA), is developed on the [App.tsx](./src/App.tsx). It contains all the state, handlers and hooks responsible to manage the application login to filter the products and show the updated list.

#### State Management

The filters for `selectedPropertyId`, `selectedOperatorId` and `valueFilter` are part of the React state, defined using the `useState` hook.

The `valueFilter` is not used directy - it is used by `debouncedValueFilter` with a `useDebounce` hook - to give the user some time to write and/or select the filter and don't imediately remove the results from the list and also to avoid multiple re-renders/data filtering while the `valueFilter` is being fully defined.

The list of `products` is returned by a `useMemo` hook, which is triggered when one of the properties of the filter changes, and also allows to take advantage of memoization, so if we filter again by the same condtions, we don't need to iterate along the list of products, assuming that the products are static and only update at the application start.

The list of `selectedProperty` is also memoized, to speed-up the search of the selected property for when the `selectedPropertyId` changes.

#### Handlers

The main app has four handlers:

- `handleOnChangeProperty`: responsible to set the selected property and reset the `valueFilter` for when the property changes;
- `handleOnChangeOperator`: responsible to set the selected operator
- `handleOnChangeValueFilter`: responsible to set the specified value filter
- `handleOnClick`: responsible to reset all the states, clearing the filters and allowing the app to present the full list of products

#### Component

The app follows the interface suggested on the [wireframes](http://salsify.github.io/condition-editor-coding-exercise/docs/wireframe.pdf), showing a first row with all the filters and the clear button and a second row with a table containing a list of products.

In order for the layout to be responsible, the filters are in a `flexbox` container that changes from a row format to column for lower screen widths.

Two visual behaviours are controlled in here:

- when a Property isn't selected yet, the operator is disabled and doessn't allow any interactions
- when an Operator doesn't accept any value to filter by, the `ValueFilter` is not rendered

## Frameworks

This exercise was developed using [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)

To help on this coding exercise, the following tools were used:

- [Create React App](https://create-react-app.dev/): to quickly help bootstrap the project repository with React, ESLint for linting and Jest for testing
- [semantic-ui-react](https://react.semantic-ui.com/): for having visual and responsive components to use with the table and the Filters

## Unit Tests

The main application, selectors and the visual components have unit tests done with [Jest](https://jestjs.io) and [React Testing Library](https://testing-library.com/) to test specific behaviours, scenarios and interactions for this exercise.

## Development Notes

The basic skeleton of the project was done in about 3 to 4 hours - presenting information on the table and showing the filters.

Considering the unit tests, testing all the scenarios and some refactoring, it took an aditional 4 hours, considering that I was not working on the project full-time, but balancing with my daily work.
