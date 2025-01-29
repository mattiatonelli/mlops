export interface ToggleButtonProps {
    toggleSidebar: () => void;
    isToggled: boolean;
}

export interface LeftBarProps extends ToggleButtonProps {
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}

import { LucideIcon } from 'lucide-react';
export interface SectionButtonProps {
    isToggled: boolean;
    isHovered: boolean;
    icon: LucideIcon,
    text: string,
}