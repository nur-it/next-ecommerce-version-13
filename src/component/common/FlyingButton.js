import React from "react";

const DEFAULT_TARGET_TOP = "50%";
const DEFAULT_TARGET_LEFT = "100%";
const DEFAULT_ANIMATION_DURATION = 2;
const DEFAULT_ITEM_STYLING = { width: "8rem" };

const FlyingButton = ({
  children,
  flyingImage,
  targetTop = DEFAULT_TARGET_TOP,
  targetLeft = DEFAULT_TARGET_LEFT,
  customAnimation = "",
  animationDuration = DEFAULT_ANIMATION_DURATION,
  flyingItemStyling = DEFAULT_ITEM_STYLING,
}) => {
  const customStyling = `
        .flying_image {
          --target-position-x: 0px;
          --target-position-y: 0px;
    
          display: block;
          position: fixed;
          top: var(--target-position-y);
          left: var(--target-position-x);
          translate: -50% -50%;
          animation: fly ${animationDuration}s 1;
        }
        @keyframes fly {
          0% {
            top: var(--target-position-y);
            left: var(--target-position-x);
            opacity: 1;
          }
          ${customAnimation}
          100% {
            top: ${targetTop};
            left: ${targetLeft};
            opacity: 0;
          }
        }
      `;

  // console.log(" flyingImage={flyingImage}", flyingImage);
  return (
    <div>
      <style>{customStyling}</style>
      <div>{children}</div>
      <img
        src=""
        alt=""
        className="flying_image z-50"
        style={{
          display: "none",
          ...DEFAULT_ITEM_STYLING,
          ...flyingItemStyling,
        }}
        ref={flyingImage}
      />
    </div>
  );
};

export default FlyingButton;
