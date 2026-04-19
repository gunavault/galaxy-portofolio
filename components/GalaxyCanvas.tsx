'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Free CC4.0 textures from Solar System Scope
const TEXTURES = {
  sun:     'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  earth:   'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  moon:    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
};

export default function GalaxyCanvas() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = mountRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 4, 20);

    const loader = new THREE.TextureLoader();

    // ── BACKGROUND STARS ──
    const starGeo = new THREE.BufferGeometry();
    const starArr = new Float32Array(8000 * 3);
    for (let i = 0; i < 8000 * 3; i++) starArr[i] = (Math.random() - 0.5) * 600;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starArr, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.15, sizeAttenuation: true }));
    scene.add(stars);

    // ── GALAXY (stage 0) ──
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);
    const gGeo = new THREE.BufferGeometry();
    const gCount = 80000;
    const gPos = new Float32Array(gCount * 3);
    const gCol = new Float32Array(gCount * 3);
    const cIn = new THREE.Color('#a78bfa'), cOut = new THREE.Color('#0d0630');
    for (let i = 0; i < gCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * 9;
      const spin = r * 1.3;
      const branch = ((i % 5) / 5) * Math.PI * 2;
      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.15 * r;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
      gPos[i3]   = Math.cos(branch + spin) * r + rx;
      gPos[i3+1] = ry;
      gPos[i3+2] = Math.sin(branch + spin) * r + rz;
      const c = cIn.clone().lerp(cOut, r / 9);
      gCol[i3] = c.r; gCol[i3+1] = c.g; gCol[i3+2] = c.b;
    }
    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    gGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
    const gMat = new THREE.PointsMaterial({ size: 0.01, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
    const galaxyPoints = new THREE.Points(gGeo, gMat);
    galaxyGroup.add(galaxyPoints);

    // ── NEBULA CLOUD (stage 1) ──
    const nebulaGroup = new THREE.Group();
    nebulaGroup.visible = false;
    scene.add(nebulaGroup);
    const nGeo = new THREE.BufferGeometry();
    const nCount = 25000;
    const nPos = new Float32Array(nCount * 3);
    const nCol = new Float32Array(nCount * 3);
    const nColors = ['#7c3aed','#4338ca','#0891b2','#9333ea','#2563eb'].map(c => new THREE.Color(c));
    for (let i = 0; i < nCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.pow(Math.random(), 0.5) * 10;
      nPos[i3]   = r * Math.sin(phi) * Math.cos(theta) * (0.8 + Math.random() * 0.4);
      nPos[i3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      nPos[i3+2] = r * Math.cos(phi) * (0.8 + Math.random() * 0.4);
      const c = nColors[Math.floor(Math.random() * nColors.length)];
      nCol[i3] = c.r; nCol[i3+1] = c.g; nCol[i3+2] = c.b;
    }
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
    nGeo.setAttribute('color', new THREE.BufferAttribute(nCol, 3));
    const nMat = new THREE.PointsMaterial({ size: 0.06, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.7 });
    const nebulaPoints = new THREE.Points(nGeo, nMat);
    nebulaGroup.add(nebulaPoints);

    // ── SOLAR SYSTEM (stage 2) ──
    const solarGroup = new THREE.Group();
    solarGroup.visible = false;
    solarGroup.rotation.x = 0.35;
    scene.add(solarGroup);

    // Sun with emissive glow
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#FDB813', wireframe: false })
    );
    solarGroup.add(sunMesh);

    // Sun corona rings
    for (let i = 0; i < 3; i++) {
      const r = 1.3 + i * 0.15;
      const corona = new THREE.Mesh(
        new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshBasicMaterial({ color: '#FF8800', transparent: true, opacity: 0.06 - i * 0.015, side: THREE.BackSide })
      );
      solarGroup.add(corona);
    }

    // Planets
    const planetDefs = [
      { d: 2.2,  r: 0.08,  color: '#a0a0a0', speed: 0.047, name: 'Mercury', tilt: 0 },
      { d: 3.2,  r: 0.13,  color: '#e8d5a3', speed: 0.035, name: 'Venus',   tilt: 0 },
      { d: 4.3,  r: 0.14,  color: '#4FC3F7', speed: 0.029, name: 'Earth',   tilt: 0.41 },
      { d: 5.5,  r: 0.10,  color: '#c1440e', speed: 0.024, name: 'Mars',    tilt: 0.44 },
      { d: 8.0,  r: 0.45,  color: '#c88b3a', speed: 0.013, name: 'Jupiter', tilt: 0.05 },
      { d: 10.5, r: 0.38,  color: '#e4d191', speed: 0.009, name: 'Saturn',  tilt: 0.47 },
      { d: 13.0, r: 0.22,  color: '#7de8e8', speed: 0.006, name: 'Uranus',  tilt: 1.71 },
      { d: 15.5, r: 0.20,  color: '#3f54ba', speed: 0.005, name: 'Neptune', tilt: 0.49 },
    ];

    const planetMeshes: { mesh: THREE.Mesh; distance: number; speed: number; angle: number }[] = [];

    planetDefs.forEach(p => {
      // Orbit line
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * p.d, 0, Math.sin(a) * p.d));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitMat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.08 });
      solarGroup.add(new THREE.Line(orbitGeo, orbitMat));

      // Planet sphere
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.r, 20, 20),
        new THREE.MeshBasicMaterial({ color: p.color })
      );
      const startAngle = Math.random() * Math.PI * 2;
      pMesh.position.set(Math.cos(startAngle) * p.d, 0, Math.sin(startAngle) * p.d);
      solarGroup.add(pMesh);
      planetMeshes.push({ mesh: pMesh, distance: p.d, speed: p.speed, angle: startAngle });

      // Saturn rings
      if (p.name === 'Saturn') {
        const ringGeo = new THREE.RingGeometry(p.r * 1.5, p.r * 2.5, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: '#d4b483', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        pMesh.add(ring);
      }

      // Earth atmosphere
      if (p.name === 'Earth') {
        const atmos = new THREE.Mesh(
          new THREE.SphereGeometry(p.r * 1.15, 20, 20),
          new THREE.MeshBasicMaterial({ color: '#4FC3F7', transparent: true, opacity: 0.12, side: THREE.BackSide })
        );
        pMesh.add(atmos);
      }
    });

    // Asteroid belt
    const asteroidGeo = new THREE.BufferGeometry();
    const aCount = 2000;
    const aPos = new Float32Array(aCount * 3);
    for (let i = 0; i < aCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const r = 6.3 + (Math.random() - 0.5) * 0.8;
      aPos[i3]   = Math.cos(angle) * r;
      aPos[i3+1] = (Math.random() - 0.5) * 0.3;
      aPos[i3+2] = Math.sin(angle) * r;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
    solarGroup.add(new THREE.Points(asteroidGeo, new THREE.PointsMaterial({ color: '#888888', size: 0.04, sizeAttenuation: true })));

    // ── EARTH CLOSE UP (stage 3) ──
    const earthGroup = new THREE.Group();
    earthGroup.visible = false;
    scene.add(earthGroup);

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 64, 64),
      new THREE.MeshBasicMaterial({ color: '#1a6b8a' })
    );
    earthGroup.add(earthMesh);

    // Continent patches
    const continents = [
      { lat: 48, lon: 10, s: 0.5 },  // Europe
      { lat: 5,  lon: 22, s: 0.65 }, // Africa
      { lat: 45, lon: -100, s: 0.7 },// N America
      { lat: -15, lon: -55, s: 0.5 },// S America
      { lat: 50, lon: 85, s: 0.85 }, // Asia
      { lat: -25, lon: 135, s: 0.45 },// Australia
      { lat: -75, lon: 0, s: 0.4 },  // Antarctica
    ];
    continents.forEach(c => {
      const lat = (c.lat * Math.PI) / 180;
      const lon = (c.lon * Math.PI) / 180;
      const R = 2.02;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(R, 8, 8),
        new THREE.MeshBasicMaterial({ color: '#2d7a47' })
      );
      mesh.position.set(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon));
      mesh.scale.setScalar(c.s * 0.18);
      earthGroup.add(mesh);
    });

    // Atmosphere glow
    earthGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.25, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#4FC3F7', transparent: true, opacity: 0.1, side: THREE.BackSide })
    ));
    earthGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.18, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.04, side: THREE.BackSide })
    ));

    // Moon
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 20, 20),
      new THREE.MeshBasicMaterial({ color: '#c8c8c8' })
    );
    earthGroup.add(moonMesh);

    // Jakarta marker
    const jakartaLat = -6.2 * Math.PI / 180;
    const jakartaLon = 106.8 * Math.PI / 180;
    const R = 2.05;
    const jakartaMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#a78bfa' })
    );
    jakartaMarker.position.set(
      R * Math.cos(jakartaLat) * Math.cos(jakartaLon),
      R * Math.sin(jakartaLat),
      R * Math.cos(jakartaLat) * Math.sin(jakartaLon)
    );
    // Glow ring around Jakarta
    const jakartaGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#a78bfa', transparent: true, opacity: 0.3 })
    );
    jakartaGlow.position.copy(jakartaMarker.position);
    earthGroup.add(jakartaMarker);
    earthGroup.add(jakartaGlow);

    // ── SCROLL SYSTEM ──
    // 4 stages: 0=galaxy, 1=nebula, 2=solar, 3=earth
    // Each stage = 25% of scroll

    const camPositions = [
      new THREE.Vector3(0, 4, 20),   // galaxy — wide view
      new THREE.Vector3(0, 2, 13),   // nebula — closer
      new THREE.Vector3(0, 10, 18),  // solar system — overhead angle
      new THREE.Vector3(0, 0.5, 7),  // earth — close
    ];

    const camTargets = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];

    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = docH > 0 ? window.scrollY / docH : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouse);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Lerp helper
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpV3 = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) => {
      out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
    };

    // Easing
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    let animId: number;
    const clock = new THREE.Clock();
    const camPos = new THREE.Vector3().copy(camPositions[0]);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth scroll
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

      // Stage calculation (0-3 float)
      const stageF = scrollProgress * 3;
      const stage = Math.floor(Math.min(stageF, 2.999));
      const stageProg = easeInOut(stageF - stage);

      // Visibility — fade between adjacent stages
      const opacity = (group: THREE.Group, visible: boolean, alpha: number) => {
        group.visible = visible || alpha > 0.01;
        group.traverse(obj => {
          if ((obj as any).material) {
            const mat = (obj as any).material;
            if (mat.transparent !== undefined) {
              mat.transparent = true;
              mat.opacity = visible ? Math.min(alpha, mat.opacity !== undefined ? 1 : 1) : (1 - alpha) * 0.8;
            }
          }
        });
      };

      // Show/hide groups based on stage
      galaxyGroup.visible = stage === 0 || (stage === 0 && stageProg < 1);
      nebulaGroup.visible = stage === 1 || (stage === 0 && stageProg > 0.5) || (stage === 2 && stageProg < 0.5);
      solarGroup.visible  = stage === 2 || (stage === 1 && stageProg > 0.5) || (stage === 2 && stageProg > 0);
      earthGroup.visible  = stage === 2 && stageProg > 0.7 || stageF >= 2.7;

      // Camera interpolation between stages
      const fromPos = camPositions[stage];
      const toPos   = camPositions[Math.min(stage + 1, 3)];
      lerpV3(camPos, fromPos, toPos, stageProg);

      // Smooth camera with lerp + subtle mouse parallax
      camera.position.x += (camPos.x + mouseX * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (camPos.y - mouseY * 0.8 - camera.position.y) * 0.04;
      camera.position.z += (camPos.z - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      // Animations
      galaxyPoints.rotation.y = elapsed * 0.04;
      stars.rotation.y = elapsed * 0.003;
      nebulaPoints.rotation.y = elapsed * 0.015;
      nebulaPoints.rotation.z = elapsed * 0.008;
      sunMesh.rotation.y = elapsed * 0.15;
      earthMesh.rotation.y = elapsed * 0.25;

      // Orbit planets
      planetMeshes.forEach(p => {
        p.angle += p.speed * 0.3;
        p.mesh.position.x = Math.cos(p.angle) * p.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.distance;
        p.mesh.rotation.y += 0.01;
      });

      // Moon orbit
      moonMesh.position.x = Math.cos(elapsed * 0.6) * 4;
      moonMesh.position.z = Math.sin(elapsed * 0.6) * 4;
      moonMesh.position.y = Math.sin(elapsed * 0.3) * 0.3;

      // Jakarta marker pulse
      const pulse = 0.9 + Math.sin(elapsed * 3) * 0.1;
      jakartaGlow.scale.setScalar(pulse);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={mountRef} id="galaxy-canvas" />;
}