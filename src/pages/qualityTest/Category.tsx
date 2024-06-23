import React from "react";
import styled from "styled-components";
import introData from "../../../public/category-list.json";
import tableData from "../../../public/category-table.json";
import tableData2 from "../../../public/category-table2.json";
import { useTable, Column } from "react-table";

const Category = () => {
  const data = React.useMemo(
    () =>
      tableData.items.map((item) => ({
        ...item,
      })),
    []
  );

  const columns: Column<{
    col: string;
    category2: string;
    money: string;
    day: string;
  }>[] = React.useMemo(
    () => [
      { Header: "", accessor: "col" },
      { Header: "검사항목", accessor: "category2" },
      { Header: "수수료(원)", accessor: "money" },
      { Header: "처리기간(일)", accessor: "day" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/quality/title4_2.png" alt="logo" />
      </LogoContainer>

      <Content>
        {introData.intro.map((item, index) => (
          <div key={index}>
            <TitleImg src={item.titleImg} alt={`title-img-${index}`} />
            {item.content.map((text, idx) => (
              <StyledLi key={idx}>{text}</StyledLi>
            ))}
          </div>
        ))}
        <TableContainer>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header", { col: column.id })}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Content>

      <div>
        <TitleImg src="/images/quality/quality_2_ti_4.png" alt="title-img" />
        <Subimg src="/images/quality/quality_2_sub_1.jpg" alt="sub-img" />
      </div>

      <div>
        <Table>
          <thead>
            <tr>
              {tableData2.headers.map((header, index) => (
                <th
                  key={index}
                  style={{ backgroundColor: "#f2f2f2" }} // 테이블 헤더를 회색으로 설정
                >
                  {header.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData2.items.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.criteria}</td>
                <td>{item.sample}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </IntroContainer>
  );
};

export default Category;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const TitleImg = styled.img`
  padding: 30px 20px;
`;

const StyledLi = styled.li`
  padding: 5px 10px;

  &::marker {
    color: green;
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  overflow-x: auto;
  table {
    width: 100%;

    th,
    td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
    }
  }
`;
const Content = styled.div``;
const Subimg = styled.img``;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;
