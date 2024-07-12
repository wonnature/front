import { atom } from "recoil";

interface Subcategory {
  name: string;
  url: string;
}

interface HeaderProps {
  title: string;
  subcategories: Subcategory[];
}

export const headerState = atom<HeaderProps[]>({
  key: "headerState",
  default: [
    {
      title: "회사소개",
      subcategories: [
        { name: "학교기업 '원네이처'", url: "/introduce/intro" },
        { name: "인사말", url: "/introduce/greeting" },
        { name: "설립목적", url: "/introduce/purpose" },
        { name: "연혁", url: "/introduce/history" },
        { name: "사업분야", url: "/introduce/business-field" },
        { name: "약도", url: "/introduce/map" },
      ],
    },
    {
      title: "제품소개 및 구매",
      subcategories: [
        { name: "화장품/식품", url: "/product" },
        { name: "기념품", url: "/shipping-info" },
      ],
    },
    {
      title: "화장품품질검사",
      subcategories: [
        { name: "화장품 시험·검사 서비스", url: "/quality-test/service" },
        { name: "기계보유현황", url: "/quality-test/result" },
        { name: "품질검사 및 검사항목", url: "/quality-test/category" },
        { name: "품질검사 신청", url: "/quality-test/apply" },
      ],
    },
    {
      title: "커뮤니티",
      subcategories: [
        { name: "공지사항", url: "/community/notice" },
        { name: "포토갤러리", url: "/community/photo-gallery" },
        { name: "현장실습", url: "/community/practice" },
        { name: "로그인/로그아웃", url: "/login" },
      ],
    },
  ],
});
