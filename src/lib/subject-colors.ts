"use client";

export const subjectColors: { [key: string]: { background: string; text: string } } = {
  "Tech": { background: "#FF7A5C", text: "#000000" },
  "Histoire": { background: "#F4D738", text: "#000000" },
  "Sports": { background: "#FF3057", text: "#000000" },
  "Langues": { background: "#5168FF", text: "#000000" },
  "Sciences": { background: "#A7DBD8", text: "#000000" },
  "Nature/Géographie": { background: "#48C748", text: "#000000" },
  "Arts/Pop Culture": { background: "#FF66B7", text: "#000000" },
};

export const getSubjectTagClasses = (subject: string) => {
  const colors = subjectColors[subject];
  const backgroundColor = colors ? colors.background : "#FFFFFF"; // Default to white if not found
  const textColor = colors ? colors.text : "#000000"; // Default to black if not found

  let baseClasses = "flex items-center justify-center px-2 border-2 border-black drop-shadow-custom-black rounded-[16px] font-normal whitespace-nowrap"; // Changed to drop-shadow-custom-black

  // Ajustements spécifiques pour la taille de la police et la hauteur de ligne
  if (subject === "Nature/Géographie") {
    baseClasses += " text-[9px] leading-[14px]";
  } else if (subject === "Arts/Pop Culture") {
    baseClasses += " text-[7px] leading-[10px]";
  } else {
    baseClasses += " text-xs leading-[18px]"; // Taille par défaut pour les autres
  }

  return {
    className: baseClasses,
    style: { backgroundColor, color: textColor }
  };
};

export const getSubjectDropdownItemClasses = (subject: string) => {
  const colors = subjectColors[subject];
  const backgroundColor = colors ? colors.background : "#FFFFFF";
  const textColor = colors ? colors.text : "#000000";

  return {
    style: { backgroundColor, color: textColor }
  };
};