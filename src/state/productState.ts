import { atom } from "recoil";
import { ProductProps } from "../pages/types/ProductProps";

export const productState = atom<ProductProps[] | null>({
  key: "productState",
  default: null,
});
