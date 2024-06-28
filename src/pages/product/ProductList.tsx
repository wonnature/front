import styled from "styled-components";
import api from "../../api";
import { useEffect, useState } from "react";
import { warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";

interface Product {
  englishTitle: string;
  oneLineIntroduce: string;
  productType: string;
  storeLink: string;
  title: string;
  imageUrls: [string];
  id: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const typeQuery = queryParams.get("type");
  const [type, setType] = useState<string | any>(typeQuery || "화장품");
  const user = useRecoilValue(userState);

  const getProductsByType = async (type: string) => {
    try {
      const response = await api.get(`/product?type=${type}`);
      setProducts(response.data.content);
    } catch (error: any) {
      await warningAlert(error.response.data.message);
    }
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("type", type);
    navigate({
      pathname: location.pathname,
      search: `?${newSearchParams.toString()}`,
    });
  }, [type]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const typeQuery = queryParams.get("type");
    if (typeQuery) getProductsByType(typeQuery.toString());
    else {
      setType("화장품");
      getProductsByType("화장품");
    }
  }, [location.search]);
  return (
    <Container>
      <TypeContainer>
        <TypeBtn
          $isActive={type === "화장품"}
          onClick={() => setType("화장품")}
        >
          화장품
        </TypeBtn>
        <TypeBtn $isActive={type === "식품"} onClick={() => setType("식품")}>
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
  gap: 35px;
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
  width: calc(33.333% - 14px);
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  transition: 0.5s all;
  padding: 10px;
  &:hover {
    cursor: pointer;
    transform: scale(1.015);
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
  object-fit: scale-down;
`;

const ProductTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  padding: 10px 0;
`;

export default ProductList;
