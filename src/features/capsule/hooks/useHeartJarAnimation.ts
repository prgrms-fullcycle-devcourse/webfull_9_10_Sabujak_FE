import { useEffect, type RefObject } from "react";
import {
  HEART_BOX,
  HEART_HUE_RANGES,
  HEART_SCALE_MAX,
  HEART_SCALE_MIN,
  JAR_BOUNDS,
  MAX_HEARTS,
} from "../constants/heartJar";

type HeartStyleRule = {
  fill: string;
  stroke: string;
  scale: number;
};

type HeartAnimationState = {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  rotation: number;
  fromRotation: number;
  toRotation: number;
  scale: number;
  baseScale: number;
  opacity: number;
  speed: number;
  scalePulse: number;
  opacityMin: number;
  moveStart: number;
  moveDuration: number;
  pulseOffset: number;
  fadeOffset: number;
};

type HeartElement = SVGGElement & {
  __state: HeartAnimationState;
};

type HeartItem = {
  el: HeartElement;
  rule: HeartStyleRule;
};

type UseHeartJarAnimationParams = {
  heartLayerRef: RefObject<SVGGElement | null>;
  total: number;
  heartShapeId: string;
};

function random(min: number, max: number, step = 0) {
  const value = (Math.random() * (max - min)) + min;

  if (!step) {
    return value;
  }

  return Math.round(value / step) * step;
}

function clampHeartCount(total: number) {
  return Math.max(0, Math.min(MAX_HEARTS, Number(total) || 0));
}

function getRandomHeartStyle(): HeartStyleRule {
  const [minHue, maxHue] = HEART_HUE_RANGES[Math.floor(Math.random() * HEART_HUE_RANGES.length)];
  const hue = random(minHue, maxHue, 1);
  const saturation = random(58, 72, 1);
  const lightness = random(72, 80, 1);
  const strokeLightness = Math.max(50, lightness - 18);
  const scale = random(HEART_SCALE_MIN, HEART_SCALE_MAX, 0.01);

  return {
    fill: `hsl(${hue} ${saturation}% ${lightness}%)`,
    stroke: `hsl(${hue} ${Math.max(48, saturation - 12)}% ${strokeLightness}%)`,
    scale,
  };
}

function createHeartTokens(total: number) {
  return Array.from({ length: clampHeartCount(total) }, () => getRandomHeartStyle());
}

function getInnerWidthByY(y: number, scale = 1) {
  const progress = (y - JAR_BOUNDS.top) / (JAR_BOUNDS.bottom - JAR_BOUNDS.top);
  const eased = Math.max(0, Math.min(1, progress));

  let halfWidth = 16;
  if (eased < 0.2) {
    halfWidth = 16 + ((eased / 0.2) * 7);
  } else if (eased < 0.8) {
    halfWidth = 23 + (((eased - 0.2) / 0.6) * 9);
  } else {
    halfWidth = 32 - (((eased - 0.8) / 0.2) * 3);
  }

  const safeHalfWidth = halfWidth - ((HEART_BOX.width * scale) / 2) - 2;
  return Math.max(11, safeHalfWidth);
}

function getRandomPoint(rule: HeartStyleRule) {
  const centerY = random(JAR_BOUNDS.top, JAR_BOUNDS.bottom);
  const halfWidth = getInnerWidthByY(centerY, rule.scale);
  const centerX = random(JAR_BOUNDS.centerX - halfWidth, JAR_BOUNDS.centerX + halfWidth);

  return {
    x: centerX - HEART_BOX.centerX,
    y: centerY + HEART_BOX.centerYOffset,
  };
}

function easeInOutSine(progress: number) {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

function lerp(start: number, end: number, progress: number) {
  return start + ((end - start) * progress);
}

function renderHeart(heart: HeartElement) {
  const state = heart.__state;
  heart.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale}) rotate(${state.rotation}deg)`;
  heart.style.opacity = String(state.opacity);
  heart.style.transformOrigin = "15px 8px";
}

function pickNextTarget(heart: HeartElement, rule: HeartStyleRule, now: number) {
  const state = heart.__state;
  const next = getRandomPoint(rule);

  state.fromX = state.x;
  state.fromY = state.y;
  state.toX = next.x;
  state.toY = next.y;
  state.fromRotation = state.rotation;
  state.toRotation = random(-20, 20);
  state.moveStart = now;
  state.moveDuration = random(2800, 5600) / state.speed;
}

function createHeart(
  heartLayer: SVGGElement,
  rule: HeartStyleRule,
  heartShapeId: string,
): HeartElement {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g") as HeartElement;
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  use.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${heartShapeId}`);
  use.setAttribute("href", `#${heartShapeId}`);
  use.setAttribute("fill", rule.fill);
  use.setAttribute("stroke", rule.stroke);
  use.setAttribute("stroke-width", "1.8");

  group.setAttribute("class", "heart");
  group.appendChild(use);
  heartLayer.appendChild(group);

  const point = getRandomPoint(rule);
  const now = performance.now();
  const baseScale = rule.scale;
  const initialRotation = random(-18, 18);

  group.__state = {
    x: point.x,
    y: point.y,
    fromX: point.x,
    fromY: point.y,
    toX: point.x,
    toY: point.y,
    rotation: initialRotation,
    fromRotation: initialRotation,
    toRotation: initialRotation,
    scale: baseScale,
    baseScale,
    opacity: 0.96,
    speed: random(0.78, 1.28, 0.01),
    scalePulse: random(0.94, 1.08, 0.01),
    opacityMin: random(0.72, 0.88, 0.01),
    moveStart: now,
    moveDuration: random(2800, 5600),
    pulseOffset: random(0, Math.PI * 2),
    fadeOffset: random(0, Math.PI * 2),
  };

  pickNextTarget(group, rule, now);
  renderHeart(group);

  return group;
}

function updateHeart(heart: HeartElement, rule: HeartStyleRule, now: number) {
  const state = heart.__state;

  let progress = (now - state.moveStart) / state.moveDuration;
  if (progress >= 1) {
    state.x = state.toX;
    state.y = state.toY;
    state.rotation = state.toRotation;
    pickNextTarget(heart, rule, now);
    progress = 0;
  }

  const easedProgress = easeInOutSine(Math.max(0, Math.min(1, progress)));

  state.x = lerp(state.fromX, state.toX, easedProgress);
  state.y = lerp(state.fromY, state.toY, easedProgress);
  state.rotation = lerp(state.fromRotation, state.toRotation, easedProgress);

  const pulse = (Math.sin(((now * 0.002) / state.speed) + state.pulseOffset) + 1) / 2;
  const fade = (Math.sin(((now * 0.0015) / state.speed) + state.fadeOffset) + 1) / 2;

  const minScale = state.baseScale * state.scalePulse;
  state.scale = lerp(minScale, state.baseScale, pulse);
  state.opacity = lerp(state.opacityMin, 1, fade);

  renderHeart(heart);
}

export default function useHeartJarAnimation({
  heartLayerRef,
  total,
  heartShapeId,
}: UseHeartJarAnimationParams) {
  useEffect(() => {
    const heartLayer = heartLayerRef.current;

    if (!heartLayer) {
      return;
    }

    let hearts: HeartItem[] = [];
    let animationFrameId: number | null = null;

    const animate = (now: number) => {
      hearts.forEach(({ el, rule }) => updateHeart(el, rule, now));
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const clearScene = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      hearts = [];
      heartLayer.innerHTML = "";
    };

    const buildScene = (messageTotal: number) => {
      clearScene();

      const tokens = createHeartTokens(messageTotal);
      if (!tokens.length) {
        return;
      }

      tokens.forEach((rule) => {
        const heart = createHeart(heartLayer, rule, heartShapeId);
        hearts.push({ el: heart, rule });
      });

      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    buildScene(total);

    return () => {
      clearScene();
    };
  }, [heartLayerRef, total, heartShapeId]);
}
