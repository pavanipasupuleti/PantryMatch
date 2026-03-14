
  
import { IoIosClose } from "react-icons/io";

function IngredientChip({ name, onRemove }) {
  return (
    <span className="ingredient-chip">
      {name}
      <IoIosClose
        className="chip-remove"
        onClick={onRemove}
      />
    </span>
  );
}

export default IngredientChip;

