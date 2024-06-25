import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderSettings = {
  dots: true,
  infinite: true,
  arrows: true, // 좌,우 버튼
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const bannerImages = [
  "/images/homeBanner/banner_01.jpg",
  "/images/homeBanner/banner_02.jpg",
  "/images/homeBanner/banner_03.jpg",
  "/images/homeBanner/banner_04.jpg",
  "/images/homeBanner/banner_05.jpg",
  "/images/homeBanner/banner_06.jpg",
];

const Home = () => {
  return (
    <Container>
      <StyledSlider {...SliderSettings}>
        {bannerImages.map((src, index) => (
          <div key={index}>
            <BannerImage src={src} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </StyledSlider>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  margin: -15px;
  font-family: Arial, sans-serif;
`;

const StyledSlider = styled(Slider)`
  .slick-next,
  .slick-prev {
    width: 40px;
    height: 50px;
    /* background-color: rgba(0, 0, 0, 0.5); */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    color: white;
  }

  .slick-next {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }

  .slick-next:before,
  .slick-prev:before {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
    color: black;
  }

  .slick-prev {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  .slick-dots li button:before {
    font-size: 16px;
    color: black;
  }

  .slick-dots li.slick-active button:before {
    color: black;
  }

  .slick-list {
    width: 100%;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  min-height: 190px;
  max-height: 500px;
  object-fit: cover;
`;

export default Home;
