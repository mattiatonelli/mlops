import React from "react";
import { SectionButtonProps } from "../../../shared/types/types";
import "./SectionButton.css";

export const SectionButton = ({
  isToggled,
  isHovered,
  icon,
  text,
}: SectionButtonProps) => {
  return (
    <div className="section-button-container">
      <button
        className={`section-button${isToggled || isHovered ? " toggled" : ""}`}
      >
        <span className="icon">{icon}</span>
        {(!isToggled || isHovered) && <span>{text}</span>}
      </button>
    </div>
  );
};
