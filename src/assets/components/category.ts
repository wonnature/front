interface Subcategory {
  name: string;
  url: string;
}

interface Category {
  title: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
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
      { name: "화장품", url: "/products" },
      { name: "식품", url: "/purchase-info" },
      { name: "기념품", url: "/shipping-info" },
    ],
  },
  {
    title: "화장품품질검사",
    subcategories: [
      { name: "화장품 시험·검사 서비스", url: "/inspection-services" },
      { name: "기계보유현황", url: "/inspection-results" },
      { name: "품질검사 및 검사항목", url: "/inspection-apply" },
      { name: "품질검사 신청", url: "/inspection-apply" },
    ],
  },
  {
    title: "커뮤니티",
    subcategories: [
      { name: "공지사항", url: "/announcements" },
      { name: "이벤트", url: "/events" },
      { name: "고객센터", url: "/customer-service" },
    ],
  },
];
