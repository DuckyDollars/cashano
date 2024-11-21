import { IconProps } from "../utils/types";

const Friends: React.FC<IconProps> = ({ size = 24, className = "" }) => {

    const svgSize = `${size}px`;

    return (
        <svg className={className} height={svgSize} width={svgSize} viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7461 27.0742C17.8242 27.0742 17.1758 26.9414 16.8008 26.6758C16.4336 26.418 16.25 26.0312 16.25 25.5156C16.25 24.7578 16.4766 23.9648 16.9297 23.1367C17.3828 22.3008 18.0391 21.5195 18.8984 20.793C19.7578 20.0586 20.793 19.4648 22.0039 19.0117C23.2227 18.5508 24.5898 18.3203 26.1055 18.3203C27.6289 18.3203 28.9961 18.5508 30.207 19.0117C31.4258 19.4648 32.4609 20.0586 33.3125 20.793C34.1719 21.5195 34.8281 22.3008 35.2812 23.1367C35.7422 23.9648 35.9727 24.7578 35.9727 25.5156C35.9727 26.0312 35.7852 26.418 35.4102 26.6758C35.0352 26.9414 34.3867 27.0742 33.4648 27.0742H18.7461ZM26.1172 16.2227C25.2734 16.2227 24.4961 15.9961 23.7852 15.543C23.0742 15.082 22.5039 14.4648 22.0742 13.6914C21.6445 12.9102 21.4297 12.0352 21.4297 11.0664C21.4297 10.1133 21.6445 9.25391 22.0742 8.48828C22.5117 7.72266 23.0859 7.11719 23.7969 6.67188C24.5078 6.22656 25.2812 6.00391 26.1172 6.00391C26.9531 6.00391 27.7266 6.22266 28.4375 6.66016C29.1484 7.09766 29.7188 7.69922 30.1484 8.46484C30.5781 9.22266 30.793 10.082 30.793 11.043C30.793 12.0195 30.5781 12.8984 30.1484 13.6797C29.7188 14.4609 29.1484 15.082 28.4375 15.543C27.7266 15.9961 26.9531 16.2227 26.1172 16.2227ZM6.08984 27.0742C5.34766 27.0742 4.81641 26.9297 4.49609 26.6406C4.18359 26.3594 4.02734 25.9531 4.02734 25.4219C4.02734 24.6172 4.22656 23.7969 4.625 22.9609C5.02344 22.1172 5.59375 21.3438 6.33594 20.6406C7.08594 19.9375 7.98828 19.3711 9.04297 18.9414C10.1055 18.5039 11.2969 18.2852 12.6172 18.2852C13.7109 18.2852 14.6797 18.4297 15.5234 18.7188C16.375 19 17.1289 19.3594 17.7852 19.7969C17.1523 20.2891 16.5938 20.8594 16.1094 21.5078C15.6328 22.1484 15.2578 22.8125 14.9844 23.5C14.7109 24.1875 14.5664 24.8438 14.5508 25.4688C14.5352 26.0938 14.6797 26.6289 14.9844 27.0742H6.08984ZM12.6172 16.4922C11.8906 16.4922 11.2148 16.293 10.5898 15.8945C9.97266 15.4961 9.47656 14.957 9.10156 14.2773C8.72656 13.5977 8.53906 12.8398 8.53906 12.0039C8.53906 11.168 8.72656 10.418 9.10156 9.75391C9.48438 9.08984 9.98438 8.56641 10.6016 8.18359C11.2266 7.79297 11.8984 7.59766 12.6172 7.59766C13.3438 7.59766 14.0156 7.78906 14.6328 8.17188C15.2578 8.54688 15.7578 9.06641 16.1328 9.73047C16.5078 10.3867 16.6953 11.1367 16.6953 11.9805C16.6953 12.8242 16.5078 13.5898 16.1328 14.2773C15.7578 14.957 15.2617 15.4961 14.6445 15.8945C14.0273 16.293 13.3516 16.4922 12.6172 16.4922Z" fill="currentColor"></path></svg>
    );
};

export default Friends;