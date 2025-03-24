import { FaUsers, FaCode, FaLaptopCode } from "react-icons/fa";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "0 to Code",
        icon: <FaCode size={34} className="text-blue-500" />,
        description: "No prior experience required. Everyone is welcome, regardless of major or coding background."
    },
    {
        title: "1+ Meetings",
        icon: <FaUsers size={34} className="text-yellow-500" />,
        description: "Monthly gatherings with workshops, guest speakers, and collaborative coding sessions."
    },
    {
        title: "∞ Possibilities",
        icon: <FaLaptopCode size={34} className="text-green-600" />,
        description: "Unlimited learning opportunities from web development to artificial intelligence and beyond."
    }
];