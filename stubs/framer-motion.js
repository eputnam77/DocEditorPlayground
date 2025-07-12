import React from "react";

// Minimal stub for framer-motion's motion component factory.
// Provides basic HTML elements without animation.
export const motion = {
  div: React.forwardRef(function MotionDiv(props, ref) {
    return <div ref={ref} {...props} />;
  }),
  section: React.forwardRef(function MotionSection(props, ref) {
    return <section ref={ref} {...props} />;
  }),
};
