import { Project } from "../__mocks__/projects";
import { motion } from "framer-motion";
import { Users, Zap, Clock, Radius } from "lucide-react";
import { useState } from "react";
import Image, { StaticImageData } from "next/image";

// Import default placeholder image
import placeholderImage from "@/assets/placeholder.svg";
// Import project images
import brandCampaignCover from "@/assets/brand_campaign_cover.png";
import sqImage from "@/assets/sq.jpg";
import sqWebImage from "@/assets/sq_web.png";
import bitkeyImage from "@/assets/bitkey.png";

// Map of image names to their imported modules
const projectImages: Record<string, StaticImageData> = {
  "brand_campaign_cover.png": brandCampaignCover,
  "sq.jpg": sqImage,
  "sq_web.png": sqWebImage,
  "bitkey.png": bitkeyImage,
  "placeholder.svg": placeholderImage,
};

// Size configurations for different card layouts
const cardSizes = {
  large: {
    width: "w-[600px]",
    imageHeight: "h-96",
    marginBottom: "mb-6",
    padding: "px-6",
    titleSize: "text-xl",
    descriptionSize: "text-base",
    cardHeight: "h-auto",
  },
  stacked: {
    width: "w-[260px]",
    imageHeight: "h-34",
    marginBottom: "mb-3",
    padding: "px-4",
    titleSize: "text-lg",
    descriptionSize: "text-sm",
    cardHeight: "h-auto",
  },
  small: {
    width: "w-[400px]",
    imageHeight: "h-48",
    marginBottom: "mb-4",
    padding: "px-4",
    titleSize: "text-xl",
    descriptionSize: "text-sm",
    cardHeight: "h-min",
  },
};

// Function to determine card size based on index
const getCardSize = (index: number) => {
  if (index === 0) return cardSizes.large;
  if (index === 1 || index === 2) return cardSizes.stacked;
  return cardSizes.small;
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onNavigate?: (destination: string) => void;
}

export function ProjectCard({ project, index, onNavigate }: ProjectCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const coverImage = project.coverImage
    ? projectImages[project.coverImage] || placeholderImage
    : null;

  const size = getCardSize(index);

  const handleClick = () => {
    setIsExiting(true);
  };

  const CardContent = (
    <motion.div
      layout
      initial={{ opacity: 0, x: index === 0 ? 0 : 20 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        x: 0,
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: "easeOut",
        layout: { duration: 0.2 },
      }}
      className={`group p-0 pb-6 hover:cursor-pointer relative border border-border-subtle hover:border-border-prominent rounded-lg ${size.width} ${size.cardHeight} transition-colors duration-300 overflow-hidden`}
      onClick={handleClick}
    >
      {coverImage && (
        <div
          className={`relative w-full ${size.imageHeight} ${size.marginBottom}`}
        >
          <Image
            src={coverImage}
            alt={`${project.name} cover`}
            fill
            className={`object-cover`}
            priority={index < 2}
          />
        </div>
      )}

      <div
        className={`relative flex justify-between items-start mb-4 ${size.padding}`}
      >
        <div>
          <h3 className={`text-text-prominent ${size.titleSize}`}>
            {project.name}
          </h3>
          {/* <p
            className={`text-text-subtle line-clamp-2 ${size.descriptionSize}`}
          >
            {project.description}
          </p> */}
        </div>
      </div>

      <div
        className={`flex items-center justify-between text-sm text-text-subtle ${size.padding}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Users size={16} strokeWidth={1.5} />
            <span>{project.members}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Radius size={16} strokeWidth={1.5} />
            <span>{project.automations.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={16} strokeWidth={1.5} />
            <span>{project.capabilities}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Generate project path based on project name
  const projectPath = `project/${project.name
    .toLowerCase()
    .replace(/\s+/g, "-")}/`;

  return (
    <div onClick={() => onNavigate && onNavigate(projectPath)}>
      {CardContent}
    </div>
  );
}
