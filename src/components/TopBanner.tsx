import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const TopBanner = () => {
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("introduce")) {
      setImageUrl(1);
    }
    if (location.pathname.includes("product")) {
      setImageUrl(2);
    }
    if (location.pathname.includes("quality-test")) {
      setImageUrl(3);
    }
  }, [location.pathname]);
  return (
    <>
      {location.pathname !== "/" && (
        <Image src={`/images/topBanner/sub_bg${imageUrl}.jpg`}></Image>
      )}
    </>
  );
};

const Image = styled.img`
  width: 100vw;
  height: 130px;
  object-fit: cover;
`;

export default TopBanner;
