import styled from "styled-components";
import api from "../../api";
import { useEffect, useState } from "react";
import { warningAlert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";

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
  const [type, setType] = useState("화장품");
  const navigate = useNavigate();

  const getProductsByType = async (type: string) => {
    try {
      const response = await api.get(`/product?type=${type}`);
      setProducts(response.data.content);
    } catch (error: any) {
      await warningAlert(error.response.data.message);
    }
  };

  useEffect(() => {
    getProductsByType(type);
  }, [type]);
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
  font-size: 2.8rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "black" : "rgba(0,0,0,0.4)")};
  transition: color 0.5s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 7px;
    width: ${(props) => (props.$isActive ? "100%" : "0")};
    background-color: green;
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
  border-radius: 15px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: 0.5s all;
  padding: 10px;
  &:hover {
    cursor: pointer;
    transform: scale(1.03);
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
  padding: 10px 0;
`;

export default ProductList;
