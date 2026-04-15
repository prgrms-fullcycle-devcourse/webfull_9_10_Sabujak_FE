import { useEffect, useRef } from "react";
import "./ConfettiCanvas.css";

type Vector = {
  x: number;
  y: number;
};

type ConfettiPiece = {
  position: Vector;
  velocity: Vector;
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  rotationSpeed: number;
  colorFront: string;
  colorBack: string;
  scaleY: number;
  gravity: number;
  drag: number;
  terminalVelocity: number;
};

type SequinPiece = {
  position: Vector;
  velocity: Vector;
  radius: number;
  color: string;
  gravity: number;
  drag: number;
  terminalVelocity: number;
};

type ConfettiCanvasProps = {
  initialBurst?: boolean;
  burstKey?: number;
};

const CONFETTI_COLORS = [
  { front: "#7b5cff", back: "#6245e0" },
  { front: "#b3c7ff", back: "#8fa5e5" },
  { front: "#5c86ff", back: "#345dd1" },
  { front: "#f0c3ff", back: "#d69ee8" },
  { front: "#ffd27f", back: "#e6b85c" },
];

const SEQUIN_COLORS = ["#ffd27f", "#f0c3ff", "#b3c7ff"];

const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const pick = <T,>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default function ConfettiCanvas({
  initialBurst = true,
  burstKey,
}: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const confettiRef = useRef<ConfettiPiece[]>([]);
  const sequinsRef = useRef<SequinPiece[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    ctxRef.current = context;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      widthRef.current = width;
      heightRef.current = height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
    };

    const createConfetti = (): ConfettiPiece => {
      const color = pick(CONFETTI_COLORS);
      const startX = widthRef.current / 2;
      const startY = heightRef.current * 0.28;

      return {
        position: {
          x: startX + randomRange(-30, 30),
          y: startY + randomRange(-10, 10),
        },
        velocity: {
          x: randomRange(-8, 8),
          y: randomRange(-18, -10),
        },
        size: {
          width: randomRange(8, 14),
          height: randomRange(12, 18),
        },
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(0.08, 0.18),
        colorFront: color.front,
        colorBack: color.back,
        scaleY: 1,
        gravity: 0.35,
        drag: 0.01,
        terminalVelocity: 6,
      };
    };

    const createSequin = (): SequinPiece => {
      const startX = widthRef.current / 2;
      const startY = heightRef.current * 0.28;

      return {
        position: {
          x: startX + randomRange(-20, 20),
          y: startY + randomRange(-10, 10),
        },
        velocity: {
          x: randomRange(-6, 6),
          y: randomRange(-14, -8),
        },
        radius: randomRange(1, 2.5),
        color: pick(SEQUIN_COLORS),
        gravity: 0.55,
        drag: 0.02,
        terminalVelocity: 8,
      };
    };

    const initBurst = () => {
      const nextConfetti = Array.from({ length: 80 }, createConfetti);
      const nextSequins = Array.from({ length: 30 }, createSequin);

      confettiRef.current.push(...nextConfetti);
      sequinsRef.current.push(...nextSequins);
    };

    const updateConfetti = (piece: ConfettiPiece) => {
      piece.velocity.x *= 1 - piece.drag;
      piece.velocity.y = Math.min(
        piece.velocity.y + piece.gravity,
        piece.terminalVelocity
      );

      piece.position.x += piece.velocity.x;
      piece.position.y += piece.velocity.y;

      piece.rotation += piece.rotationSpeed;
      piece.scaleY = Math.cos(piece.position.y * 0.12);
    };

    const updateSequin = (piece: SequinPiece) => {
      piece.velocity.x *= 1 - piece.drag;
      piece.velocity.y = Math.min(
        piece.velocity.y + piece.gravity,
        piece.terminalVelocity
      );

      piece.position.x += piece.velocity.x;
      piece.position.y += piece.velocity.y;
    };

    const drawConfetti = (
      ctx: CanvasRenderingContext2D,
      piece: ConfettiPiece
    ) => {
      ctx.save();
      ctx.translate(piece.position.x, piece.position.y);
      ctx.rotate(piece.rotation);

      ctx.fillStyle = piece.scaleY >= 0 ? piece.colorFront : piece.colorBack;
      ctx.fillRect(
        -piece.size.width / 2,
        (-piece.size.height * piece.scaleY) / 2,
        piece.size.width,
        piece.size.height * piece.scaleY
      );

      ctx.restore();
    };

    const drawSequin = (ctx: CanvasRenderingContext2D, piece: SequinPiece) => {
      ctx.beginPath();
      ctx.arc(piece.position.x, piece.position.y, piece.radius, 0, Math.PI * 2);
      ctx.fillStyle = piece.color;
      ctx.fill();
    };

    const render = () => {
      const ctx = ctxRef.current;

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, widthRef.current, heightRef.current);

      confettiRef.current.forEach((piece) => {
        updateConfetti(piece);
        drawConfetti(ctx, piece);
      });

      sequinsRef.current.forEach((piece) => {
        updateSequin(piece);
        drawSequin(ctx, piece);
      });

      confettiRef.current = confettiRef.current.filter((piece) => {
        return piece.position.y < heightRef.current + 40;
      });

      sequinsRef.current = sequinsRef.current.filter((piece) => {
        return piece.position.y < heightRef.current + 20;
      });

      rafRef.current = window.requestAnimationFrame(render);
    };

    setCanvasSize();

    if (initialBurst) {
      initBurst();
    }

    render();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      confettiRef.current = [];
      sequinsRef.current = [];
    };
  }, [initialBurst]);

  useEffect(() => {
    if (burstKey === undefined) {
      return;
    }

    const confetti = confettiRef.current;
    const sequins = sequinsRef.current;

    const createExtraConfetti = (): ConfettiPiece => {
      const color = pick(CONFETTI_COLORS);
      const startX = widthRef.current / 2;
      const startY = heightRef.current * 0.28;

      return {
        position: {
          x: startX + randomRange(-30, 30),
          y: startY + randomRange(-10, 10),
        },
        velocity: {
          x: randomRange(-8, 8),
          y: randomRange(-18, -10),
        },
        size: {
          width: randomRange(8, 14),
          height: randomRange(12, 18),
        },
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(0.08, 0.18),
        colorFront: color.front,
        colorBack: color.back,
        scaleY: 1,
        gravity: 0.35,
        drag: 0.01,
        terminalVelocity: 6,
      };
    };

    const createExtraSequin = (): SequinPiece => {
      const startX = widthRef.current / 2;
      const startY = heightRef.current * 0.28;

      return {
        position: {
          x: startX + randomRange(-20, 20),
          y: startY + randomRange(-10, 10),
        },
        velocity: {
          x: randomRange(-6, 6),
          y: randomRange(-14, -8),
        },
        radius: randomRange(1, 2.5),
        color: pick(SEQUIN_COLORS),
        gravity: 0.55,
        drag: 0.02,
        terminalVelocity: 8,
      };
    };

    confetti.push(...Array.from({ length: 80 }, createExtraConfetti));
    sequins.push(...Array.from({ length: 30 }, createExtraSequin));
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas no-capture"
      aria-hidden="true"
    />
  );
}
