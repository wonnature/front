import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { categories } from "./category";

const Sidebar = () => {
  const [openCategories, setOpenCategories] = useState([]);
  const navigate = useNavigate();

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Container>
      {categories.map((category, index) => (
        <Category key={index}>
          <CategoryTitle onClick={() => toggleCategory(index)}>
            {category.title}
            {openCategories.includes(index) ? (
              <MdExpandLess size={30} fill={"black"} />
            ) : (
              <MdExpandMore size={30} fill={"black"} />
            )}
          </CategoryTitle>
          {openCategories.includes(index) && (
            <SubcategoryList>
              {category.subcategories.map((subcategory, subIndex) => (
                <SubcategoryItem
                  key={subIndex}
                  onClick={() => navigate(subcategory.url)}
                >
                  {subcategory.name}
                </SubcategoryItem>
              ))}
            </SubcategoryList>
          )}
        </Category>
      ))}
      <FloatBtn>=</FloatBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 250px;
  height: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const Category = styled.div`
  margin-bottom: 10px;
`;

const CategoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  padding: 10px;
  color: black;
  border-radius: 5px;
`;

const SubcategoryList = styled.div`
  margin-top: 5px;
`;

const SubcategoryItem = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  padding: 5px 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const FloatBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: white;
  width: 80px;
  height: 80px;
  position: fixed;
  border-radius: 100px;
  background-color: var(--base-color);
  left: 30px;
  bottom: 30px;

  &:hover {
    cursor: pointer;
  }
`;

export default Sidebar;
