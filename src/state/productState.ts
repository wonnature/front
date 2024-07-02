import { atom } from "recoil";
import { ProductProps } from "../pages/\btypes/ProductProps";

export const productState = atom<ProductProps[] | null>({
  key: "productState",
  default: null,
});
