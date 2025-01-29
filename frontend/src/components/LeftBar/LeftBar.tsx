import React from "react";
import { TrendingUpDown } from "lucide-react";
import { ToggleButton } from "./components/ToggleButton";
import { SectionButton } from "./components/SectionButton";
import { LeftBarProps } from "../../shared/types/types";
import "./LeftBar.css";

export const LeftBar = ({
  toggleSidebar,
  isToggled,
  isHovered,
  onHover,
  onLeave,
}: LeftBarProps) => {
  return (
    <div
      className={`left-bar${isToggled ? " toggled" : ""}`}
      onMouseEnter={isToggled ? onHover : undefined}
      onMouseLeave={isToggled ? onLeave : undefined}
    >
      <ToggleButton toggleSidebar={toggleSidebar} isToggled={isToggled} />
      <SectionButton
        isToggled={isToggled}
        isHovered={isHovered}
        icon={<TrendingUpDown size={34} />}
        text="Example Text"
      />
      {/* {!isToggled && <InformationContainer />} */}
    </div>
  );
};
