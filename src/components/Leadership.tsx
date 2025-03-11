"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { leaders } from '@/data/leadership';
import { advisor } from '@/data/advisor';
import { ILeader, IAdvisor } from '@/types';

const Leadership: React.FC = () => {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-8 text-center">Student Officers</h3>
            <div className="grid gap-10 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
                {leaders.map((leader) => (
                    <LeaderCard key={leader.name} leader={leader} />
                ))}
            </div>
            
            <h3 className="text-2xl font-semibold mb-8 text-center">Faculty Advisor</h3>
            <div className="max-w-md mx-auto">
                {advisor.map((advisor) => (
                    <AdvisorCard key={advisor.name} advisor={advisor} />
                ))}
            </div>
        </div>
    );
};

// Separate component for each leader card
const LeaderCard = ({ leader }: { leader: ILeader }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-primary/20">
                {!imageError ? (
                    <Image
                        src={leader.avatar}
                        alt={`${leader.name} - ${leader.role}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 128px"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                        <FaUser className="w-16 h-16" />
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-semibold text-foreground">{leader.name}</h3>
            <p className="text-primary font-medium mb-3">{leader.role}</p>
            <p className="text-foreground-accent text-sm mb-4">{leader.bio}</p>
            
            <a 
                href={`mailto:${leader.contact}`}
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors duration-300"
            >
                <FaEnvelope className="mr-2" />
                Contact
            </a>
        </div>
    );
};

// Advisor
const AdvisorCard = ({ advisor }: { advisor: IAdvisor }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-secondary/20">
                {!imageError ? (
                    <Image
                        src={advisor.avatar}
                        alt={`${advisor.name} - ${advisor.role}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 128px"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/10 text-secondary">
                        <FaUser className="w-16 h-16" />
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-semibold text-foreground">{advisor.name}</h3>
            <p className="text-secondary font-medium mb-3">{advisor.role}</p>
            <p className="text-foreground-accent text-sm mb-4">{advisor.bio}</p>
            
            <a 
                href={`mailto:${advisor.contact}`}
                className="inline-flex items-center text-sm text-gray-600 hover:text-secondary transition-colors duration-300"
            >
                <FaEnvelope className="mr-2" />
                Contact
            </a>
        </div>
    );
};

export default Leadership;