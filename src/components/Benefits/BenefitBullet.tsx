import { IBenefitBullet } from "@/types"

const BenefitBullet: React.FC<IBenefitBullet> = ({ title, description, icon }: IBenefitBullet) => {
    return (
        <div className="flex flex-col items-center mt-8 gap-3 lg:gap-5 lg:flex-row lg:items-start animate-slide-in-left [animation-delay:var(--animation-delay,0ms)]">
            <div className="flex justify-center mx-auto lg:mx-0 flex-shrink-0 mt-3 w-fit">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-semibold">
                    {title}
                </h4>
                <p className="text-base text-foreground-accent">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default BenefitBullet