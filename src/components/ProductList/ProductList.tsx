import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableBody,
} from 'semantic-ui-react';
import { PropTypes } from './ProductList.types';

const ProductList = ({ products, properties }: PropTypes) => {
  const maxcolumns = properties.length;

  return (
    <Table striped celled>
      <TableHeader>
        <TableRow>
          {properties.map(({ key, text }) => (
            <TableHeaderCell key={`th_${key}`}>{text}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map(({ id, properties: productProperties }) => {
          return (
            <TableRow key={`tr_${id}`}>
              {properties.map(({ key }) => (
                <TableCell key={`tc_prod${id}_${key}`}>
                  {productProperties[key]}
                </TableCell>
              ))}
              {properties.length < maxcolumns ? <TableCell></TableCell> : <></>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductList;
