import { useEffect, useRef } from "react";

interface VsCircleProps {
  state: "vs" | "correct" | "wrong" | "hidden";
  flipVsOnShow: boolean;
}

export default function VsCircle({ state, flipVsOnShow }: VsCircleProps) {
  const lastVisibleState = useRef<"vs" | "correct" | "wrong">("vs");
  const isVisible = state !== "hidden";

  useEffect(() => {
    if (state !== "hidden") {
      lastVisibleState.current = state;
    }
  }, [state]);

  const displayState = state === "hidden" ? lastVisibleState.current : state;

  const label =
    displayState === "correct" ? (
      <img src="/rewle/assets/checkmark.svg" className="w-9 h-9 object-contain" alt="" />
    ) : displayState === "wrong" ? (
      <img src="/rewle/assets/cross.svg" className="w-9 h-9 object-contain" alt="" />
    ) : (
      "VS"
    );
  const textColor = displayState === "vs" ? "text-rewe-red" : "text-white";
  const backgroundColor =
    displayState === "correct" ? "bg-feedback-green" : displayState === "wrong" ? "bg-feedback-red" : "bg-card";
  const shouldFlip = displayState === "vs" && isVisible && flipVsOnShow; 

  return (
    <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2" style={{ perspective: "1000px" }}>
      <div
        className="h-20 w-20 transform-gpu transition-transform ease-in-out"
        style={{
          transform: isVisible ? "scale(1)" : "scale(0)",
          transitionDuration: "500ms",
        }}
      >
        <div
          className={`h-20 w-20 rounded-full chunky-shadow flex items-center justify-center transform-gpu ${backgroundColor}`}
          style={{
            transform: shouldFlip ? "rotateY(360deg)" : "rotateY(0deg)",
            transitionProperty: "transform",
            transitionDuration: shouldFlip ? "1200ms" : "0ms",
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <span
            className={`font-lilita text-4xl ${textColor}`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
