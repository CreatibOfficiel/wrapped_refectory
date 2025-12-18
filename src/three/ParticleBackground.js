/**
 * Three.js Particle Background for Wrapped Refectory
 * Creates an immersive animated background with food-themed particles
 */

import * as THREE from "three";

export class ParticleBackground {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.particles = null;
    this.animationFrame = null;

    this.init();
  }

  init() {
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    // Renderer with transparency
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // Insert canvas as background
    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    this.renderer.domElement.style.zIndex = "-1";
    this.renderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.renderer.domElement);

    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  createParticles() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Refectory color palette
    const colorPalette = [
      new THREE.Color("#4CAF50"), // Vert Refectory
      new THREE.Color("#2E7D32"), // Vert foncé
      new THREE.Color("#FF6B35"), // Orange chaud
      new THREE.Color("#FFD700"), // Or
      new THREE.Color("#F5F3EE"), // Beige clair
    ];

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 30 + Math.random() * 40;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 20;

      // Random color from palette
      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          pos.x += sin(time * 0.5 + position.y * 0.1) * 2.0;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());

    // Update time uniform for shader animation
    if (this.particles) {
      this.particles.material.uniforms.time.value += 0.01;
      this.particles.rotation.y += 0.0005;
      this.particles.rotation.x += 0.0002;
    }

    this.renderer.render(this.scene, this.camera);
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.particles.material.uniforms.pixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }

  // Change color theme based on slide
  setColorTheme(theme) {
    const themes = {
      intro: ["#4CAF50", "#2E7D32", "#81C784"],
      stats: ["#1976D2", "#4CAF50", "#64B5F6"],
      podium: ["#FFD700", "#FFA000", "#CD7F32"],
      dessert: ["#E91E63", "#9C27B0", "#F48FB1"],
      recipes: ["#26A69A", "#4DB6AC", "#FFFFFF"],
      conclusion: ["#4CAF50", "#2E7D32", "#A5D6A7"],
    };

    const colors = themes[theme] || themes.intro;
    const colorObjects = colors.map((c) => new THREE.Color(c));

    const colorAttr = this.particles.geometry.attributes.color;
    const count = colorAttr.count;

    for (let i = 0; i < count; i++) {
      const color =
        colorObjects[Math.floor(Math.random() * colorObjects.length)];
      colorAttr.setXYZ(i, color.r, color.g, color.b);
    }
    colorAttr.needsUpdate = true;
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

// Initialize when DOM is ready
export function initParticleBackground() {
  const container = document.getElementById("story-container") || document.body;
  return new ParticleBackground(container);
}
