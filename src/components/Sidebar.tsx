import styled, { css, keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { categories } from "./category";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [normalColor] = useState("black");
  const [activeColor, setActiveColor] = useState("white");

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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

    if (location.pathname.includes("product")) {
      setOpenCategories([1]);
    }

    if (location.pathname.includes("quality")) {
      setOpenCategories([2]);
    }

    if (location.pathname.includes("community")) {
      setOpenCategories([3]);
    }

    if (location.pathname.includes("write")) {
      setOpenCategories([4]);
    }

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  const handleResize = () => {
    if (location.pathname === "/" && window.innerWidth > 1000) {
      setIsOpen(false);
    }
    if (location.pathname !== "/" && window.innerWidth > 1000) {
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
      setIsAnimate(true);
      setTimeout(() => {
        setIsAnimate(false);
      }, 300); // 애니메이션의 지속 시간과 일치하도록 설정
    }
  }, [isOpen]);

  return (
    <>
      {(isOpen || isAnimate) && (
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
              <SubcategoryList $isOpen={openCategories.includes(index)}>
                {category.subcategories.map((subcategory, subIndex) => (
                  <SubcategoryItem
                    key={subIndex}
                    onClick={() => {
                      navigate(subcategory.url);
                    }}
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
            </Category>
          ))}
        </Container>
      )}

      <FloatBtn
        $isOpen={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) {
            setIsAnimate(true);
          }
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
  height: 100dvh;
  background-color: #f8f9fa;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: fixed;
  left: 0px;
  top: 0px;
  align-self: flex-start;
  transition: all 0.5s;
  overflow-y: scroll;
  z-index: 1000;
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
    position: sticky;
    top: calc(var(--header-height) + 25px);
    align-self: flex-start;
    height: 100%;
    border-radius: 15px;
    margin-right: 1%;
    background: linear-gradient(
      120deg,
      #93ef96,
      #82d782
    ); /* 시그널 그린에서 진한 민트 그린으로 그라데이션 */
    z-index: 0;
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

const SubcategoryList = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const SubcategoryItem = styled.div<{ $color: string }>`
  font-size: 1.2rem;
  font-weight: 600;
  padding: 5px 25px;
  color: ${(props) => props.$color};
  transition: color 0.5s;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const FloatBtn = styled.div<{ $isOpen: boolean }>`
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
  left: ${(props) => (props.$isOpen ? "270px" : "30px")};
  bottom: 30px;
  z-index: 1001;

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
