import { IconProps } from "../utils/types";

const UpArrowLogo: React.FC<IconProps> = ({ size = 260, className = "" }) => {
  const svgSize = size;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 24 24" fill="none">
      <path d="M12 4l-8 8h5v4h6v-4h5l-8-8z" fill="white"/>
    </svg>
  );
};

export default UpArrowLogo;
