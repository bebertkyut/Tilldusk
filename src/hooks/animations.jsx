import { useState } from "react";

// Custom hook to trigger spin on click, supports direction
export function useSpinOnClick() {
  const [angle, setAngle] = useState(0);

  // Pass direction: 1 for forward, -1 for reverse
  const handleClick = (direction = 1, e) => {
    setAngle((prev) => prev + 180 * direction);
    if (typeof e === "function") e();
  };

  const spinMotion = { rotate: angle };

  return [handleClick, spinMotion];
}