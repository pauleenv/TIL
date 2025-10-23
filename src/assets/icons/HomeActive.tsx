import * as React from "react";

const HomeActive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    // Removed fill="none" from the root SVG to ensure paths' fill="currentColor" is respected
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2.5L2 12h3v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8h3L12 2.5Z"
      fill="currentColor" // Utilise la couleur du texte parent pour le remplissage
      stroke="currentColor" // Utilise la couleur du texte parent pour le contour
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22v-6a3 3 0 0 1 6 0v6"
      fill="currentColor" // Utilise la couleur du texte parent pour le remplissage
      stroke="currentColor" // Utilise la couleur du texte parent pour le contour
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HomeActive;