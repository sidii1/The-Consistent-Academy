import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const square1Ref = useRef<HTMLDivElement>(null);
  const square2Ref = useRef<HTMLDivElement>(null);
  const square3Ref = useRef<HTMLDivElement>(null);
  const square4Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // PHASE 1: Ambient Intro (00:00 - 00:01)
    // Covered by CSS animation on ambientRef. Shifting gradient background.

    // PHASE 2: Concentric Square Staggered Scale-In (00:01 - 00:02)
    // 1. Transition background to solid #F3EEF9 canvas by fading out the ambient layer
    tl.to(
      ambientRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      1.0
    );

    // 2. Scale up the 4 nested squares from center with a 0.1s stagger delay
    tl.set(
      [
        square1Ref.current,
        square2Ref.current,
        square3Ref.current,
        square4Ref.current,
      ],
      {
        scale: 0,
        opacity: 1,
      },
      1.0
    );

    tl.to(square1Ref.current, { scale: 1, duration: 1.0, ease: "power4.out" }, 1.0);
    tl.to(square2Ref.current, { scale: 1, duration: 1.0, ease: "power4.out" }, 1.2);
    tl.to(square3Ref.current, { scale: 1, duration: 1.0, ease: "power4.out" }, 1.4);
    tl.to(square4Ref.current, { scale: 1, duration: 1.0, ease: "power4.out" }, 1.6);

    // 3. Logo scales down slightly and fades in right as Square 4 locks into place
    tl.set(logoRef.current, { opacity: 0, scale: 1.25 });
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 1.25 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      1.8
    );

    // PHASE 3: Collapse into Minimal Block (00:02 - 00:02.5)
    // 1. Outer squares (1, 2, 3) collapse inward or disappear
    tl.to(
      [square1Ref.current, square2Ref.current, square3Ref.current],
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      },
      3.0
    );

    // 2. Innermost square (Square 4) sharply scales down into a small 60px x 60px block (scale 0.3)
    // Color transitions from Mid-Tone Purple to Dark Deep Purple (#3C096C)
    tl.to(
      square4Ref.current,
      {
        scale: 0.3,
        backgroundColor: "#3C096C",
        borderRadius: "12px",
        duration: 0.6,
        ease: "power3.inOut",
      },
      3.0
    );

    // Logo fades out to 0 opacity during this rapid down-scaling
    tl.to(
      logoRef.current,
      {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: "power3.in",
      },
      3.0
    );

    // PHASE 4: The Outward Zoom Reveal (00:02.5 - 00:03)
    // Central block holds for a fraction of a second, then explodes outward extremely fast.
    // A scale of 120 is used to ensure it expands far past any 4K screen edges.
    tl.to(
      square4Ref.current,
      {
        scale: 125,
        duration: 0.8,
        ease: "power4.inOut",
      },
      3.8
    );

    // The DOM element container vanishes precisely when the expanding purple block fills the viewport.
    // The scale of Square 4 crosses screen edges around 2.85s. We fade the container to 0 at this point.
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      4.3
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#F3EEF9] flex items-center justify-center overflow-hidden select-none pointer-events-auto"
    >
      {/* Background canvas layer */}
      <div className="absolute inset-0 bg-[#F3EEF9]" />

      {/* Shifting ambient background gradient */}
      <div
        ref={ambientRef}
        className="absolute inset-0 w-full h-full animate-ambient-drift"
        style={{
          background: "linear-gradient(-45deg, #F3EEF9, #E9D8F4, #9D4EDD, #7B2CBF)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Concentric Squares Container */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Square 1 (Outermost): 500px, Light-Mid Purple */}
        <div
          ref={square1Ref}
          className="absolute pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            backgroundColor: "#A370D6",
            transform: "scale(0)",
            willChange: "transform",
          }}
        />

        {/* Square 2 (Middle-Outer): 400px, Primary Purple */}
        <div
          ref={square2Ref}
          className="absolute pointer-events-none"
          style={{
            width: "400px",
            height: "400px",
            backgroundColor: "#9D4EDD",
            transform: "scale(0)",
            willChange: "transform",
          }}
        />

        {/* Square 3 (Middle-Inner): 300px, Dark Deep Purple */}
        <div
          ref={square3Ref}
          className="absolute pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "#3C096C",
            transform: "scale(0)",
            willChange: "transform",
          }}
        />

        {/* Square 4 (Innermost & Logo Container): 200px, Mid-Tone Purple */}
        <div
          ref={square4Ref}
          className="absolute flex items-center justify-center"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#7B2CBF",
            transform: "scale(0)",
            willChange: "transform",
          }}
        >
          <img
            ref={logoRef}
            src="/logo2.png"
            alt="The Consistent Academy Logo"
            className="w-36 h-36 object-contain"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
};
