// src/components/PhotoGallery.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { dateTimeConvert } from "../../hooks/date-convert";
import { confirm, successAlert, warningAlert } from "../../components/Alert";

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
  const [isDeleteing, setIsDeleteing] = useState(false);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotoGallery = async () => {
      try {
        const response = await api.get(`/photo-gallery/${id}`);
        setPhotoGallery(response.data.content);
      } catch (error: any) {
        warningAlert(error.response.data.message);
        navigate("/community/photo-gallery");
        console.error("Error fetching notice data:", error);
      }
    };

    fetchPhotoGallery();
  }, [id]);

  const handleDelete = async () => {
    if (isDeleteing) return; //삭제중이면 리턴

    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    else setIsDeleteing(true);
    try {
      await api.delete(`/photo-gallery/${id}`);
      setIsDeleteing(false);
      successAlert("글 삭제가 완료되었습니다.");
      navigate("/community/photo-gallery");
    } catch (error: any) {
      setIsDeleteing(false);
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
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
            {user?.role === "ADMIN" && (
              <>
                <button
                  onClick={() =>
                    navigate(
                      `/community/photo-gallery/write?edit=${photoGallery.id}`
                    )
                  }
                >
                  수정
                </button>
                <button
                  style={{ background: "tomato" }}
                  onClick={() => handleDelete()}
                >
                  삭제
                </button>
              </>
            )}
          </ButtonContainer>
          <PhotoGalleryContent
            dangerouslySetInnerHTML={{ __html: photoGallery?.content }}
            className="ql-editor"
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
    background-color: var(--base-color);
    border-radius: 6px;
    color: white;
    padding: 8px 15px;
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
  margin: 20px 0;
  font-size: 1.2em;
`;

const Image = styled.img`
  width: 100%;
  margin: 10px 0;
`;

export default PhotoGallery;
