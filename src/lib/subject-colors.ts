export const subjectColors: { [key: string]: { background: string; text: string } } = {
  "Tech": { background: "#FF7A5C", text: "#FFFFFF" },
  "Histoire": { background: "#F4D738", text: "#000000" }, // Texte noir pour un meilleur contraste sur le jaune
  "Sports": { background: "#FF3057", text: "#FFFFFF" },
  "Langues": { background: "#5168FF", text: "#FFFFFF" },
  "Sciences": { background: "#A7DBD8", text: "#000000" }, // Texte noir pour un meilleur contraste sur le bleu clair
  "Nature/Géographie": { background: "#48C748", text: "#FFFFFF" },
  "Arts/Pop Culture": { background: "#FF66B7", text: "#FFFFFF" },
};

export const getSubjectTagClasses = (subject: string) => {
  const colors = subjectColors[subject];
  if (colors) {
    return `bg-[${colors.background}] text-[${colors.text}]`;
  }
  // Fallback for subjects not in the map or default styling
  return "bg-primary/10 text-primary";
};