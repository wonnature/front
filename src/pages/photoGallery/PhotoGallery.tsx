// src/components/PhotoGallery.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { dateTimeConvert } from "../../hoooks/date-convert";

interface PhotoGalleryProps {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  createdDate: string;
  lastModifiedDate: string;
}

const PhotoGallery: React.FC = () => {
  const { id } = useParams();
  const [photoGallery, setPhotoGallery] = useState<PhotoGalleryProps | null>(
    null
  );
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotoGallery = async () => {
      try {
        const response = await api.get(`/photo-gallery/${id}`);
        setPhotoGallery(response.data.content);
      } catch (error) {
        console.error("Error fetching photo-gallery data:", error);
      }
    };

    fetchPhotoGallery();
  }, [id]);

  const getFileName = (url: string) => {
    const parts = url.split("/");
    const encodedFileName = parts[parts.length - 1];
    return decodeURIComponent(encodedFileName);
  };

  return (
    <PhotoGalleryContainer>
      {photoGallery ? (
        <>
          <PhotoGalleryTitle>{photoGallery?.title}</PhotoGalleryTitle>
          <TimeContainer>
            <div>
              <span>작성일</span>
              <span>{dateTimeConvert(photoGallery?.createdDate)}</span>
            </div>
            {photoGallery.createdDate !== photoGallery.lastModifiedDate && (
              <div>
                <span>수정일</span>
                <span>{dateTimeConvert(photoGallery?.lastModifiedDate)}</span>
              </div>
            )}
          </TimeContainer>
          <hr></hr>
          <ButtonContainer>
            <button onClick={() => navigate("/community/photo-gallery")}>
              목록
            </button>
            {user && (
              <button
                onClick={() =>
                  navigate(
                    `/community/photo-gallery/write?edit=${photoGallery.id}`
                  )
                }
              >
                수정
              </button>
            )}
          </ButtonContainer>
          <PhotoGalleryContent
            dangerouslySetInnerHTML={{ __html: photoGallery?.content }}
          />
          {photoGallery?.imageUrls.map((image) => (
            <Image src={image}></Image>
          ))}
        </>
      ) : (
        <LoadingSpinner></LoadingSpinner>
      )}
    </PhotoGalleryContainer>
  );
};

const PhotoGalleryContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 0;
`;

const PhotoGalleryTitle = styled.div`
  font-size: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
  & button {
    width: 60px;
    padding: 8px 0;
    color: black;
    border: 1px solid gray;
  }
`;

const TimeContainer = styled.div`
  & div {
    display: flex;
    gap: 10px;
    color: gray;
  }
`;

const PhotoGalleryContent = styled.div`
  margin-bottom: 20px;
  font-size: 1.2em;
`;

const Image = styled.img`
  width: 100%;
  margin: 10px 0;
`;

export default PhotoGallery;
