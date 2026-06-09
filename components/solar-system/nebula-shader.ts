// Procedural nebula: large BackSide sphere with soft drifting fBm clouds in
// deep purple/blue. Very low opacity — depth, not distraction. No image files.

export const nebulaVertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;   // object-space sphere position doubles as a direction
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const nebulaFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vDir;

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

  float fbm2(vec3 p) { return 0.5*noise(p) + 0.25*noise(p*2.0); }
  float fbm3(vec3 p) { return 0.5*noise(p) + 0.25*noise(p*2.0) + 0.125*noise(p*4.0); }

  void main() {
    vec3 p = normalize(vDir);
    vec3 q = p * 2.0 + vec3(uTime * 0.01, 0.0, uTime * 0.008);
    // Cheap single-octave gate: skip full fBm on clear-sky fragments.
    if (noise(q) < 0.40) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float n = fbm3(q);
    float n2 = fbm2(p * 4.0 - vec3(uTime * 0.005));
    float cloud = smoothstep(0.45, 0.80, n) * 0.7 + n2 * 0.2;
    vec3 blue = vec3(0.08, 0.12, 0.40);
    vec3 purple = vec3(0.25, 0.10, 0.45);
    vec3 col = mix(blue, purple, n);
    gl_FragColor = vec4(col, cloud * uOpacity);
  }
`
