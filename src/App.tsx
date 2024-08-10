import { useEffect } from "react";
import Router from "./Router";
import { useSetRecoilState } from "recoil";
import { userState } from "./state/userState";
import api from "./api";
import { headerState } from "./state/headerState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const setUser = useSetRecoilState(userState);
  const setCategories = useSetRecoilState(headerState);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await api.get(`/user/check`, {
        // skipInterceptor: true,
      });
      setUser(response.data.content);
      if (response.data?.content?.role === "ADMIN") {
        setCategories((prev) => [
          ...prev,
          {
            title: "관리자권한",
            subcategories: [
              { name: "제품 등록", url: "/product/write" },
              { name: "공지 등록", url: "/community/notice/write" },
              {
                name: "포토갤러리 등록",
                url: "/community/photo-gallery/write",
              },
              {
                name: "게시판 수정",
                url: "/board/write",
              },
              { name: "로그아웃", url: "/login" },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </>
  );
}

export default App;
