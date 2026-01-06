// import IngredientChip from "./IngredientChip";

// function PantryList({ pantry }) {
//   if (pantry.length === 0) {
//     return <p className="empty-text">Your pantry is empty.</p>;
//   }

//   return (
//     <div className="pantry-list">
//       {pantry.map((item) => (
//         <IngredientChip key={item} name={item} />
//       ))}
//     </div>
//   );
// }

// export default PantryList;

import IngredientChip from "./IngredientChip";

function PantryList({ pantry, setPantry }) {
  if (pantry.length === 0) {
    return <p className="empty-text">Your pantry is empty.</p>;
  }

  return (
    <div className="pantry-list">
      {pantry.map((item) => (
        <IngredientChip
          key={item}
          name={item}
          onRemove={() =>
            setPantry(pantry.filter(p => p !== item))
          }
        />
      ))}
    </div>
  );
}

export default PantryList;

