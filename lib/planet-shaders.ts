// Procedural GLSL shaders for planets — no texture image files.
// One ShaderMaterial per planet.type. Shared value-noise/fBm + in-shader
// sun-direction lambert lighting + fresnel rim. Sun sits at world origin.

import type { Planet } from './planet-data'

// Shared vertex shader: pass world-space normal/position + view dir for
// lighting and fresnel. Built-ins (position, uv, normal, *Matrix,
// cameraPosition) are auto-injected by THREE.ShaderMaterial.
export const planetVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

// Shared GLSL: 3D value noise + fBm (octave-capped loop for perf).
const noiseChunk = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  // Fixed-octave fBm variants — fully unrollable by the GLSL compiler
  // (a dynamic int bound prevents unrolling).
  float fbm2(vec3 p) { return 0.5*noise(p) + 0.25*noise(p*2.0); }
  float fbm3(vec3 p) { return 0.5*noise(p) + 0.25*noise(p*2.0) + 0.125*noise(p*4.0); }
  float fbm4(vec3 p) { return 0.5*noise(p) + 0.25*noise(p*2.0) + 0.125*noise(p*4.0) + 0.0625*noise(p*8.0); }
`

// Per-type surface body. Returns base albedo; writes emissive boost via `em`
// (used for exoplanet glowing cracks). Bands use vUv.y so they stay
// horizontal; detail uses vWorldPos so it spins with the mesh rotation.
const surfaceBodies: Record<Planet['type'], string> = {
  earth: /* glsl */ `
    vec3 surface(out float em) {
      em = 0.0;
      vec3 p = vWorldPos * 0.6;
      float land = fbm4(p);
      float continents = smoothstep(0.52, 0.60, land);
      vec3 ocean = mix(vec3(0.03,0.15,0.40), vec3(0.05,0.27,0.55), fbm3(p*2.0));
      vec3 landCol = mix(vec3(0.13,0.42,0.12), vec3(0.45,0.55,0.25), fbm3(p*3.0));
      vec3 col = mix(ocean, landCol, continents);
      float ice = smoothstep(0.92, 0.99, abs(vUv.y - 0.5) * 2.0);
      col = mix(col, vec3(0.90,0.93,0.97), ice);
      float clouds = smoothstep(0.55, 0.75, fbm3(p*1.5 + vec3(uTime*0.02)));
      col = mix(col, vec3(1.0), clouds * 0.5);
      return col;
    }
  `,
  mars: /* glsl */ `
    vec3 surface(out float em) {
      em = 0.0;
      vec3 p = vWorldPos * 0.7;
      float n = fbm4(p);
      vec3 col = mix(vec3(0.48,0.18,0.08), vec3(0.70,0.32,0.15), n);
      col = mix(col, vec3(0.32,0.12,0.05), smoothstep(0.60, 0.75, fbm3(p*0.5)));
      float craters = fbm3(p*4.0);
      col *= 0.7 + 0.5 * smoothstep(0.40, 0.60, craters);
      float ice = smoothstep(0.93, 0.99, abs(vUv.y - 0.5) * 2.0);
      col = mix(col, vec3(0.85,0.80,0.75), ice * 0.7);
      return col;
    }
  `,
  jupiter: /* glsl */ `
    vec3 surface(out float em) {
      em = 0.0;
      float swirl = fbm3(vec3(vUv * vec2(3.0, 8.0), uTime * 0.03));
      float b = sin(vUv.y * 18.0 + swirl * 3.0);
      vec3 dark = vec3(0.18,0.10,0.30);
      vec3 light = vec3(0.55,0.37,0.77);
      vec3 col = mix(dark, light, smoothstep(-0.4, 0.4, b));
      float spot = smoothstep(0.18, 0.0, length((vUv - vec2(0.65,0.45)) * vec2(2.0,3.5)));
      col = mix(col, vec3(0.90,0.85,0.95), spot * 0.8);
      return col;
    }
  `,
  neptune: /* glsl */ `
    vec3 surface(out float em) {
      em = 0.0;
      float swirl = fbm3(vec3(vUv * vec2(2.0, 6.0), uTime * 0.02));
      float b = sin(vUv.y * 14.0 + swirl * 2.0);
      vec3 deep = vec3(0.03,0.15,0.40);
      vec3 lite = vec3(0.12,0.40,0.70);
      vec3 col = mix(deep, lite, smoothstep(-0.3, 0.5, b));
      float spot = smoothstep(0.16, 0.0, length((vUv - vec2(0.35,0.55)) * vec2(2.5,3.0)));
      col = mix(col, vec3(0.02,0.08,0.20), spot * 0.7);
      return col;
    }
  `,
  saturn: /* glsl */ `
    vec3 surface(out float em) {
      em = 0.0;
      float swirl = fbm2(vec3(vUv * vec2(2.0, 10.0), uTime * 0.015));
      float b = sin(vUv.y * 22.0 + swirl * 1.5);
      vec3 dark = vec3(0.55,0.40,0.18);
      vec3 lite = vec3(0.90,0.78,0.50);
      return mix(dark, lite, smoothstep(-0.3, 0.4, b));
    }
  `,
  exoplanet: /* glsl */ `
    vec3 surface(out float em) {
      vec3 p = vWorldPos * 0.8;
      float rock = fbm4(p);
      vec3 col = mix(vec3(0.02,0.02,0.03), vec3(0.08,0.06,0.10), rock);
      float crack = fbm3(p * 1.5);
      float line = smoothstep(0.480, 0.500, crack) - smoothstep(0.500, 0.520, crack);
      float glow = line * (0.7 + 0.3 * sin(uTime * 1.5));
      em = glow * 3.0;
      return col;
    }
  `,
}

// Assemble full fragment shader: uniforms + noise + per-type surface + main
// (lambert from sun at origin + ambient + fresnel rim in emissive color).
function buildPlanetFragment(type: Planet['type']): string {
  return /* glsl */ `
    uniform float uTime;
    uniform float uActive;
    uniform vec3 uEmissive;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    ${noiseChunk}
    ${surfaceBodies[type]}

    void main() {
      float em = 0.0;
      vec3 col = surface(em);

      vec3 N = normalize(vNormal);
      vec3 L = normalize(-vWorldPos);        // sun is at world origin
      float diff = max(dot(N, L), 0.0);
      col *= 0.18 + diff * 1.1;              // ambient floor + lambert

      float fres = pow(1.0 - max(dot(N, normalize(vViewDir)), 0.0), 3.0);
      col += uEmissive * fres * (0.6 + uActive * 0.6);   // fresnel rim
      col += uEmissive * em * (1.0 + uActive);           // emissive cracks

      gl_FragColor = vec4(col, 1.0);
    }
  `
}

export function buildPlanetShaders(type: Planet['type']): {
  vertexShader: string
  fragmentShader: string
} {
  return {
    vertexShader: planetVertexShader,
    fragmentShader: buildPlanetFragment(type),
  }
}

// --- Saturn ring shader: radial banded alpha with a Cassini-gap dark band ---
export const ringVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// RingGeometry uv maps to its bounding box (center 0.5,0.5), so radial
// distance = length(vUv - 0.5) * 2. innerRatio = inner/outer radius.
export const ringFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInnerRatio;
  varying vec2 vUv;

  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float rn = clamp((r - uInnerRatio) / (1.0 - uInnerRatio), 0.0, 1.0);
    float band = 0.5 + 0.5 * sin(rn * 40.0);
    float cassini = smoothstep(0.38, 0.40, rn) - smoothstep(0.46, 0.48, rn);
    float alpha = (0.40 + 0.45 * band) * (1.0 - cassini * 0.9);
    alpha *= smoothstep(0.0, 0.05, rn) * smoothstep(1.0, 0.92, rn);
    gl_FragColor = vec4(uColor * (0.7 + 0.3 * band), alpha * 0.7);
  }
`
