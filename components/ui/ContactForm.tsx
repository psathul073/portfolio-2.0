"use client";

import { useToast } from "d9-toast";
import { Loader, MailCheck, SendHorizontal } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";



const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25,
            delayChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1], // smooth iOS-like
        },
    },
};


export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { sounds, showToast } = useToast();
    const formRef = useRef<HTMLFormElement | null>(null);

    /* Mobile detection */
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    /*  Submit handler */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const body = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                showToast({
                    message: "Message sent",
                    type: "success",
                    theme: "dark",
                    title: false,
                    audio: { audioFile: sounds.success },
                });
                formRef.current?.reset();
            }
        } catch {
            showToast({
                message: "Error sending message",
                type: "error",
                theme: "dark",
                title: false,
                audio: { audioFile: sounds.error },
            });
        } finally {
            setLoading(false);
        }
    };


    const containerClass = useMemo(
        () =>
            isMobile
                ? "relative w-full h-[520px] bg-[#0B0B0E]/95 rounded-2xl border border-[#C89B3C]/20 "
                : "relative w-full sm:w-xl h-[520px] bg-[#0B0B0E]/95 rounded-2xl shadow-[0_0_40px_rgba(200,155,60,0.15)] z-40",
        [isMobile]
    );

    return (
        <motion.div
            className={containerClass}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* background */}
            <div className="absolute inset-px bg-neutral-950 rounded-2xl" />

            {/* content */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Heading */}
                <motion.h2
                    variants={itemVariants}
                    className="pt-6 px-6 text-lg font-semibold font-fira-code text-[#E8C67A]"
                >
                    Contact Me
                </motion.h2>

                {/* Form */}
                <motion.form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex-1 flex flex-col max-sm:p-3 p-6 space-y-8"
                >
                    <motion.input
                        variants={itemVariants}
                        name="name"
                        placeholder="Name"
                        required
                        className="p-3 bg-[#121215] rounded-xl text-white border border-[#2A2A2F] focus:ring-2 focus:ring-[#E2B857]/30"
                    />

                    <motion.input
                        variants={itemVariants}
                        name="email"
                        placeholder="Email"
                        required
                        className="p-3 bg-[#121215] rounded-xl text-white border border-[#2A2A2F] focus:ring-2 focus:ring-[#E2B857]/30"
                    />

                    <motion.textarea
                        variants={itemVariants}
                        name="message"
                        placeholder="Message"
                        required
                        className="p-3 h-32 bg-[#121215] rounded-xl text-white border border-[#2A2A2F] resize-none focus:ring-2 focus:ring-[#E2B857]/30"
                    />

                    <motion.button
                        variants={itemVariants}
                        disabled={loading || isSuccess}
                        type="submit"
                        className=" relative inline-flex items-center justify-center gap-2 p-3 top-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#EAC46D] text-black font-semibold hover:scale-[1.02] active:scale-[0.97] transition disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <>
                                Sending <Loader className="animate-spin" />
                            </>
                        ) : isSuccess ? (
                            <>
                                Sent <MailCheck />
                            </>
                        ) : (
                            <>
                                Send Message <SendHorizontal />
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    );
}
