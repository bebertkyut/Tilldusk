import { useState } from "react";

// Custom hook to trigger spin on click, supports direction
export function useGearSpinOnClick() {
  const [angle, setAngle] = useState(0);

  const handleClick = (e) => {
    setAngle((prev) => prev + 180);
    if (typeof e === "function") e();
  };

  const spinMotion = {
    rotate: angle,
    transition: { duration: 0.4, ease: "linear" }
  };

  return [handleClick, spinMotion];
}

// Custom hook to trigger a "shake" animation for the bell icon
export function useBellShakeOnClick() {
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(false); // reset
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 400);
  };

  // Framer Motion keyframes for shake
  const shakeMotion = shake
    ? {
        // Keyframes for a shake effect
        rotate: [0, -15, 12, -8, 6, -4, 0],
        transition: { duration: 0.4, times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1] },
      }
    : { rotate: 0 };

  return [triggerShake, shakeMotion];
}

export const stackingAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 40 },
  transition: { duration: 0.25, ease: "easeOut" },
};