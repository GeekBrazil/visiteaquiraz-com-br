import * as THREE from "three";
import { GLTFLoader } from "three/addons/GLTFLoader.js";

// =============================================================================
// 1. HERO 3D SHOWROOM — RÉPLICA ARQUITETÔNICA DA AQUIRAZ MOTOS STORE (BLENDER)
// =============================================================================
const canvas = document.getElementById("aquiraz-3d-canvas");
const wrap = document.getElementById("fachada-3d");

if (canvas && wrap) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#090a0d");
  scene.fog = new THREE.FogExp2("#090a0d", 0.022);

  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 120);

  // Studio PMREM reflection environment (metallic ACM + glossy helmets + chrome exhaust!)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#141720");
  const panel1 = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  panel1.position.set(6, 9, 8);
  panel1.lookAt(0, 0, 0);
  envScene.add(panel1);
  const panel2 = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), new THREE.MeshBasicMaterial({ color: 0xff2b3c }));
  panel2.position.set(-10, 4, 4);
  panel2.lookAt(0, 0, 0);
  envScene.add(panel2);
  const envRT = pmrem.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();

  // Showroom architectural lighting
  scene.add(new THREE.HemisphereLight(0xeef3ff, 0x161820, 0.92));

  const keyLight = new THREE.DirectionalLight(0xfff7ee, 2.35);
  keyLight.position.set(10, 15, 13);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 48;
  keyLight.shadow.camera.left = -12;
  keyLight.shadow.camera.right = 12;
  keyLight.shadow.camera.top = 12;
  keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimRed = new THREE.DirectionalLight(0xff2436, 1.45);
  rimRed.position.set(-12, 7, -6);
  scene.add(rimRed);

  const fillCool = new THREE.DirectionalLight(0xc2dcff, 0.72);
  fillCool.position.set(-8, 6, 12);
  scene.add(fillCool);

  // Dark asphalt showroom ground reflecting subtle crimson glow
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.42, metalness: 0.35 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  const showroomRoot = new THREE.Group();
  showroomRoot.position.set(3.2, 0.0, -0.6);
  showroomRoot.rotation.y = -0.26;
  showroomRoot.scale.setScalar(0.84);
  scene.add(showroomRoot);

  // Interior warm showroom lights
  const inL = new THREE.PointLight(0xfff6e8, 16, 11, 1.6);
  inL.position.set(-2.3, 3.3, -0.7);
  showroomRoot.add(inL);
  const inR = new THREE.PointLight(0xffffff, 15, 11, 1.6);
  inR.position.set(2.6, 3.3, -0.7);
  showroomRoot.add(inR);
  const bikeSpot = new THREE.PointLight(0xff2b3c, 12, 8, 1.8);
  bikeSpot.position.set(-1.55, 1.1, 3.1);
  showroomRoot.add(bikeSpot);

  let bikeNode = null;
  let rearWheelNode = null;
  let frontWheelNode = null;

  const loader = new GLTFLoader();
  loader.load("/aquirazmotos/3d/aquiraz_motos_showroom.glb?v=3", (gltf) => {
    const model = gltf.scene;
    model.traverse((obj) => {
      if (obj.name === "Hero_Sportbike") bikeNode = obj;
      if (obj.name === "Hero_Sportbike_Wheel_Rear") rearWheelNode = obj;
      if (obj.name === "Hero_Sportbike_Wheel_Front") frontWheelNode = obj;
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          if (m.isMeshStandardMaterial) {
            m.envMapIntensity = m.name.includes("Metal_") || m.name.includes("Helmet_") ? 1.5 : 1.05;
            if (m.name.includes("Glow_WhiteSign")) m.emissiveIntensity = 1.65;
            if (m.name.includes("Glow_CrimsonSign")) m.emissiveIntensity = 1.45;
            m.needsUpdate = true;
          }
        });
      }
    });
    showroomRoot.add(model);
  });

  // 3 Interactive Camera Presets (Fachada Completa | Esportiva | Vitrine Capacetes)
  const CAM_PRESETS = {
    facade:   { pos: new THREE.Vector3(-2.6, 4.9, 14.8), look: new THREE.Vector3(1.1, 2.75, -0.6) },
    bike:     { pos: new THREE.Vector3(-1.4, 2.1,  7.6), look: new THREE.Vector3(1.9, 1.05,  1.2) },
    showroom: { pos: new THREE.Vector3( 5.8, 3.4,  9.2), look: new THREE.Vector3(4.5, 2.25, -1.6) },
  };
  let activePreset = "facade";
  const curPos = CAM_PRESETS.facade.pos.clone();
  const curLook = CAM_PRESETS.facade.look.clone();

  document.querySelectorAll(".cam-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cam-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePreset = btn.dataset.cam || "facade";
      dragYaw = 0;
      dragPitch = 0;
    });
  });

  // Smooth interactive pointer drag + parallax
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragYaw = 0;
  let dragPitch = 0;
  let mouseX = 0;
  let mouseY = 0;

  wrap.addEventListener("pointerdown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("pointerup", () => { isDragging = false; });
  window.addEventListener("pointermove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    if (isDragging) {
      dragYaw = Math.max(-0.55, Math.min(0.65, dragYaw + (e.clientX - lastX) * 0.0045));
      dragPitch = Math.max(-0.22, Math.min(0.32, dragPitch + (e.clientY - lastY) * 0.003));
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  const resize = () => {
    const w = wrap.clientWidth;
    const h = Math.max(1, wrap.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener("resize", resize);

  let prev = performance.now();
  let t = 0;
  const tick = (now) => {
    requestAnimationFrame(tick);
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    t += dt;

    const target = CAM_PRESETS[activePreset] || CAM_PRESETS.facade;
    const damp = 1 - Math.exp(-4.5 * dt);
    curPos.lerp(target.pos, damp);
    curLook.lerp(target.look, damp);

    camera.position.set(
      curPos.x + mouseX * 0.65,
      curPos.y + mouseY * 0.25 + dragPitch * 4.0,
      curPos.z
    );
    camera.lookAt(curLook.x, curLook.y, curLook.z);

    showroomRoot.rotation.y += ((-0.26 + dragYaw + Math.sin(t * 0.22) * 0.025) - showroomRoot.rotation.y) * damp;
    bikeSpot.intensity = 10 + Math.sin(t * 2.6) * 2.8;

    if (rearWheelNode) rearWheelNode.rotation.z -= dt * 1.1;
    if (frontWheelNode) frontWheelNode.rotation.z -= dt * 1.1;
    if (bikeNode) bikeNode.position.y = 0.12 + Math.sin(t * 1.8) * 0.015;

    renderer.render(scene, camera);
  };
  requestAnimationFrame(tick);
}

// =============================================================================
// 2. FILTRO DA VITRINE REAL + EFEITO 3D TILT NOS CARDS
// =============================================================================
const filterTabs = document.querySelectorAll(".filter-tab");
const cards = document.querySelectorAll(".product-card");
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const cat = tab.dataset.filter;
    cards.forEach((c) => {
      c.classList.toggle("hidden", cat !== "all" && c.dataset.cat !== cat);
    });
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// =============================================================================
// 3. SIMULADOR INTERATIVO DE PARCELAMENTO (ATÉ 10x SEM JUROS)
// =============================================================================
const simInput = document.getElementById("sim-valor");
const simRange = document.getElementById("sim-range");
const simOut = document.getElementById("sim-parcela");
const simBtn = document.getElementById("sim-wa-btn");

function updateSim(val) {
  const num = Math.max(50, Math.min(15000, Number(val) || 499));
  const parcela = (num / 10).toFixed(2).replace(".", ",");
  const totalFmt = num.toFixed(2).replace(".", ",");
  if (simInput) simInput.value = String(Math.round(num));
  if (simRange) simRange.value = String(Math.min(3000, Math.round(num)));
  if (simOut) simOut.textContent = `10x de R$ ${parcela}`;
  if (simBtn) {
    const msg = encodeURIComponent(
      `Olá Aquiraz Motos Store! Simulei no site um orçamento de R$ ${totalFmt} (em até 10x de R$ ${parcela} sem juros). Podem me atender?`
    );
    simBtn.href = `https://wa.me/5585985775131?text=${msg}`;
  }
}

if (simInput && simRange) {
  simInput.addEventListener("input", () => updateSim(simInput.value));
  simRange.addEventListener("input", () => updateSim(simRange.value));
  document.querySelectorAll(".calc-presets button").forEach((b) => {
    b.addEventListener("click", () => updateSim(b.dataset.val));
  });
  updateSim(499);
}

