import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5"
        >
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
                </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
            </div>

            <div className="text-center">
                <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground max-w-lg md:max-w-2xl mx-auto">{heroDetails.heading}</h1>
                <p className="mt-4 text-foreground max-w-lg mx-auto">{heroDetails.subheading}</p>
                <div className="mt-6">
                    <Link 
                        href="#join" 
                        className="bg-primary hover:bg-primary-accent text-white px-8 py-3 rounded-full transition-colors font-medium transform hover:scale-105 duration-300 hover:shadow-lg"
                    >
                        Join Us
                    </Link>
                </div>
                <div className="relative mt-12 md:mt-16 mx-auto z-10 max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-70 transform -rotate-3 scale-105"></div>
                    <Image
                        src={heroDetails.centerImageSrc}
                        width={384}
                        height={340}
                        quality={100}
                        sizes="(max-width: 768px) 100vw, 384px"
                        priority={true}
                        alt="Code editor with colorful syntax"
                        className='relative rounded-2xl shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-300'
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;