import "@testing-library/jest-dom";
import React from "react";

const motionPropBlocklist = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "whileHover",
  "whileTap",
  "whileInView",
  "layout",
  "viewport",
]);

const filterMotionProps = (props = {}) =>
  Object.fromEntries(
    Object.entries(props).filter(([key]) => !motionPropBlocklist.has(key))
  );

const createMotionComponent = (tag = "div") =>
  React.forwardRef((props, ref) =>
    React.createElement(tag, { ...filterMotionProps(props), ref })
  );

const motionProxy = new Proxy(
  {},
  {
    get: (_target, prop) => createMotionComponent(prop),
  }
);

vi.mock("framer-motion", () => ({
  motion: motionProxy,
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
}));
