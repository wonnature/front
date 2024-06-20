import styled, { css, keyframes } from "styled-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { categories } from "./category";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [openCategories, setOpenCategories] = useState([]);
  const navigate = useNavigate();

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsAnimate(false);
      }, 300);
    }
  }, [isOpen]);

  return (
    <>
      <Container $isAnimate={isAnimate} $isOpen={isOpen}>
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
      </Container>

      <FloatBtn
        onClick={() => {
          setIsAnimate(true);
          setIsOpen(!isOpen);
        }}
      >
        =
      </FloatBtn>
    </>
  );
};

const Container = styled.div<{ $isOpen: boolean; $isAnimate: boolean }>`
  width: 250px;
  height: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  ${({ $isOpen, $isAnimate }) =>
    $isOpen
      ? css`
          animation: ${slideRight} 0.3s forwards;
        `
      : $isAnimate
      ? css`
          animation: ${slideLeft} 0.3s forwards;
        `
      : css`
          display: none;
        `}
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
  padding: 10px 15px;
  color: black;
  border-radius: 5px;
`;

const SubcategoryList = styled.div`
  margin-top: 5px;
`;

const SubcategoryItem = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  padding: 5px 25px;
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

const slideLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-300px);
    opacity: 0;
  }
`;

const slideRight = keyframes`
  from {
    transform: translateX(-300px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
}
`;

export default Sidebar;
