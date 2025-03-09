import React from 'react';
import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';
import { leaders } from '@/data/leadership';

const Leadership: React.FC = () => {
    return (
        <div className="grid gap-10 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
                <div key={leader.name} className="flex flex-col items-center text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
                        <Image
                            src={leader.avatar}
                            alt={`${leader.name} - ${leader.role}`}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 128px"
                        />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground">{leader.name}</h3>
                    <p className="text-primary font-medium mb-3">{leader.role}</p>
                    <p className="text-foreground-accent text-sm mb-4">{leader.bio}</p>
                    
                    <a 
                        href={`mailto:${leader.contact}`}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
                    >
                        <FaEnvelope className="mr-2" />
                        Contact
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Leadership;