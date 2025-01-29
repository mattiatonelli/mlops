import React, { useState } from "react";
import { LeftBar } from "./components/LeftBar/LeftBar";
import { RightBar } from "./components/RightBar/RightBar";

const App = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsToggled(!isToggled);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isToggled) {
      document.querySelector(".left-bar").classList.remove("toggled");
      document.querySelector(".section-button").classList.remove("toggled");
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isToggled) {
      document.querySelector(".left-bar").classList.add("toggled");
      document.querySelector(".section-button").classList.add("toggled");
    }
  };

  return (
    <>
      <LeftBar
        toggleSidebar={toggleSidebar}
        isToggled={isToggled}
        isHovered={isHovered}
        onHover={handleMouseEnter}
        onLeave={handleMouseLeave}
      />
      <RightBar />
    </>
  );
};

export default App;
