"use client";

import { Plus, User } from "lucide-react";
import TypeWriter from "../TypeWriter";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Add constants outside component to prevent re-renders...
const aboutMeText = ` 
    Hi, I’m Athul — a developer who loves turning ideas into interactive, meaningful digital experiences. I’m someone who enjoys building things that not only work great, but also feel great to use. Whether it’s designing a smooth user interface, crafting a clean API, or optimizing performance, I enjoy every part of the process.

My journey into development started with simple curiosity… “How does this website work?” That question turned into late-night experiments, small personal projects, and eventually full-stack applications that solve real problems. Today, I build projects from scratch — from the frontend visuals to the backend logic — using tools I trust and enjoy working with.

I’m a big believer in clean code, simple UI, and learning continuously. Every project teaches me something new, and I love challenging myself to go a little further each time.

When I’m not coding, you’ll probably find me exploring new tech ideas, experimenting with 3D elements in React, fine-tuning animations, or improving older projects just because it’s fun.

➯ WHAT I WORK WITH

❑ Frontend Magic: React, Next.js, TypeScript, TailwindCSS, Framer Motion
❑ Backend Power: Node.js, Express.js, REST APIs, Authentication (JWT + Google OAuth)
❑ Full-Stack Flow: State Management, API Integration, SSR/CSR, Cloud Storage
❑ Databases I Trust: PostgreSQL (Neon), MongoDB, Firebase Firestore
❑ Tools I Live In: Git & GitHub, VS Code, Postman, Render, Netlify, Vercel
❑ Bonus Skills: Responsive Design, UI/UX Thinking, Performance Optimization, React Three Fiber (3D)

♡ Why I Love Building

A better UI.
A smarter backend.
A smoother experience.
A faster app.

I enjoy solving problems and watching ideas come to life — and that’s what keeps me building.

⟳ STATUS : #Open to work
    `.trim();

const contactText = `
    ✉ CONTACT INFORMATION

    ➮ Email: psathul073@gmail.com
    ➮ Github: https://github.com/psathul073
    ➮ Linkedin: https://www.linkedin.com/in/athul-fullstack
    ➮ Instagram: https://www.instagram.com/d9.coder
    `.trim();


function Terminal() {

    const [showAbout, setShowAbout] = useState<boolean>(false);
    const [showContacts, setShowContacts] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const userScrolledUpRef = useRef<boolean>(false);
    const router = useRouter();

    // handle scroll
    const handleScroll = useCallback(() => {
        const el = containerRef?.current;
        if (!el) return;
        const isAtBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

        userScrolledUpRef.current = !isAtBottom;
    }, []);


    // Mobile detection
    useEffect(() => {

        const checkMobile: () => void = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        const timeoutId: NodeJS.Timeout = setTimeout(checkMobile, 0);
        window.addEventListener("resize", checkMobile, { passive: true });

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", checkMobile);
        }
    }, []);

    const onKeyDown: (e: KeyboardEvent) => void = useCallback((e: KeyboardEvent) => {

        const { key, code } = e;

        const keys: string[] = ['Enter', 'Shift', 'KeyH', 'KeyG', 'KeyD'];
        const codes: string[] = ['KeyH', 'KeyG', 'KeyD'];

        // Set early return for non-relevant keys..
        if (!keys.includes(key) && !codes.includes(code)) return;

        if (!showAbout && key === "Enter") {
            setShowAbout(true);
            return;
        }
        if (showAbout && !showContacts && !loading && key === "Shift") {
            setShowContacts(true);
            return;
        }

        // Navigation handlers.
        switch (code) {
            case "KeyH":
                router.push('/contact');
                break;
            case "KeyG":
                window.open('https://github.com/psathul073', '_blank', 'noopener,noreferrer');
                break;
            case "KeyD":
                window.open('https://drive.google.com/file/d/1yAbsRhe0VZncBc8l9n4VTxNqeqSxk4CZ/view?usp=sharing', '_blank', 'noopener,noreferrer');
                break;

            default:
                break;
        }


    }, [showAbout, showContacts, loading, router],)


    useEffect(() => {
        const options = { passive: true };
        document.addEventListener("keydown", onKeyDown, options);
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown]);

    const quickActionClick: (key: string) => void = useCallback((key: string) => {
        switch (key) {
            case "H":
                router.push('/contact');
                break;
            case "G":
                window.open('https://github.com/psathul073', '_blank', 'noopener,noreferrer');
                break;
            case "D":
                window.open('https://drive.google.com/file/d/1yAbsRhe0VZncBc8l9n4VTxNqeqSxk4CZ/view?usp=sharing', '_blank', 'noopener,noreferrer');
                break;

            default:
                break;
        }
    }, [router]);

    // Memoize header part to prevent re-renders.
    const Header: JSX.Element = useMemo(() => (
        <div className="w-full inline-flex justify-between items-center gap-2 px-3 py-2 bg-neutral-900 rounded-2xl rounded-b-none font-fira-code">
            <div className=" inline-flex items-center justify-evenly gap-2.5 font-fira-code bg-neutral-800/50 p-2 rounded-t-2xl text-orange-100 ">
                <User size={18} className="shrink-0 text-orange-400" aria-hidden="true" />
                <p className=" max-sm:text-xs text-sm select-none">d9_coder@Iam-athul:~</p>
                <Plus size={18} className="shrink-0" aria-hidden="true" />
            </div>
            <div className=" inline-flex items-center justify-evenly gap-4">
                <div className=" w-3 h-3 rounded-full bg-lime-500" aria-hidden="true"></div>
                <div className=" w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true"></div>
                <div className=" w-3 h-3 rounded-full bg-red-500" aria-hidden="true"></div>
            </div>
        </div>
    ), []);

    // Memoize interactive elements
    const InterActiveElements: JSX.Element | null = useMemo(() => {
        if (!showContacts || loading) return null;
        return (
            <div className=" flex flex-col items-start space-y-3 font-fira-code">
                <button
                    onClick={() => isMobile && quickActionClick("H")}
                    className={` ${isMobile ? 'text-sm hover:text-lime-400 cursor-pointer' : 'cursor-text'
                        } transition-colors`}
                    aria-label={isMobile ? "Hire Me" : undefined}
                >
                    {isMobile ? 'Tap here to Hire Me' : 'Press `H` to Hire Me'}
                </button>
                <button
                    onClick={() => isMobile && quickActionClick("G")}
                    className={` ${isMobile ? 'text-sm hover:text-lime-400 cursor-pointer' : 'cursor-text'
                        } transition-colors`}
                    aria-label={isMobile ? "Visit GitHub" : undefined}
                >
                    {isMobile ? 'Tap here to Visit Github' : 'Press `G` to Visit Github'}
                </button>
                <button
                    onClick={() => isMobile && quickActionClick("D")}
                    className={` ${isMobile ? 'text-sm hover:text-lime-400 cursor-pointer' : 'cursor-text'
                        } transition-colors`}
                    aria-label={isMobile ? "Download Resume" : undefined}
                >
                    {isMobile ? 'Tap here to Download My Resume' : 'Press `D` to Download My Resume'}
                </button>
            </div>

        );
    }, [isMobile, showContacts, loading, quickActionClick]);

    return (
        <div className=" relative z-40 h-[600px] w-full max-w-[1440px] bg-neutral-950 border border-neutral-800/50 rounded-2xl p-[1] overflow-hidden">

            {/* Moving Border */}
            {<div className=" max-sm:hidden rotating-conic-border" aria-hidden="true"></div>}

            {/* Overlay */}
            <div className="absolute inset-px bg-neutral-950 rounded-2xl z-10"></div>

            {/* Main Content */}
            <div className="relative z-20 h-full overflow-hidden">
                {/* Header */}
                {Header}

                {/* Terminal Content */}
                <div ref={containerRef}
                    onScroll={handleScroll}
                    className=" relative h-[540px] p-3.5 space-y-4 mb-6 text-orange-100 cursor-text overflow-y-auto">

                    <p className=" text-sm text-lime-500">
                        d9_coder@Iam-athul : <span className="text-blue-500">~</span>
                        <span className="text-orange-50">$ About Me</span>
                    </p>

                    {/* Initial Prompt */}
                    {!showAbout &&
                        <button
                            onClick={() => isMobile && setShowAbout(true)}
                            className={`${isMobile ? ' text-sm hover:text-lime-400 cursor-pointer' : 'cursor-text'
                                } transition-colors`}
                            aria-label={isMobile ? "Show about me information" : undefined}
                        >
                            {isMobile ? 'Tap here to show about me info' : '⌨ Press `Enter` to show about me info ↲'}
                        </button>}

                    {/* About Me Content */}
                    {showAbout &&
                        <TypeWriter
                            text={aboutMeText.trim()}
                            textSpeed={isMobile ? 20 : 30}
                            loading={setLoading}
                            scrollContainerRef={containerRef}
                            userScrolledUpRef={userScrolledUpRef}
                        />}

                    {/* Contact Prompt */}
                    {(showAbout && !showContacts && !loading) &&
                        <button
                            onClick={() => isMobile && setShowContacts(true)}
                            className={` ${isMobile ? 'text-sm hover:text-lime-400 cursor-pointer' : 'cursor-text'
                                } transition-colors`}
                            aria-label={isMobile ? "Show contact information" : undefined}
                        >
                            {isMobile ? 'Tap here to show contact info' : '⌨ Press `Shift` to show contact info ⇪'}
                        </button>}

                    {/* Contact Information */}
                    {showContacts &&
                        <TypeWriter
                            text={contactText}
                            textSpeed={isMobile ? 20 : 30}
                            loading={setLoading}
                            scrollContainerRef={containerRef}
                            userScrolledUpRef={userScrolledUpRef}
                        />}

                    {/*Quick actions */}
                    {InterActiveElements}


                    <div ref={bottomRef} />

                </div>
            </div>
        </div>
    )
}

export default Terminal