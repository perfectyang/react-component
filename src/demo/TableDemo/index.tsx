import React from "react";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
// import 'rsuite-table/lib/less/index.less'; // or
import "rsuite-table/dist/css/rsuite-table.css";

const dataList = [
  { id: 1, name: "a", email: "a@email.com", avartar: "..." },
  { id: 2, name: "b", email: "b@email.com", avartar: "..." },
  { id: 3, name: "c", email: "c@email.com", avartar: "..." },
];

const ImageCell = ({ rowData, dataKey, ...rest }) => (
  <Cell {...rest}>
    <img src={rowData[dataKey]} width="50" />
  </Cell>
);

const TableDemo = () => (
  <Table bordered cellBordered data={dataList}>
    <Column width={100} sortable fixed resizable>
      <HeaderCell>ID</HeaderCell>
      <Cell dataKey="id" />
    </Column>

    <Column width={100} sortable resizable>
      <HeaderCell>Name</HeaderCell>
      <Cell dataKey="name" />
    </Column>

    <Column width={100} sortable resizable>
      <HeaderCell>Email</HeaderCell>
      <Cell>
        {(rowData, rowIndex) => {
          return <a href={`mailto:${rowData.email}`}>{rowData.email}</a>;
        }}
      </Cell>
    </Column>

    <Column width={100} resizable>
      <HeaderCell>Avartar</HeaderCell>
      <ImageCell dataKey="avartar" />
    </Column>
  </Table>
);

export default TableDemo;
