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
  const baseClasses = "flex items-center justify-center w-[70px] h-[20px] border-2 border-black shadow-[3px_2px_0px_rgb(0,0,0)] rounded-[16px] font-normal text-xs leading-[18px] text-black";

  const colors = subjectColors[subject];
  if (colors) {
    return `${baseClasses} bg-[${colors.background}]`;
  }
  // Fallback pour les matières non définies ou le style par défaut
  return `${baseClasses} bg-white`;
};

export const getSubjectDropdownItemClasses = (subject: string) => {
  const colors = subjectColors[subject];
  if (colors) {
    return `bg-[${colors.background}] text-[${colors.text}]`;
  }
  return ""; // Par défaut, pas de style spécifique pour les éléments de menu déroulant
};