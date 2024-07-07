import { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { warningAlert } from "../../components/Alert";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { PhotoGalleryProps } from "../types/PhotoGalleryProps";
import { NoticeProps } from "../types/NoticeProps";

const bannerImages = [
  "/images/homeBanner/banner_01.jpg",
  "/images/homeBanner/banner_02.jpg",
  "/images/homeBanner/banner_03.jpg",
  "/images/homeBanner/banner_04.jpg",
  "/images/homeBanner/banner_05.jpg",
  "/images/homeBanner/banner_06.jpg",
];

const SliderSettings = {
  dots: true,
  infinite: true,
  arrows: true, // 좌,우 버튼
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true, // 자동 슬라이드 추가
  autoplaySpeed: 3000, // 자동 슬라이드 속도 (3초)
};

const Home = () => {
  const [notices, setNotices] = useState<NoticeProps[] | null>(null);
  const [products, setProducts] = useState<PhotoGalleryProps[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNotices();
    getProductsByType("화장품");
  }, []);

  const getNotices = async () => {
    try {
      const response = await api.get("/notice");
      setNotices(response.data.content);
    } catch (error: any) {
      warningAlert(error?.response?.data?.message);
    }
  };

  const getProductsByType = async (type: string) => {
    try {
      const response = await api.get(`/product?type=${type}`);
      setProducts(response.data.content);
    } catch (error: any) {
      await warningAlert(error.response.data.message);
    }
  };

  return (
    <Container>
      <StyledSlider {...SliderSettings}>
        {bannerImages.map((src, index) => (
          <div key={index}>
            <BannerImage src={src} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </StyledSlider>
      <BottomContainer>
        <Content>
          <ContentSubject>
            <span>공지사항</span>
            <span onClick={() => navigate("/community/notice")}>more</span>
          </ContentSubject>
          {notices?.map(
            (notice, index) =>
              index < 5 && (
                <ContentTitle key={notice.id}>
                  <span
                    onClick={() => navigate(`/community/notice/${notice.id}`)}
                  >
                    {notice?.title}
                  </span>
                  {notice?.fileUrls?.length > 0 && (
                    <img src="/images/disk_icon.png" />
                  )}
                </ContentTitle>
              )
          )}
        </Content>
        <Content>
          <ContentSubject>
            <span>제품</span>
            <span onClick={() => navigate("/community/photo-gallery")}>
              more
            </span>
          </ContentSubject>
          {products?.map(
            (product, index) =>
              index < 1 && (
                <PhotoGalleryContainer key={product?.id}>
                  {product.imageUrls.length > 0 && (
                    <PhotoGalleryImage
                      src={product.imageUrls && product.imageUrls[0]}
                      alt="사진없음"
                      onClick={() => navigate(`/product/${product?.id}`)}
                    />
                  )}

                  <ContentTitle
                    onClick={() => navigate(`/product/${product?.id}`)}
                  >
                    {product?.title}
                  </ContentTitle>
                </PhotoGalleryContainer>
              )
          )}
        </Content>
        <CallContainer>
          <Content>
            <div className="image-container">
              <img
                src="/images/homeBanner/bottom/banner_1.png"
                onClick={() => navigate("/quality-test/service")}
              />
            </div>
            <div className="image-container">
              <a
                href="https://sanhak.wku.ac.kr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/homeBanner/bottom/banner_3.png" />
              </a>
            </div>
          </Content>

          <Content>
            <img src="/images/homeBanner/bottom/mark_banner.jpg" />
            <img src="/images/homeBanner/bottom/tell.png" />
          </Content>
          <SnsContainer>
            <a
              href="https://www.facebook.com/wonnature/?fref=ts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/homeBanner/bottom/sns_01.png" alt="페이스북" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=hgT1QSMUWhY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/homeBanner/bottom/sns_02.png" alt="유튜브" />
            </a>
            <a
              href="https://www.instagram.com/wonnature/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/homeBanner/bottom/sns_03.png"
                alt="인스타그램"
              />
            </a>
          </SnsContainer>
        </CallContainer>
      </BottomContainer>
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
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    &:hover {
      &:before {
        color: black;
      }
    }
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
    color: grey;
  }

  .slick-prev {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: gray;
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

const BottomContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px auto;
  padding: 20px 30px;
  gap: 40px;
`;

const Content = styled.div`
  display: flex;
  min-width: 200px;
  max-width: 200px;
  width: auto;
  flex-direction: column;
  gap: 5px;

  & .image-container {
    width: 100%;
    height: 100px; /* 고정된 높이 */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden; /* 넘치는 부분을 숨김 */
  }

  & img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  & img:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 740px) {
    width: 100%;
    max-width: 100%;
  }
`;

const ContentSubject = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  & span:nth-child(1) {
    font-size: 1.5rem;
    font-weight: 700;
  }
  & span:nth-child(2) {
    color: var(--base-color);
  }
  & span:nth-child(2):hover {
    cursor: pointer;
  }
`;

const ContentTitle = styled.div`
  max-width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  gap: 10px;

  & img {
    margin-left: 5px;
    height: 13px;
  }

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const PhotoGalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PhotoGalleryImage = styled.img`
  width: 100%;
  max-width: 400px !important;
`;

const CallContainer = styled.div`
  display: flex;
  gap: 20px;

  @media screen and (max-width: 1070px) {
    flex-direction: column;
    gap: 30px;
    max-width: 400px;
  }

  @media screen and (max-width: 740px) {
    width: 100%;
    max-width: 250px;
  }
`;

const SnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  & img {
    width: 50px;
    height: 50px;
  }

  & img:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 1070px) {
    flex-direction: row;
  }
`;

export default Home;
