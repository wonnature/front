import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { categories } from "./category";

const Header = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExtend, setIsExtend] = useState(false);
  const HeaderRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMenu = () => {
    setIsClickMenuBtn(false);
  };

  const handleNavigate = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsClickMenuBtn(false);
  };

  useEffect(() => {
    if (!isExtend) {
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    }
  }, [isExtend]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeaderRef.current &&
        !HeaderRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [HeaderRef]);

  const handleResize = () => {
    if (window.innerWidth <= 1000) setAnimate(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      ref={HeaderRef}
      onMouseEnter={() => setIsExtend(true)}
      onMouseLeave={() => {
        setIsExtend(false);
        setAnimate(true);
      }}
      className={isScrolled ? "scrolled" : ""}
    >
      <Logo src="/images/logo.png" alt="logo" onClick={() => navigate("/")} />
      <Tabs $isClickMenuBtn={isClickMenuBtn} $animate={animate}>
        {categories.map((category) => (
          <Tab key={category.title} onClick={handleNavigate}>
            {category.title}
          </Tab>
        ))}
      </Tabs>
      <ExtendContiner $isHover={isExtend} $isAnimate={animate}>
        <ExtendColumn></ExtendColumn> {/*로고 자리를 위한 빈 열 */}
        {categories.map((category, index) => (
          <ExtendColumn key={category.title + index}>
            {category.subcategories.map((category) => (
              <Link to={category.url} key={category.name}>
                {category.name}
              </Link>
            ))}
          </ExtendColumn>
        ))}
      </ExtendContiner>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  height: var(--header-height);
  position: sticky;
  top: 0px;
  z-index: 110;
  background-color: white;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: background-color 0.5s, backdrop-filter 0.5s, box-shadow 0.5s;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);

  &.scrolled {
    -webkit-backdrop-filter: blur(10px); /*ios 전용 */
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    &.scrolled {
      background-color: rgb(255, 255, 255);
      backdrop-filter: blur(0px);
      box-shadow: 0;
    }
  }
`;

const ExtendContiner = styled.div<{ $isHover: boolean; $isAnimate: boolean }>`
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  padding-right: 10%;
  height: auto;
  position: absolute;
  top: var(--header-height);
  background-color: #ffffff;
  box-shadow: 0 4px 7px rgba(155, 204, 104, 0.15);

  ${({ $isHover, $isAnimate }) =>
    $isHover
      ? css`
          animation: ${slideDown} 0.3s forwards;
        `
      : $isAnimate
      ? css`
          animation: ${slideUp} 0.3s forwards;
        `
      : css`
          display: none;
        `}

  @media screen and (max-width: 1700px) {
    padding-right: 3%;
  }
  @media screen and (max-width: 1350px) {
    padding-right: 1%;
  }
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const ExtendColumn = styled.div`
  display: flex;
  width: 250px;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;

  &:first-child {
    min-width: 200px;
    width: 200px;
  }
  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 4px 0;
    transition: color 0.3s;
    font-size: 1.18rem;
  }

  & a:hover {
    color: var(--base-color);
  }

  @media screen and (max-width: 1350px) {
    width: 200px;

    & a {
      font-size: 1rem;
    }
  }
`;

const Logo = styled.img`
  width: 200px;
  padding-left: 30px;

  &:hover {
    cursor: pointer;
  }
`;

const Tabs = styled.div<{
  $isClickMenuBtn: boolean;
  $animate: boolean;
}>`
  height: 54px;
  display: flex;
  justify-content: flex-end;
  padding-right: 10%;
  width: calc(100% - 200px);
  transition: all 0.5s;

  @media screen and (max-width: 1700px) {
    padding-right: 3%;
  }

  @media screen and (max-width: 1350px) {
    padding-right: 1%;
  }

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Tab = styled.div`
  width: 250px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.25rem;
  padding: 15px 0;
  position: relative;
  transition: color 0.3s;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 1350px) {
    width: 200px;
  }

  @media screen and (min-width: 1001px) {
    &:before {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--base-color);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover:before {
      transform: scaleX(1);
    }
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-1px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-1px);
    opacity: 0;
}
`;
