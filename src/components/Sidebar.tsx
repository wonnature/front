import styled, { css, keyframes } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { categories } from "./category";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [openCategories, setOpenCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [normalColor, setNormalColor] = useState("black");
  const [activeColor, setActiveColor] = useState("white");

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    console.log(openCategories);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    if (window.innerWidth <= 1000) {
      setActiveColor("var(--base-color)");
      setIsAnimate(true);
      setIsOpen(false);
    } else {
      setActiveColor("white");
    }

    window.addEventListener("resize", handleResize);

    if (location.pathname.includes("introduce")) {
      setOpenCategories([0]);
    }

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  const handleResize = () => {
    console.log(window.innerWidth, isOpen, location);
    console.log(isOpen);
    if (location.pathname === "/" && window.innerWidth > 1000) {
      setIsOpen(false);
    }
    if (location.pathname !== "/") {
      setIsOpen(true);
    }

    if (window.innerWidth <= 1000) {
      setActiveColor("var(--base-color)");
    } else {
      setActiveColor("white");
    }
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
      {isOpen && (
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
                      $color={
                        location.pathname === subcategory.url
                          ? activeColor
                          : normalColor
                      }
                    >
                      {subcategory.name}
                    </SubcategoryItem>
                  ))}
                </SubcategoryList>
              )}
            </Category>
          ))}
        </Container>
      )}

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
  display: flex;
  flex-direction: column;
  min-width: 250px;
  /* height: calc(100dvh - (var(--header-height))); */
  height: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: absolute;
  left: 0px;
  transition: all 0.5s;
  overflow-y: scroll;
  ${({ $isOpen, $isAnimate }) =>
    $isOpen && window.innerWidth < 1000
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

  @media screen and (min-width: 1000px ) {
    //1000px 이상일 경우 구조에 맞게 띄움
    display: flex;
    position: relative;
    height: 500px;
    border-radius: 15px;
    /* margin-left: -2%; */
    margin-right: 1%;
    background-color: var(--base-color);
  }
`;

const Category = styled.div`
  margin-bottom: 10px;
`;

const CategoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  padding: 10px 15px;
  color: black;
  border-radius: 5px;
`;

const SubcategoryList = styled.div`
  margin-top: 5px;
`;

const SubcategoryItem = styled.div<{ $color: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  padding: 5px 25px;

  color: ${(props) => props.$color};

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
  z-index: 101;

  &:hover {
    cursor: pointer;
  }

  @media screen and (min-width: 1000px) {
    display: none;
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