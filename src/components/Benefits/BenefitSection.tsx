"use client"
import Image from "next/image";
import clsx from "clsx";
import { motion, Variants } from "framer-motion"

import BenefitBullet from "./BenefitBullet";
import SectionTitle from "../SectionTitle";
import { IBenefit } from "@/types";

interface Props {
    benefit: IBenefit;
    imageAtRight?: boolean;
}

const containerVariants: Variants = {
    offscreen: {
        opacity: 0,
        y: 100
    },
    onscreen: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 0.9,
            delayChildren: 0.2,
            staggerChildren: 0.1,
        }
    }
};

export const childVariants = {
    offscreen: {
        opacity: 0,
        x: -50,
    },
    onscreen: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 1,
        }
    },
};

const BenefitSection: React.FC<Props> = ({ benefit, imageAtRight }: Props) => {
    const { title, description, imageSrc, bullets } = benefit;

    return (
        <section className="benefit-section">
            <motion.div
                className="flex flex-wrap flex-col items-center justify-center gap-2 lg:flex-row lg:gap-20 lg:flex-nowrap mb-24"
                variants={containerVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
            >
                <div
                    className={clsx("flex flex-wrap items-center w-full max-w-lg", { "justify-start": imageAtRight, "lg:order-1 justify-end": !imageAtRight })}
                    
                >
                    <div className="w-full text-center lg:text-left">
                        <motion.div
                            className="flex flex-col w-full"
                            variants={childVariants}
                        >
                            <SectionTitle>
                                <h3 className="lg:max-w-2xl">
                                    {title}
                                </h3>
                            </SectionTitle>

                            <p className="mt-1.5 mx-auto lg:ml-0 leading-normal text-foreground-accent">
                                {description}
                            </p>
                        </motion.div>

                        <div className="mx-auto lg:ml-0 w-full">
                            {bullets.map((item, index) => (
                                <BenefitBullet key={index} title={item.title} icon={item.icon} description={item.description} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={clsx("mt-5 lg:mt-0", { "lg:order-2": imageAtRight })}>
                    <div className={clsx("w-fit flex relative group", { "justify-start": imageAtRight, "justify-end": !imageAtRight })}>
                        {/* Add decorative elements */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="absolute inset-0 bg-white/50 rounded-3xl backdrop-blur-3xl"></div>
                        
                        {/* Image with enhancements */}
                        <Image 
                            src={imageSrc} 
                            alt={title} 
                            width="384" 
                            height="762" 
                            quality={100} 
                            className="lg:ml-0 relative rounded-2xl shadow-lg transform group-hover:scale-[1.02] transition-all duration-500 z-10 border border-white/20"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default BenefitSection