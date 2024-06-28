import { atom } from "recoil";

interface UserProps {
  id: number;
  username: string;
  role: string;
}
export const userState = atom<UserProps | null>({
  key: "userState",
  default: null,
});
