"use client";

import Terminal from "../ui/Terminal";

import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.div 
        initial={{opacity: 0.5, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ ease: 'easeOut', duration: 0.5}}
        className=" absolute inset-0 flex items-center justify-center">
            <Terminal />
        </motion.div>
    )
}

export default About