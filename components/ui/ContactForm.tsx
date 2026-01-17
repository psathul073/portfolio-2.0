"use client";

import { toast } from "d9-toast";
import { AtSign, Instagram, Linkedin, Loader, MailCheck, SendHorizontal } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";



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
                toast.success("Message sent",{
                    theme: "dark",
                    title: false,
                    audio: { audioFile: toast.sounds.success },
                });
                formRef.current?.reset();
            }
        } catch {
            toast.error("Error sending message",{
                theme: "dark",
                title: false,
                audio: { audioFile: toast.sounds.error },
            });
        } finally {
            setLoading(false);
        }
    };


    const containerClass = useMemo(
        () =>
            isMobile
                ? "relative w-full h-fit bg-[#0B0B0E]/95 rounded-2xl border border-white/15 "
                : "relative w-full sm:w-xl h-fit bg-[#0B0B0E]/95 rounded-2xl shadow-[0_0_40px_rgba(200,155,60,0.15)] border border-white/10 z-40",
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
                    Contact Me<span className="text-green-500">.</span>
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
                        className=" relative inline-flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#EAC46D] max-sm:text-base text-black font-semibold hover:scale-[1.02] active:scale-[0.97] transition disabled:cursor-not-allowed cursor-pointer"
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
                                Send Message <SendHorizontal strokeWidth={1.5} />
                            </>
                        )}
                    </motion.button>

                    {/* Or */}
                    <motion.div variants={itemVariants} className=" flex flex-row max-sm:flex-col gap-3.5 pb-2 items-center justify-between">
                        <p className=" text-zinc-400">
                            Or get in touch with me :
                        </p>
                        <div
                            className=" inline-flex items-center gap-6 text-zinc-400">
                            <Link title="Email" aria-label="Email" href={"mailto:psathul073@gmail.com"}>
                                <AtSign strokeWidth={1.2} className=" transition-colors hover:text-green-600 active:text-green-600" />
                            </Link>
                            <Link title="Linkedin" aria-label="Linkedin" href={"https://www.linkedin.com/in/athul-fullstack/"}>
                                <Linkedin strokeWidth={1.2} className=" transition-colors hover:text-blue-600 active:text-blue-600" />
                            </Link>
                            <Link title="Instagram" aria-label="Instagram" href={"https://www.instagram.com/d9.coder/"}>
                                <Instagram strokeWidth={1.2} className="transition-colors hover:text-pink-600 active:text-pink-600" />
                            </Link>
                        </div>
                    </motion.div>

                </motion.form>
            </div>

        </motion.div>
    );
}
