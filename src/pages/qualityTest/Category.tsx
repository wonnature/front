import React from "react";
import styled from "styled-components";
import introData from "../../../public/category-list.json";
import tableData from "../../../public/category-table.json";
import tableData2 from "../../../public/category-table2.json";

interface GroupedData {
  category: string;
  rows: { category: string; criteria: string; sample: string }[];
}

const Category = () => {
  const groupedData: GroupedData[] = tableData2.items.reduce((acc, item) => {
    const existingGroup = acc.find((group) => group.category === item.category);
    if (existingGroup) {
      existingGroup.rows.push(item);
    } else {
      acc.push({ category: item.category, rows: [item] });
    }
    return acc;
  }, [] as GroupedData[]);

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
          <table>
            <thead>
              <tr>
                <th colSpan={2} style={{ backgroundColor: "#f2f2f2" }}>
                  {tableData.headers[0].text}
                </th>
                <th style={{ backgroundColor: "#f2f2f2" }}>
                  {tableData.headers[2].text}
                </th>
                <th style={{ backgroundColor: "#f2f2f2" }}>
                  {tableData.headers[3].text}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.col}</td>
                  <td>{item.category2}</td>
                  <td>{item.money}</td>
                  <td>{item.day}</td>
                </tr>
              ))}
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
              <th colSpan={2} style={{ backgroundColor: "#f2f2f2" }}>
                {tableData2.headers[0].text}
              </th>
              <th style={{ backgroundColor: "#f2f2f2" }}>
                {tableData2.headers[2].text}
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((group, index) => (
              <React.Fragment key={index}>
                {group.rows.map((item, rowIndex) => (
                  <tr key={`${index}-${rowIndex}`}>
                    {rowIndex === 0 && (
                      <td rowSpan={group.rows.length}>{group.category}</td>
                    )}
                    <td>{item.criteria}</td>
                    <td>{item.sample}</td>
                  </tr>
                ))}
              </React.Fragment>
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
      text-align: center; // 가운데 정렬
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    text-align: center; // 가운데 정렬
    border-bottom: 1px solid #ddd;
  }
`;
const Content = styled.div``;
const Subimg = styled.img``;
