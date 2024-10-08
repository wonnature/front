import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  confirm,
  errorAlert,
  successAlert,
  warningAlert,
} from "../../components/Alert";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { ProductProps } from "../types/ProductProps";
import { useQuery } from "@tanstack/react-query";

const Product = () => {
  const [isDeleteing, setIsDeleteing] = useState(false);
  const { id } = useParams();
  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0, // 헤더 높이까지 고려해서 연산
      behavior: "smooth",
    });
  }, []);

  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery<ProductProps>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/product/${id}`);
      return response.data.content;
    },
    staleTime: 1000 * 60 * 5, //5분
    retry: 0, // 재시도 횟수를 0회로 설정
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${productData?.title}`,
          text: `${productData?.oneLineIntroduce}`,
          url: url,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        successAlert("URL이 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 실패:", error);

        // 일부 브라우저에서는 execCommand를 사용해 클립보드에 복사하는 대체 방법
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          successAlert("URL이 클립보드에 복사되었습니다.");
        } catch (err) {
          errorAlert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDelete = async () => {
    if (isDeleteing) return; //삭제중이면 리턴

    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    else setIsDeleteing(true);
    try {
      await api.delete(`/product/${id}`);
      setIsDeleteing(false);
      successAlert("글 삭제가 완료되었습니다.");
      navigate("/product");
    } catch (error: any) {
      setIsDeleteing(false);
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
  };

  if (isError) {
    warningAlert(
      (error as any).response?.data?.message ||
        "제품을 불러오는 중 오류가 발생했습니다."
    );
  }

  if (isLoading) {
    <Container>
      <h2>제품 불러오는 중...</h2>
    </Container>;
  }

  return (
    <Container>
      <ProductForm>
        {user && (
          <AdminContainer>
            <Button onClick={() => navigate(`/product/write?edit=${id}`)}>
              수정
            </Button>
            <Button onClick={() => handleDelete()} disabled={isDeleteing}>
              {!isDeleteing ? "삭제" : "삭제 중..."}
            </Button>
            {/* <div>조회수 : {productData?.hit}</div> */}
          </AdminContainer>
        )}
        <TopContainer>
          {productData?.imageUrls && (
            <img src={productData?.imageUrls[0]} alt="대표이미지" />
          )}
          <TopContent>
            <Title>{productData?.title}</Title>
            {productData?.englishTitle && (
              <Detail>
                <div>영문이름</div>
                <div>{productData?.englishTitle}</div>
              </Detail>
            )}
            {productData?.configuration && (
              <Detail>
                <div>구성</div>
                <div>{productData?.configuration}</div>
              </Detail>
            )}
            {productData?.oneLineIntroduce && (
              <Detail>
                <div>제품설명</div>
                <div>{productData?.oneLineIntroduce}</div>
              </Detail>
            )}

            {productData?.storeLink && (
              <Detail>
                <div>구매채널</div>
                <div>네이버스토어</div>
              </Detail>
            )}

            <ButtonContainer>
              {productData?.storeLink && (
                <NaverBtn
                  style={{ background: "#13b65c" }}
                  href={productData?.storeLink}
                  target="_blank"
                >
                  구매하기
                </NaverBtn>
              )}
              <Button
                style={{ background: "var(--base-color)" }}
                onClick={() => handleShare()}
              >
                공유하기
              </Button>
            </ButtonContainer>
          </TopContent>
        </TopContainer>
        <Hr />
        <Content
          dangerouslySetInnerHTML={{ __html: productData?.content as string }}
          className="ql-editor"
        />
        {productData?.imageUrls?.map(
          (image: any, index) =>
            index !== 0 && <Image key={index} src={image} alt={"상품이미지"} />
        )}
        {/* <ProductListContainer>
          {productList?.map}
        </ProductListContainer> */}
        <Button onClick={() => navigate("/product")}>목록으로</Button>
      </ProductForm>
    </Container>
  );
};

const centeredFlex = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  ${centeredFlex}
  width: 100%;
  max-width: 1000px;
  /* min-height: 100vh; */
  padding: 20px;

  @media screen and (max-width: 450px) {
    padding: 10px;
  }
`;

const ProductForm = styled.div`
  ${centeredFlex}
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  /* padding: 40px 30px; */
  gap: 20px;

  @media screen and (max-width: 500px) {
    padding: 40px 10px;
  }
`;

const TopContainer = styled.div`
  ${centeredFlex}
  width: 100%;
  height: auto;
  min-height: 390px;
  flex-flow: row nowrap;
  align-items: center;
  gap: 60px;

  & img {
    width: 50%;
    height: 100%; // 추가된 부분
    object-fit: cover; // 이미지 비율을 유지하면서 요소를 채우도록 설정
    border-radius: 8px;
  }

  @media screen and (max-width: 1000px) {
    flex-flow: column;

    & img {
      width: 100%;
    }
  }
`;

const TopContent = styled.div`
  ${centeredFlex}
  width: 50%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;

  @media screen and (max-width: 1000px) {
    width: 95%;
  }
`;

const Detail = styled.div`
  display: flex;
  color: rgba(0, 0, 0, 0.7);
  width: 100%;

  & div {
    font-size: 1.15rem;
  }
  & :nth-child(1) {
    width: 100px;
  }

  & :nth-child(2) {
    width: calc(100% - 130px);
    white-space: wrap;
  }

  @media screen and (max-width: 450px) {
    width: 100%;
    font-size: 1rem;
    & :nth-child(1) {
      width: 120px;
    }
    & :nth-child(2) {
      width: 100%;
    }
  }
`;

const Title = styled.div`
  font-size: 1.7rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 10px;
`;

// const Introduce = styled.div`
//   font-size: 1.3rem;
//   font-weight: 600;
//   text-align: left;
//   color: #333333;
//   margin-bottom: 10px;
// `;

const ButtonContainer = styled.div`
  ${centeredFlex}
  width: 100%;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  background-color: var(--base-color);
  color: #ffffff;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.3s;
  border-radius: 10px;
  padding: 0;

  &:hover {
    filter: brightness(80%);
  }

  &:nth-child(2) {
    background-color: ${(props) => (!props.disabled ? "tomato" : "gray")};
  }

  & a {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: auto;
  line-height: 1.5;
  color: #555555;
  padding: 0;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  margin-top: -20px;
`;

const NaverBtn = styled.a`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #03c75a;
  font-weight: bolder;
  font-size: 1.1rem;
  border-radius: 10px;
  color: white !important;
  align-self: flex-start;
`;

const Hr = styled.hr`
  width: 100%;
  color: #808080aa;
  margin: 30px auto;
`;

const AdminContainer = styled.div`
  display: flex;
  width: 30%;
  min-width: 350px;
  padding: 10px 0;
  flex-flow: row nowrap;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  & div {
    width: 300px;
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

// const ProductListContainer = styled.div`
//   display: flex;
//   padding: 15px;
//   gap: 10px;
// `;

// const ProductContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100px;
//   height: 100px;

//   & img {
//     object-fit: scale-down;
//   }
// `;

export default Product;
