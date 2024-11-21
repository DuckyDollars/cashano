import { IconProps } from "../utils/types";

const KYCLogo: React.FC<IconProps> = ({ size = 28, className = "" }) => {
  const svgSize = `${size}px`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 200 200" fill="none">
      {/* Shield Background */}
      <path
        d="M100 20 L150 50 L150 150 L100 180 L50 150 L50 50 Z"
        fill="#1a73e8"
        stroke="black"
        strokeWidth="5"
      />
      {/* KYC Text */}
      <text x="50%" y="50%" textAnchor="middle" fontSize="40" fontFamily="Arial" fill="white" dy="10">
        KYC
      </text>
    </svg>
  );
};

export default KYCLogo;
