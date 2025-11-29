"use client";

import { Loader, MailCheck, SendHorizontal } from "lucide-react";
import { motion, Variants } from "motion/react";
import { FormEvent, useState, useEffect, useMemo } from "react";

// motion variants.
const containerVariants: Variants = {
    hidden: {
        opacity: 0.5,
        scale: 0.6
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

function ContactForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Enable animations only after mount and only on desktop...
            if (!mobile) {
                timerId = setTimeout(() => setShouldAnimate(true), 100);
            }
        };

        const timeoutId = setTimeout(checkMobile, 0);
        window.addEventListener("resize", checkMobile, { passive: true });

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(timerId);
            window.removeEventListener("resize", checkMobile);
        }
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const body = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            const data = await res.json();
            setLoading(false);
            setIsSuccess(data.success);
            setMessage(data.success ? "Message sent!" : "Error sending message");
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            setMessage("Error sending message");
        }
    };

    // Memoized form configuration.
    const formConfig = useMemo(() => ({
        containerClass: isMobile
            ? "relative w-full h-[520px] bg-neutral-950 rounded-2xl z-40 overflow-hidden border border-orange-500/20"
            : "relative w-full sm:w-xl h-[520px] bg-neutral-950 shadow-3xl shadow-orange-400/10 rounded-2xl z-40 overflow-hidden",

        buttonClass: isMobile
            ? "inline-flex items-center justify-center gap-1.5 text-lg p-2.5 bg-orange-900/50 rounded-xl text-orange-200 font-semibold hover:bg-orange-900/60 transition-colors cursor-pointer mt-2 disabled:opacity-50"
            : "inline-flex items-center justify-center gap-1.5 text-lg p-2.5 bg-orange-900/50 shadow-3xl shadow-orange-900/30 rounded-xl text-orange-200 font-semibold hover:bg-orange-900/60 transition-colors cursor-pointer mt-2 disabled:opacity-50 ",

        spacingClass: isMobile ? "p-4 space-y-6" : "p-6 space-y-8",
    }), [isMobile]);

    // form component with conditional animations.
    const FormComponent = shouldAnimate ? motion.div : "div";
    const FormHeading = shouldAnimate ? motion.h2 : "h2";
    const FormMessage = shouldAnimate ? motion.p : "p";
    const FormInput = shouldAnimate ? motion.input : "input";
    const FormTextarea = shouldAnimate ? motion.textarea : "textarea";
    const FormButton = shouldAnimate ? motion.button : "button";

    return (
        <FormComponent
            initial={shouldAnimate ? "hidden" : undefined}
            animate={shouldAnimate ? "visible" : undefined}
            variants={shouldAnimate ? containerVariants : undefined}
            className={formConfig.containerClass}
        >
            {/* Rotating border only on desktop with animations */}
            {shouldAnimate && <div className="rotating-conic-border"></div>}

            <div className="absolute inset-px bg-neutral-950 rounded-2xl z-10"></div>

            <div className="relative z-20 h-full flex flex-col">
                <FormHeading
                    variants={shouldAnimate ? itemVariants : undefined}
                    className="py-6 px-6 text-lg font-semibold font-fira-code text-orange-200"
                >
                    Contact Me
                </FormHeading>

                {message && (
                    <FormMessage
                        variants={shouldAnimate ? itemVariants : undefined}
                        className={`${isSuccess ? 'text-green-500' : 'text-red-500'} w-full text-center font-fira-code text-sm`}
                    >
                        {message}
                    </FormMessage>
                )}

                <form onSubmit={handleSubmit} className={`flex-1 flex flex-col ${formConfig.spacingClass}`}>
                    <FormInput
                        variants={shouldAnimate ? itemVariants : undefined}
                        name="name"
                        placeholder="Name"
                        autoComplete="name"
                        required
                        className="p-3 bg-gray-900/10 rounded-md text-orange-200 placeholder-orange-200 border border-orange-600/20 focus:outline-none focus:border-orange-400"
                    />
                    <FormInput
                        variants={shouldAnimate ? itemVariants : undefined}
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                        className="p-3 bg-gray-900/10 rounded-md text-orange-200 placeholder-orange-200 border border-orange-600/20 focus:outline-none focus:border-orange-400"
                    />
                    <FormTextarea
                        variants={shouldAnimate ? itemVariants : undefined}
                        name="message"
                        placeholder="Message"
                        required
                        className="p-3 min-h-32 bg-gray-900/10 rounded-md text-orange-200 placeholder-orange-200 border border-orange-600/20 focus:outline-none focus:border-orange-400 resize-none"
                    />

                    <FormButton
                        variants={shouldAnimate ? itemVariants : undefined}
                        disabled={ loading || isSuccess}
                        type="submit"
                        className={formConfig.buttonClass}
                    >
                        {loading ? <>Sending... <Loader className="animate-spin" /></>
                            : isSuccess ? <>Message Sended <MailCheck strokeWidth={1.6} /></>
                                : <>Send Message <SendHorizontal strokeWidth={1.6} /></>}
                    </FormButton>
                </form>
            </div>
        </FormComponent>
    );
}

export default ContactForm;