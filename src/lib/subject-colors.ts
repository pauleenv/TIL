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
  // Classes de base pour le tag affiché (style pilule)
  // Suppression de la largeur fixe (w-[70px]) et ajout de padding horizontal (px-2)
  let baseClasses = "flex items-center justify-center h-[20px] px-2 border-2 border-black shadow-[3px_2px_0px_rgb(0,0,0)] rounded-[16px] font-normal text-black whitespace-nowrap";

  // Ajustements spécifiques pour la taille de la police et la hauteur de ligne
  if (subject === "Nature/Géographie") {
    baseClasses += " text-[9px] leading-[14px]";
  } else if (subject === "Arts/Pop Culture") {
    baseClasses += " text-[7px] leading-[10px]";
  } else {
    baseClasses += " text-xs leading-[18px]"; // Taille par défaut pour les autres
  }

  // Convertir le nom du sujet en kebab-case pour correspondre aux noms de classes Tailwind
  let tailwindColorName = subject
    .toLowerCase()
    .replace(/é/g, 'e') // Remplacer 'é' par 'e'
    .replace(/\//g, '-') // Remplacer '/' par '-'
    .replace(/[^a-z0-9-]/g, ''); // Supprimer tout autre caractère non alphanumérique ou non-tiret

  // Utiliser la classe Tailwind générée
  return `${baseClasses} bg-subject-${tailwindColorName}`;
};

export const getSubjectDropdownItemClasses = (subject: string) => {
  // Convertir le nom du sujet en kebab-case pour correspondre aux noms de classes Tailwind
  let tailwindColorName = subject
    .toLowerCase()
    .replace(/é/g, 'e')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Utiliser la classe Tailwind générée pour le fond et s'assurer que le texte est noir
  return `bg-subject-${tailwindColorName} text-black`;
};