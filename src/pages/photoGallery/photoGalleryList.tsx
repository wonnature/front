import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const getPhotoGalleryList = async () => {
    try {
      const response = await api.get("http://125.182.57.18:8090/photo-gallery");
      setPhotoGalleryList(response.data.content);
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

  return (
    <PhotoGalleryListContainer>
      <LogoContainer>
        <img src="/images/community/title5_3.png" alt="logo" />
      </LogoContainer>
      <PhotoContainer>
        {photoGalleryList.map((item) => (
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
              <p>{item.content}</p>
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
    </PhotoGalleryListContainer>
  );
};

const PhotoGalleryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;
`;

const LogoContainer = styled.div`
  align-self: flex-start;
  padding-bottom: 5px;
`;

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
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
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
  }

  div {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #666;
  }
`;

export default PhotoGalleryList;
