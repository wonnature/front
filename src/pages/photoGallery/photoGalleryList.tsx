import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

interface PhotoGalleryItem {
  id: number;
  hit: number;
  title: string;
  content: string;
  imageUrls: string[];
  createdDate: string;
  lastModifiedDate: string;
}

const PhotoGalleryList: React.FC = () => {
  const [photoGalleryList, setPhotoGalleryList] = useState<PhotoGalleryItem[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const getPhotoGalleryList = async () => {
    try {
      const response = await api.get("/photo-gallery");
      setPhotoGalleryList(response.data.content);
      console.log(response.data.content);
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다.", error);
    }
  };

  useEffect(() => {
    getPhotoGalleryList();
  }, []);

  const handlePhotoGalleryClick = (id: number) => {
    navigate(`/community/photo-gallery/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = photoGalleryList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PhotoGalleryListContainer>
      <LogoContainer>
        <img src="/images/community/title5_3.png" alt="logo" />
      </LogoContainer>
      {user?.role === "ADMIN" && (
        <ButtonContainer>
          <button onClick={() => navigate("/community/notice/write")}>
            포토갤러리 작성
          </button>
        </ButtonContainer>
      )}
      <PhotoContainer>
        {currentItems.map((item) => (
          <PhotoGalleryCard
            key={item.id}
            onClick={() => handlePhotoGalleryClick(item.id)}
          >
            <PhotoThumbnail>
              {item.imageUrls.length > 0 && (
                <img src={item.imageUrls[0]} alt={item.title} />
              )}
            </PhotoThumbnail>
            <PhotoInfo>
              <h3>{item.title}</h3>
              <div>
                <span>조회수: {item.hit}</span>
                <span>
                  {new Date(item.createdDate).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </PhotoInfo>
          </PhotoGalleryCard>
        ))}
      </PhotoContainer>
      <PaginationContainer>
        {Array.from(
          { length: Math.ceil(photoGalleryList.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <PaginationButton
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            active={currentPage === pageNumber}
          >
            {pageNumber}
          </PaginationButton>
        ))}
      </PaginationContainer>
    </PhotoGalleryListContainer>
  );
};

const PhotoGalleryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  height: auto;
  padding: 20px;
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
  & button {
    background-color: var(--base-color);
    border-radius: 10px;
    color: white;
    padding: 8px 10px;
    border: 1px solid gray;
  }
`;

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
  @media (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
`;

const PhotoGalleryCard = styled.div`
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;

const PhotoThumbnail = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoInfo = styled.div`
  padding: 10px;

  h3 {
    margin-top: 0;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  div {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #666;
    padding-top: 10px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#B0D477" : "#f1f1f1")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#e6e6e6")};
  }
`;

export default PhotoGalleryList;
