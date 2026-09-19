import React from 'react';
import {
  LayoutGrid,
  Layers,
  Scissors,
  FileArchive,
  RotateCw,
  Stamp,
  Hash,
  FileImage,
  Image,
  Info,
  Minimize2,
  Scaling,
  RefreshCw,
  Crop,
  FlipHorizontal,
  ShieldCheck,
  Boxes,
  FileText,
  Sparkles,
  PenTool,
  Code,
  Maximize2,
  LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  LayoutGrid,
  Layers,
  Scissors,
  FileArchive,
  RotateCw,
  Stamp,
  Hash,
  FileImage,
  Image,
  Info,
  Minimize2,
  Scaling,
  RefreshCw,
  Crop,
  FlipHorizontal,
  ShieldCheck,
  Boxes,
  FileText,
  Sparkles,
  PenTool,
  Code,
  Maximize2,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || FileText;
  return <IconComponent {...props} />;
};
