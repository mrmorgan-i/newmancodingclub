import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaThreads, FaTwitter, FaXTwitter, FaYoutube, FaDiscord, FaSlack } from "react-icons/fa6";
import { SiGroupme } from "react-icons/si";

export const getPlatformIconByName = (platformName: string): JSX.Element | null => {
    switch (platformName) {
        case 'facebook': {
            return <FaFacebook size={24} className='min-w-fit' />;
        }
        case 'github': {
            return <FaGithub size={24} className='min-w-fit' />;
        }
        case 'instagram': {
            return <FaInstagram size={24} className='min-w-fit' />;
        }
        case 'linkedin': {
            return <FaLinkedin size={24} className='min-w-fit' />;
        }
        case 'threads': {
            return <FaThreads size={24} className='min-w-fit' />;
        }
        case 'twitter': {
            return <FaTwitter size={24} className='min-w-fit' />;
        } 
        case 'youtube': {
            return <FaYoutube size={24} className='min-w-fit' />;
        }
        case 'x': {
            return <FaXTwitter size={24} className='min-w-fit' />;
        }
        case 'discord': {
            return <FaDiscord size={24} className='min-w-fit' />;
        }
        case 'groupme': {
            return <SiGroupme size={24} className='min-w-fit' />;
        }
        case 'slack': {
            return <FaSlack size={24} className='min-w-fit' />;
        }
        default:
            console.log('Platform name not supported, no icon is returned:', platformName);
            return null;
    }
}