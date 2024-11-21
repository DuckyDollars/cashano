import { IconProps } from "../utils/types";

const DownArrowLogo: React.FC<IconProps> = ({ size = 260, className = "" }) => {
  const svgSize = size;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 24 24" fill="none">
      <path d="M12 20l8-8h-5v-4h-6v4h-5l8 8z" fill="white"/>
    </svg>
  );
};

export default DownArrowLogo;
