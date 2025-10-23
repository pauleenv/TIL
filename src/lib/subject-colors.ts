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
  // Classes de base pour le tag affiché (style pilule)
  let baseClasses = "flex items-center justify-center w-[70px] h-[20px] border-2 border-black shadow-[3px_2px_0px_rgb(0,0,0)] rounded-[16px] font-normal text-black";

  // Ajustements spécifiques pour la taille de la police et la hauteur de ligne
  if (subject === "Nature/Géographie") {
    baseClasses += " text-[9px] leading-[14px]";
  } else if (subject === "Arts/Pop Culture") {
    baseClasses += " text-[7px] leading-[10px]";
  } else {
    baseClasses += " text-xs leading-[18px]"; // Taille par défaut pour les autres
  }

  // Convertir le nom du sujet en kebab-case pour correspondre aux variables CSS
  const cssVarName = subject.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // Utiliser la variable CSS pour la couleur de fond
  return `${baseClasses} bg-[var(--subject-${cssVarName}-bg)]`;
};

export const getSubjectDropdownItemClasses = (subject: string) => {
  const colors = subjectColors[subject];
  if (colors) {
    return `bg-[${colors.background}] text-[${colors.text}]`;
  }
  return ""; // Par défaut, pas de style spécifique pour les éléments de menu déroulant
};