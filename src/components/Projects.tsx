import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { projects } from '@/data/projects';

const Projects: React.FC = () => {
    return (
        <div className="grid gap-14 max-w-lg w-full mx-auto lg:gap-8 lg:grid-cols-3 lg:max-w-full">
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="relative h-48 w-full">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Image
                                src={project.creator.avatar}
                                alt={`${project.creator.name} avatar`}
                                width={50}
                                height={50}
                                className="rounded-full shadow-sm"
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-primary">{project.creator.name}</h3>
                                <p className="text-sm text-foreground-accent">{project.creator.role}</p>
                            </div>
                        </div>
                        
                        <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                        <p className="text-foreground-accent mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex gap-3">
                            {project.codeLink && (
                                <Link href={project.codeLink} target="_blank" rel="noopener noreferrer" 
                                      className="flex items-center text-sm text-gray-600 hover:text-primary">
                                    <FaGithub className="mr-2" /> Code
                                </Link>
                            )}
                            
                            {project.demoLink && (
                                <Link href={project.demoLink} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center text-sm text-gray-600 hover:text-primary">
                                    <FaExternalLinkAlt className="mr-2" /> Demo
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Projects;