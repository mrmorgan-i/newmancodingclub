import { FiCode, FiUsers, FiBook, FiLayers, FiAward, FiTarget, FiGlobe, FiCpu, FiStar } from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Learn Coding Skills",
        description: "Develop programming abilities in a supportive environment, no matter your experience level. We believe coding should be accessible to everyone.",
        bullets: [
            {
                title: "Hands-on Workshops",
                description: "Regular coding sessions on various languages and frameworks from HTML to Python.",
                icon: <FiCode size={26} />
            },
            {
                title: "Skill-Building Resources",
                description: "Access to tutorials, online courses, and learning materials to enhance your skills.",
                icon: <FiBook size={26} />
            },
            {
                title: "Beginner-Friendly Approach",
                description: "No prior experience needed—we'll help you start from scratch.",
                icon: <FiStar size={26} />
            }
        ],
        imageSrc: "/images/mockup-1.jpg"
    },
    {
        title: "Build Real Projects",
        description: "Put theory into practice by working on meaningful projects. Gain portfolio-worthy experience that stands out to employers.",
        bullets: [
            {
                title: "Collaborative Development",
                description: "Work with other members on semester-long coding projects.",
                icon: <FiUsers size={26} />
            },
            {
                title: "Hackathons & Competitions",
                description: "Participate in coding challenges to test your skills in a fun environment.",
                icon: <FiAward size={26} />
            },
            {
                title: "Project Showcases",
                description: "Demonstrate your work to peers and potential employers at end-of-semester events.",
                icon: <FiLayers size={26} />
            }
        ],
        imageSrc: "/images/mockup-2.jpg"
    },
    {
        title: "Connect With Opportunities",
        description: "Network with industry professionals and discover career paths in technology fields.",
        bullets: [
            {
                title: "Guest Speaker Events",
                description: "Learn from professionals working in various technology fields.",
                icon: <FiGlobe size={26} />
            },
            {
                title: "Industry Connections",
                description: "Build relationships with local tech companies and potential employers.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Career Development",
                description: "Get guidance on internships, job applications, and technical interviews.",
                icon: <FiCpu size={26} />
            }
        ],
        imageSrc: "/images/mockup-3.jpg"
    },
]