export interface Planet {
  id: string
  name: string
  subtitle: string
  description: string
  techFocus: string
  stack: string[]
  github: string
  color: string
  emissiveColor: string
  position: [number, number, number]
  size: number
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  type: 'earth' | 'exoplanet' | 'mars' | 'jupiter' | 'neptune' | 'saturn'
}

export const planets: Planet[] = [
  {
    id: 'vitaai',
    name: 'Planet VitaAI',
    subtitle: 'The Mobile Core',
    description: 'A comprehensive full-stack health-tracking mobile app featuring deep mobile-to-backend architecture.',
    techFocus: 'High-performance cross-platform development and structured state management.',
    stack: ['Flutter', 'Dart', 'Python', 'FastAPI', 'REST APIs'],
    github: 'https://github.com/rpgoxa/vitaai',
    color: '#4a90d9',
    emissiveColor: '#2563eb',
    position: [12, 0, 0],
    size: 1.2,
    orbitRadius: 12,
    orbitSpeed: 0.3,
    rotationSpeed: 0.002,
    type: 'earth'
  },
  {
    id: 'eye',
    name: 'Planet Eye',
    subtitle: 'The AI Detector',
    description: 'A computer vision system for real-time person detection and environmental analysis.',
    techFocus: 'AI object detection models and optimizing visual data processing frames.',
    stack: ['Python', 'Computer Vision', 'AI Models'],
    github: 'https://github.com/rpgoxa/person-detection-project',
    color: '#2d1f3d',
    emissiveColor: '#ff4444',
    position: [18, 0, 0],
    size: 1.2,
    orbitRadius: 18,
    orbitSpeed: 0.25,
    rotationSpeed: 0.0015,
    type: 'exoplanet'
  },
  {
    id: 'circuit',
    name: 'Planet Circuit',
    subtitle: 'The Hardware Core',
    description: 'Electronics and microcontroller projects bridging firmware software and physical components.',
    techFocus: 'Hardware logic, embedded systems prototyping, and IoT communication.',
    stack: ['Arduino', 'ESP8266/ESP32', 'C++'],
    github: 'https://github.com/rpgoxa/arduino-esp',
    color: '#c1440e',
    emissiveColor: '#dc2626',
    position: [24, 0, 0],
    size: 1.2,
    orbitRadius: 24,
    orbitSpeed: 0.2,
    rotationSpeed: 0.0018,
    type: 'mars'
  },
  {
    id: 'automata',
    name: 'Planet Automata',
    subtitle: 'The WhatsApp Bot',
    description: 'Automated workflow utility handling logic, message parsing, and scripting through WhatsApp.',
    techFocus: 'Automation engineering, background task loops, and API webhook integrations.',
    stack: ['Node.js', 'Python', 'WhatsApp API', 'Event Scripting'],
    github: 'https://github.com/rpgoxa/whatsapp_bot',
    color: '#8b5cf6',
    emissiveColor: '#a855f7',
    position: [32, 0, 0],
    size: 1.2,
    orbitRadius: 32,
    orbitSpeed: 0.12,
    rotationSpeed: 0.003,
    type: 'jupiter'
  },
  {
    id: 'abyss',
    name: 'Planet Abyss',
    subtitle: 'The Reader App',
    description: 'Lightweight optimized local digital reading app emphasizing seamless visuals and smooth scrolling.',
    techFocus: 'Interface customization, local file systems, and custom graphical UI design.',
    stack: ['Mobile Frameworks', 'Asset Pipeline', 'Custom Design UI'],
    github: 'https://github.com/rpgoxa/abyss_reader',
    color: '#1e3a5f',
    emissiveColor: '#0ea5e9',
    position: [40, 0, 0],
    size: 1.2,
    orbitRadius: 40,
    orbitSpeed: 0.08,
    rotationSpeed: 0.0012,
    type: 'neptune'
  },
  {
    id: 'play',
    name: 'Planet Play',
    subtitle: 'The Interactive Web',
    description: 'Polished responsive web-based Truth or Dare party game designed for fast UI rendering.',
    techFocus: 'Client-side states, web engineering, and responsive CSS layout design.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Frontend Layouts'],
    github: 'https://github.com/rpgoxa/truth-or-dare-game',
    color: '#d4a574',
    emissiveColor: '#f59e0b',
    position: [50, 0, 0],
    size: 1.2,
    orbitRadius: 50,
    orbitSpeed: 0.05,
    rotationSpeed: 0.001,
    type: 'saturn'
  }
]

export const aboutData = {
  bio: "I am a 17-year-old full-stack developer and systems enthusiast from Lebanon, breaking down and building technology from responsive user interfaces down to low-level binaries and custom circuits.",
  disciplines: [
    'Full-Stack Web, Cross-Platform Mobile, Automated Workflows',
    'Reverse Engineering, Game Modding, Electrical Engineering',
    'Offensive & Defensive Cybersecurity (actively building)'
  ],
  techStack: {
    languages: ['Python', 'JavaScript', 'TypeScript', 'Dart', 'Bash', 'C++', 'C', 'SQL', 'HTML/CSS'],
    systems: ['Linux (Arch/Garuda)', 'Ubuntu', 'Kali Linux', 'ADB', 'Termux', 'Binary Analysis', 'Git']
  },
  social: {
    github: 'https://github.com/rpgoxa',
    instagram: 'https://www.instagram.com/ali_amir_hus/',
    email: 'ali2009amir@gmail.com'
  }
}
