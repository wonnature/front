import styled from "styled-components";
import React, { useEffect } from "react";
import companyIntroData from "../../../public/map-list.json";

const Map: React.FC = () => {
  useEffect(() => {
    const { kakao } = window as any;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(35.96636749448932, 126.9592558736621),
      level: 2,
    };

    const map = new kakao.maps.Map(container, options);

    const markerPosition = new kakao.maps.LatLng(
      35.96636749448932,
      126.9592558736621
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    const iwContent = `<div style="text-align:center;padding:2px;width:210px;">전북특별자치도 익산시 익산대로 460</div>`;
    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
    });
    infowindow.open(map, marker);

    kakao.maps.event.addListener(marker, "click", () => {
      window.open(
        "https://map.kakao.com/link/map/㈜ 원네이처, 35.96636749448932, 126.9592558736621"
      );
    });
  }, []);

  return (
    <IntroContainer>
      <LogoContainer>
        <img src="/images/intro/title1_5.png" alt="logo" />
      </LogoContainer>

      <TitleImg>
        <img src="/images/intro/map.png" alt="logo" />
      </TitleImg>
      <NodeList>
        <ul>
          {companyIntroData.intro.map((item, index) => (
            <StyledLi key={index}>
              <h3>{item.title}</h3>
              <ul>
                {item.content.map((contentItem, contentIndex) => (
                  <ContentItem key={contentIndex}>{contentItem}</ContentItem>
                ))}
              </ul>
            </StyledLi>
          ))}
        </ul>
      </NodeList>
      <MapContainer id="map"></MapContainer>
    </IntroContainer>
  );
};

export default Map;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 0;
}

`;

const LogoContainer = styled.div`
  align-self: flex-start;
`;

const TitleImg = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 30px;

  & img {
    max-width: 100%;
  }
`;

const NodeList = styled.div`
  & ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
    padding-bottom: 10px;
  }

  & li {
    display: flex;
    margin: 5px 0;

    & h3 {
      font-weight: bold;
      margin-right: 0.5rem;
      white-space: nowrap;
      text-align: left;
      width: 100px;
      min-width: 100px;

      &::before {
        content: "• ";
        color: green;
        margin-right: 0.5rem;
      }
    }
  }
`;

const StyledLi = styled.li`
  & h3 {
    margin-bottom: 10px;
  }
  & ul {
    padding-top: 10px;
    margin-left: 10px;
  }
`;

const ContentItem = styled.li`
  text-align: left;
  margin-left: 20px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;

  border: 1px solid #ddd;
`;
