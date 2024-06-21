import styled from "styled-components";
import api from "../../api";
import { useEffect, useState } from "react";
import { warningAlert } from "../../components/Alert";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const getProductsByType = async (type: string) => {
    try {
      const response = await api.get(`/product?type=${type}`);
      setProducts(response.data.content);
    } catch (error: any) {
      await warningAlert(error.response.data.message);
    }
  };

  useEffect(() => {
    getProductsByType("화장품");
  }, []);
  return (
    <Container>
      <ProductContainer>
        {products?.map((product) => (
          <ProductBtn>{product?.title}</ProductBtn>
        ))}
      </ProductContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  gap: 10px;
`;

const ProductBtn = styled.div`
  width: 100%;
  border: 1px solid black;
`;

export default ProductList;
