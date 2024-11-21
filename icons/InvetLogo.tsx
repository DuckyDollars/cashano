import { IconProps } from "../utils/types";

const InvestLogo: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  const svgSize = size;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 100 100" fill="none">
      {/* Arrow Shape */}
      <path 
        d="M20 70 L50 30 L80 70" 
        stroke="white" 
        stroke-width="6" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      {/* Rectangle Base for Stability */}
      <rect 
        x="35" 
        y="70" 
        width="30" 
        height="15" 
        fill="white" 
        rx="7"
      />
      {/* Arrow Tip */}
      <circle cx="50" cy="30" r="4" fill="white" />
    </svg>
  );
};

export default InvestLogo;
