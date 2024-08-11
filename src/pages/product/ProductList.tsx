import styled from "styled-components";
import api from "../../api";
import { useEffect, useState } from "react";
import { warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { useQuery } from "@tanstack/react-query";
import { ProductProps } from "../types/ProductProps";

const getProductsByType = async (type: string) => {
  const response = await api.get(`/product?type=${type}`);
  return response.data.content;
};

const ProductList = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string | any>(
    localStorage.getItem("productType") || "화장품"
  );
  const user = useRecoilValue(userState);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<ProductProps[]>({
    queryKey: ["products", type],
    queryFn: () => getProductsByType(type),
    staleTime: 1000 * 60 * 5, //5분
    retry: 0, // 재시도 횟수를 0회로 설정
  });

  useEffect(() => {
    localStorage.setItem("productType", type);
  }, [type]);

  const handleTypeChange = (newType: string) => {
    if (type !== newType) {
      setType(newType);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <h2>상품 불러오는 중...</h2>
      </Container>
    );
  }

  if (isError) {
    warningAlert(
      (error as any).response?.data?.message ||
        "알 수 없는 오류가 발생했습니다."
    );
    navigate("/"); // 에러 발생 시 메인 페이지로 리디렉션
    return null;
  }

  return (
    <Container>
      <TypeContainer>
        <TypeBtn
          $isActive={type === "화장품"}
          onClick={() => handleTypeChange("화장품")}
        >
          화장품
        </TypeBtn>
        <TypeBtn
          $isActive={type === "식품"}
          onClick={() => handleTypeChange("식품")}
        >
          식품
        </TypeBtn>
      </TypeContainer>
      {user?.role === "ADMIN" && (
        <ButtonContainer>
          <button onClick={() => navigate("/product/write")}>제품 등록</button>
        </ButtonContainer>
      )}
      <ProductContainer>
        {products?.map((product) => (
          <Product
            key={product.title}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <ProductImg src={product.imageUrls[0]} />
            <ProductTitle>{product?.title}</ProductTitle>
          </Product>
        ))}
      </ProductContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  padding: 20px;

  @media screen and (max-width: 500px) {
    padding: 5px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: -10px 0 10px 10px;
  gap: 10px;
  & button {
    background-color: var(--base-color);
    border-radius: 10px;
    color: white;
    padding: 8px 10px;
    border: 1px solid gray;
  }
`;

const TypeContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 32px;
  padding-left: 10px;
  margin-bottom: 20px;
`;

const TypeBtn = styled.div<{ $isActive: boolean }>`
  position: relative;
  height: auto;
  padding: 2px 0;
  font-size: 2.3rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "black" : "rgba(0,0,0,0.4)")};
  transition: color 0.5s;

  @media screen and (max-width: 500px) {
    font-size: 2.2rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 7px;
    width: ${(props) => (props.$isActive ? "100%" : "0")};
    background-color: #5dba5e;
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${(props) => (props.$isActive ? "black" : "rgba(0,0,0,0.8)")};
  }
`;

const ProductContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  gap: 20px;
  padding: 10px;
`;

const Product = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(33.333% - 14px);
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  transition: 0.5s all;
  /* padding: 10px; */
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 1200px) {
    width: calc(50% - 10px);
  }

  @media screen and (max-width: 600px) {
    width: calc(100%);
  }
`;

const ProductImg = styled.img`
  width: 100%;
  height: 75%;
  padding: 10px 15px;
  object-fit: scale-down;
`;

const ProductTitle = styled.div`
  font-size: 1.1rem;
  height: 25%;
  font-weight: 400;
  /* background-color: #f1faee; */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 0 0 3px 3px;
`;

export default ProductList;
