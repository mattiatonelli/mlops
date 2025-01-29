import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ToggleButtonProps } from "../../../shared/types/types";
import "./ToggleButton.css";

export const ToggleButton = ({
  toggleSidebar,
  isToggled,
}: ToggleButtonProps) => {
  return (
    <div className="toggle-button-container">
      <div className="toggle-button" onClick={toggleSidebar}>
        {isToggled ? <ChevronRight /> : <ChevronLeft />}
      </div>
    </div>
  );
};
