/**
 * GSAP Animation Utilities for Wrapped Refectory
 * Smooth transitions, counters, and effects
 */

import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

// ============================================
// COUNTER ANIMATIONS
// ============================================

/**
 * Animate a number counter
 * @param {HTMLElement} element - Element to animate
 * @param {number} targetValue - Target number
 * @param {object} options - Animation options
 */
export function animateCounter(element, targetValue, options = {}) {
  const {
    duration = 2,
    prefix = '',
    suffix = '',
    decimals = 0,
    ease = 'power2.out'
  } = options;

  const obj = { value: 0 };
  
  gsap.to(obj, {
    value: targetValue,
    duration,
    ease,
    onUpdate: () => {
      const formatted = decimals > 0 
        ? obj.value.toFixed(decimals)
        : Math.round(obj.value);
      element.textContent = `${prefix}${formatted}${suffix}`;
    }
  });
}

/**
 * Animate multiple counters in sequence
 * @param {Array} counters - Array of {element, value, options}
 */
export function animateCountersSequence(counters) {
  const timeline = gsap.timeline();
  
  counters.forEach((counter, index) => {
    const delay = index * 0.3;
    timeline.add(() => {
      animateCounter(counter.element, counter.value, counter.options);
    }, delay);
  });
  
  return timeline;
}

// ============================================
// SLIDE TRANSITIONS  
// ============================================

/**
 * Transition out current slide
 * @param {HTMLElement} slideContainer - Container element
 * @returns {GSAPTimeline}
 */
export function slideOut(slideContainer) {
  return gsap.to(slideContainer.children, {
    opacity: 0,
    y: -30,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.in'
  });
}

/**
 * Transition in new slide
 * @param {HTMLElement} slideContainer - Container element
 * @returns {GSAPTimeline}
 */
export function slideIn(slideContainer) {
  gsap.set(slideContainer.children, { opacity: 0, y: 30 });
  
  return gsap.to(slideContainer.children, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
}

/**
 * Full slide transition (out then in)
 * @param {HTMLElement} container - Container element
 * @param {Function} contentCallback - Function to update content
 */
export async function transitionSlide(container, contentCallback) {
  await slideOut(container);
  contentCallback();
  await slideIn(container);
}

// ============================================
// TEXT ANIMATIONS
// ============================================

/**
 * Reveal text character by character
 * @param {HTMLElement} element - Text element
 * @param {object} options - Animation options
 */
export function revealText(element, options = {}) {
  const { duration = 1.5, stagger = 0.02 } = options;
  
  const text = element.textContent;
  element.innerHTML = text.split('').map(char => 
    `<span class="char" style="opacity: 0">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');
  
  gsap.to(element.querySelectorAll('.char'), {
    opacity: 1,
    duration: 0.1,
    stagger,
    ease: 'none'
  });
}

/**
 * Animate title entrance with scale
 * @param {HTMLElement} element - Title element
 */
export function animateTitle(element) {
  gsap.from(element, {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
}

// ============================================
// CONFETTI EFFECTS
// ============================================

/**
 * Trigger confetti celebration
 * @param {object} options - Confetti options
 */
export function celebrate(options = {}) {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4CAF50', '#FFD700', '#FF6B35', '#2E7D32', '#F5F3EE']
  };
  
  confetti({ ...defaults, ...options });
}

/**
 * Confetti burst from sides
 */
export function celebrateFromSides() {
  const count = 50;
  const defaults = {
    colors: ['#4CAF50', '#FFD700', '#FF6B35', '#2E7D32']
  };

  // Left side
  confetti({
    ...defaults,
    particleCount: count,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 }
  });
  
  // Right side
  confetti({
    ...defaults,
    particleCount: count,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 }
  });
}

/**
 * Gold star burst for podium reveal
 */
export function podiumCelebration() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FFD700', '#FFA000', '#FFEB3B'],
    shapes: ['star'],
    scalar: 1.2
  });
}

// ============================================
// ELEMENT EFFECTS
// ============================================

/**
 * Pulse effect on element
 * @param {HTMLElement} element - Element to pulse
 */
export function pulse(element) {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  });
}

/**
 * Shake effect (for errors or attention)
 * @param {HTMLElement} element - Element to shake
 */
export function shake(element) {
  gsap.to(element, {
    x: [-10, 10, -10, 10, 0],
    duration: 0.4,
    ease: 'power2.out'
  });
}

/**
 * Float animation (for decorative elements)
 * @param {HTMLElement} element - Element to float
 */
export function float(element) {
  gsap.to(element, {
    y: '-=10',
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}

// ============================================
// PODIUM ANIMATION
// ============================================

/**
 * Animate podium reveal (2nd, 1st, 3rd order)
 * @param {HTMLElement} container - Podium container
 */
export function animatePodium(container) {
  const blocks = container.querySelectorAll('[data-podium-place]');
  const order = ['2', '1', '3']; // Reveal order
  
  const timeline = gsap.timeline();
  
  order.forEach((place, index) => {
    const block = container.querySelector(`[data-podium-place="${place}"]`);
    if (block) {
      timeline.from(block, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.6,
        ease: 'back.out(1.2)'
      }, index * 0.4);
      
      // Add confetti for 1st place
      if (place === '1') {
        timeline.add(() => podiumCelebration(), '-=0.2');
      }
    }
  });
  
  return timeline;
}

// ============================================
// GRADIENT BACKGROUND ANIMATION
// ============================================

/**
 * Animate gradient background transition
 * @param {HTMLElement} element - Element with gradient
 * @param {Array} colors - Array of color stops
 */
export function animateGradient(element, colors) {
  // CSS custom properties approach
  const [start, middle, end] = colors;
  
  gsap.to(element, {
    '--gradient-start': start,
    '--gradient-middle': middle || start,
    '--gradient-end': end || start,
    duration: 1,
    ease: 'power2.inOut'
  });
}

// Export default animation presets
export const presets = {
  intro: {
    gradient: ['#4CAF50', '#2E7D32', '#1B5E20'],
    confetti: true
  },
  stats: {
    gradient: ['#1976D2', '#1565C0', '#0D47A1'],
    counters: true
  },
  podium: {
    gradient: ['#FFD700', '#FFA000', '#FF6F00'],
    confetti: true
  },
  dessert: {
    gradient: ['#E91E63', '#AD1457', '#880E4F'],
    confetti: false
  },
  recipes: {
    gradient: ['#26A69A', '#00897B', '#00695C'],
    confetti: false
  },
  conclusion: {
    gradient: ['#4CAF50', '#388E3C', '#2E7D32'],
    confetti: true
  }
};

export default {
  animateCounter,
  animateCountersSequence,
  slideOut,
  slideIn,
  transitionSlide,
  revealText,
  animateTitle,
  celebrate,
  celebrateFromSides,
  podiumCelebration,
  pulse,
  shake,
  float,
  animatePodium,
  animateGradient,
  presets
};
