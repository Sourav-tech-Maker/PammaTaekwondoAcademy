export const fadeIn = (duration = '1s') => {
  return `
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .fade-in {
      animation: fadeIn ${duration} ease-in forwards;
    }
  `;
};