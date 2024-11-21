import { IconProps } from "../utils/types";

const ProfileIcon: React.FC<IconProps> = ({ size = 60, className = "" }) => {
    const svgSize = `${size}px`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" fill="grey" />
            <circle cx="50" cy="40" r="15" fill="white" />
            <path d="M30,65 C30,55 70,55 70,65 C70,75 30,75 30,65 Z" fill="white" />
        </svg>
    );
};

export default ProfileIcon;
