"use client";

export const subjectColors: { [key: string]: { background: string; text: string } } = {
  "Tech": { background: "#A7DBD8", text: "#000000" }, // Bleu-vert apaisant
  "Histoire": { background: "#E0BBE4", text: "#000000" }, // Ocre doux
  "Sports": { background: "#FFC72C", text: "#000000" }, // Orange terreux
  "Langues": { background: "#957DAD", text: "#000000" }, // Bleu lavande
  "Sciences": { background: "#DAF7A6", text: "#000000" }, // Vert clair
  "Nature/Géographie": { background: "#87CEEB", text: "#000000" }, // Bleu ciel
  "Arts/Pop Culture": { background: "#FFDAB9", text: "#000000" }, // Rose poudré
};

export const getSubjectTagClasses = (subject: string) => {
  const colors = subjectColors[subject];
  const backgroundColor = colors ? colors.background : "#FFFFFF"; // Default to white if not found
  const textColor = colors ? colors.text : "#000000"; // Default to black if not found

  let baseClasses = "flex items-center justify-center px-2 border-2 border-black shadow-[3px_2px_0px_rgb(0,0,0)] rounded-[16px] font-normal whitespace-nowrap";

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