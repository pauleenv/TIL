import * as React from "react";

const HomeInactive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none" // L'icône inactive n'a pas de remplissage
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2.5L2 12h3v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8h3L12 2.5Z"
      stroke="currentColor" // Utilise la couleur du texte parent
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22v-6a3 3 0 0 1 6 0v6"
      stroke="currentColor" // Utilise la couleur du texte parent
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HomeInactive;