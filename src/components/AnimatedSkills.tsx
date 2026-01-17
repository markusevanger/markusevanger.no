"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useRef } from "react";

interface Skill {
  _id: string;
  name: string | null;
  url?: string | null;
  icon?: string | null;
}

interface AnimatedSkillsProps {
  skills: Skill[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween" as const,
      duration: 0.025,
    },
  },
};

function SkillItem({ skill }: { skill: Skill }) {
  const hasLink = !!skill.url;
  const hasIcon = !!skill.icon;
  const className =
    hasLink || hasIcon
      ? "inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-current hover:bg-markus-red hover:text-white hover:border-markus-red transition-colors"
      : "px-3 py-1 text-sm rounded-full border border-current";

  if (hasLink) {
    return (
      <motion.a
        href={skill.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        variants={itemVariants}
      >
        {hasIcon && <DynamicIcon name={skill.icon as IconName} size={14} />}
        {skill.name}
        <ArrowUpRight size={14} className="arrow-icon" />
      </motion.a>
    );
  }

  return (
    <motion.span className={className} variants={itemVariants}>
      {hasIcon && <DynamicIcon name={skill.icon as IconName} size={14} />}
      {skill.name}
    </motion.span>
  );
}

function StaticSkillItem({ skill }: { skill: Skill }) {
  const hasLink = !!skill.url;
  const hasIcon = !!skill.icon;
  const className =
    hasLink || hasIcon
      ? "inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-current hover:bg-markus-red hover:text-white hover:border-markus-red transition-colors"
      : "px-3 py-1 text-sm rounded-full border border-current";

  if (hasLink) {
    return (
      <a
        href={skill.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {hasIcon && <DynamicIcon name={skill.icon as IconName} size={14} />}
        {skill.name}
        <ArrowUpRight size={14} className="arrow-icon" />
      </a>
    );
  }

  return (
    <span className={className}>
      {hasIcon && <DynamicIcon name={skill.icon as IconName} size={14} />}
      {skill.name}
    </span>
  );
}

export default function AnimatedSkills({ skills }: AnimatedSkillsProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <StaticSkillItem key={skill._id} skill={skill} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap gap-2"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {skills.map((skill) => (
        <SkillItem key={skill._id} skill={skill} />
      ))}
    </motion.div>
  );
}
