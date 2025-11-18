import Image from "next/image";

type LogoProps = {
    variant?: "absolute" | "inline";
    className?: string;
};

export default function Logo({ variant = "absolute", className }: LogoProps) {
    function clsx(...inputs: Array<string | false | null | undefined>): string {
        return inputs.filter(Boolean).join(" ");
    }

    const wrapper = clsx(
        "inline-flex items-center gap-2",
        variant === "absolute" && "absolute left-4 top-4",
        className,
    );

    const content = (
        <>
            <Image
                src="/logo.png"
                alt="Athena"
                width={40}
                height={40}
                priority
                className="block dark:hidden"
            />
            <Image
                src="/logo-dark.png"
                alt="Athena"
                width={40}
                height={40}
                priority
                className="hidden dark:block"
            />
            <span className="text-2xl font-semibold text-foreground">Athena</span>
        </>
    );

    return <div className={wrapper}>{content}</div>;
}
