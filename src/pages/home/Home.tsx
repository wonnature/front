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

const Home = () => {
  return (
    <Container>
      <Banner className="slider-container">
        <StyledSlider {...SliderSettings}>
          <div>
            <BannerImage
              src="/images/homeBanner/banner_01.jpg"
              alt="Banner 1"
            />
          </div>
          <div>
            <BannerImage
              src="/images/homeBanner/banner_02.jpg"
              alt="Banner 1"
            />
          </div>
          {/* 필요한 만큼 배너 이미지 추가 */}
        </StyledSlider>
      </Banner>
      <Content>
        <h1>수피나 상쾌피 내추럴 프레쉬 클렌징 폼</h1>
        <Notice>
          <h2>공지사항</h2>
          <p>아이템사용법 양식입니다. 2 ❤️</p>
          <p>픽독 - 현장실습지원센터... 1 ❤️</p>
          <p>픽독 - 장학금 및 지원... 34 ❤️</p>
        </Notice>
        <h2>포토갤러리</h2>
        <Gallery>
          <GalleryItem>
            <img src="path/to/your/photo1.jpg" alt="Gallery 1" />
          </GalleryItem>
          <GalleryItem>
            <img src="path/to/your/photo2.jpg" alt="Gallery 2" />
          </GalleryItem>
          {/* 필요한 만큼 갤러리 아이템 추가 */}
        </Gallery>
        <Contact>
          <p>상담안내: 063-850-5156</p>
          <p>상담시간: 09:00 - 17:00</p>
          <p>점심시간: 12:00 - 13:00</p>
        </Contact>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, sans-serif;
`;

const StyledSlider = styled(Slider)`
  .slick-next {
    color: black;
    position: relative;
    top: 7vh;
    right: 2vw;
  }

  .slick-prev {
    color: black;
    left: 0;
    position: relative;
    top: 7vh;
  }

  .slick-list {
    width: 80%;
    padding: 1;
    right: -20px;
  }
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
  text-align: center;
`;

const Notice = styled.div`
  margin: 20px 0;
`;

const Gallery = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const GalleryItem = styled.div`
  width: 30%;
  margin: 10px 0;
  img {
    width: 100%;
    height: auto;
  }
`;

const Contact = styled.div`
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
`;

export default Home;
