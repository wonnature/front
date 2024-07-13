import styled from "styled-components";
import { DropdownProps } from "../types/DropdownProps";

interface DropdownMenuProps {
  items: DropdownProps[];
  onSelectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  onSelectionChange,
}) => {
  return (
    <Select onChange={onSelectionChange}>
      <option value="">-- 선택하세요 --</option>
      {items.map((item, index) => (
        <option key={index} value={item.url}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};

const Select = styled.select`
  height: 35px;
  padding: 0 10px;

  -webkit-appearance: none; /* 크롬 화살표 없애기 */
  -moz-appearance: none; /* 파이어폭스 화살표 없애기 */
  appearance: none; /* 화살표 없애기 */
`;

export default DropdownMenu;
