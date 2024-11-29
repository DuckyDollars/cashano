import { IconProps } from "../utils/types";

const ClipboardIcon: React.FC<IconProps> = ({ size = 28, className = "" }) => {
  const svgSize = `${size}px`;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      width={svgSize} 
      height={svgSize} 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="#fff" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="1.5"
    >
      <path d="m11.25 4.25v-2.5h-9.5v9.5h2.5m.5-6.5v9.5h9.5v-9.5z"/>
    </svg>
  );
};

export default ClipboardIcon;
