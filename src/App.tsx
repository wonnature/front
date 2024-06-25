import { useEffect } from "react";
import Router from "./Router";
import { useSetRecoilState } from "recoil";
import { userState } from "./state/userState";
import api from "./api";
import { categories } from "./components/category";

function App() {
  const setUser = useSetRecoilState(userState);

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
        categories.pop();
        categories.push({
          title: "관리자권한",
          subcategories: [
            { name: "제품등록", url: "/product/write" },
            { name: "공지등록", url: "/community/notice/write" },
            { name: "로그아웃", url: "/login" },
            { name: "고객센터", url: "/customer-service" },
          ],
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <Router />
    </>
  );
}

export default App;
