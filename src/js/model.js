import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
let container = null;
if (window.innerWidth <= 768) {
  container = document.getElementById("fullscreen-model");
} else {
  container = document.getElementById("model");
}
const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const light1 = new THREE.DirectionalLight(0xffffff, 1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(5, 5, 5).normalize();
light2.position.set(-5, -5, -5).normalize();
light3.position.set(0, 5, 0).normalize();
scene.add(light1, light2, light3, ambientLight);

const textureLoader = new THREE.TextureLoader();

let myTexture = null;
let myTexture2 = null;
let lightWood = textureLoader.load("/assets/models/light-wood.jpg");
let darkWood = textureLoader.load("/assets/models/dark-wood.JPG");
let bg = textureLoader.load("/assets/models/bg.jpg");
let lightWoodAO = textureLoader.load(
  "/assets/models/light-wood-ambient-occlusion-map.png"
);
let darkWoodAO = textureLoader.load(
  "/assets/models/dark-wood-ambient-occlusion-map.png"
);
let lightWoodNormal = textureLoader.load(
  "/assets/models/light-wood-normal-map.png"
);
let darkWoodNormal = textureLoader.load(
  "/assets/models/dark-wood-normal-map.png"
);

let activeWood = null;

const leftImageInput = document.getElementById("leftImage");
const rightImageInput = document.getElementById("rightImage");

const leftImageLabel = document.getElementById("leftImageLabel");
const rightImageLabel = document.getElementById("rightImageLabel");

const lightButton = document.getElementById("light");
const darkButton = document.getElementById("dark");

lightButton.addEventListener("click", (e) => {
  e.preventDefault();
  activeWood = {
    map: lightWood,
    aoMap: lightWoodAO,
    normalMap: lightWoodNormal,
  };
  updateTextureOnModel("Cube", lightWood);
  lightButton.style.borderColor = "#55dd4a";
  darkButton.style.borderColor = "";
});

darkButton.addEventListener("click", (e) => {
  e.preventDefault();
  activeWood = { map: darkWood, aoMap: darkWoodAO, normalMap: darkWoodNormal };
  updateTextureOnModel("Cube", darkWood);
  darkButton.style.borderColor = "#55dd4a";
  lightButton.style.borderColor = "";
});

leftImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myTexture2 = textureLoader.load(e.target.result);
      updateTextureOnModel("Mesh_1", myTexture2);

      leftImageLabel.textContent =
        file.name.length > 5 ? file.name.substring(0, 4) + "..." : file.name;
      leftImageLabel.style.borderColor = "#55dd4a";
      leftImageLabel.style.color = "#55dd4a";
    };
    reader.readAsDataURL(file);
  }
});

rightImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myTexture = textureLoader.load(e.target.result);
      updateTextureOnModel("Mesh", myTexture);

      rightImageLabel.textContent =
        file.name.length > 5 ? file.name.substring(0, 4) + "..." : file.name;
      rightImageLabel.style.borderColor = "#55dd4a";
      rightImageLabel.style.color = "#55dd4a";
    };
    reader.readAsDataURL(file);
  }
});

leftImageLabel.addEventListener("click", () => {
  leftImageInput.click();
});

rightImageLabel.addEventListener("click", () => {
  rightImageInput.click();
});

const simulateBtn = document.getElementById("simulateBtn");
const modelDisclaimerText = document.getElementById("model-disclaimer-text");
const simulateBtnFullScreen = document.getElementById("simulateBtnFullScreen");

document.getElementById("cross-fullscreen").addEventListener("click", () => {
  document.getElementById("fullscreen-model").style.top = "-100%";
  simulateBtnFullScreen.textContent = "Показать";
  simulateBtnFullScreen.style.pointerEvents = "auto";
  simulateBtnFullScreen.style.opacity = "1";
  simulateBtnFullScreen.style.cursor = "pointer";
  simulateBtnFullScreen.removeAttribute("disabled");
});

let model;

simulateBtn.addEventListener("click", () => {
  if (myTexture && myTexture2 && activeWood) {
    simulateBtn.textContent = "Секундочку...";
    simulateBtn.style.pointerEvents = "none";
    simulateBtn.style.opacity = "0.5";
    simulateBtn.style.cursor = "not-allowed";
    simulateBtn.setAttribute("disabled", "true");
    modelDisclaimerText.style.display = "none";
    loadModel();
  } else {
    alert("Пожалуйста, загрузите оба фото и выберите цвет!");
  }
});

document.getElementById("buy").addEventListener("click", () => {
  if (myTexture && myTexture2 && activeWood) {
    document.getElementById("modalWrapper").classList.add("active");
  } else {
    alert("Пожалуйста, смоделируйте модель!");
  }
});

simulateBtnFullScreen.addEventListener("click", () => {
  if (simulateBtnFullScreen.textContent === "Показать") {
    console.log("123");

    document.getElementById("fullscreen-model").style.top = "0%";
  } else if (myTexture && myTexture2 && activeWood) {
    simulateBtnFullScreen.textContent = "Секундочку...";
    simulateBtnFullScreen.style.pointerEvents = "none";
    simulateBtnFullScreen.style.opacity = "0.5";
    simulateBtnFullScreen.style.cursor = "not-allowed";
    simulateBtnFullScreen.setAttribute("disabled", "true");
    loadModel();

    if (window.innerWidth <= 768) {
      setTimeout(() => {
        document.getElementById("fullscreen-model").style.top = "0%";
      }, 1000);
    } else {
    }
  } else {
    alert("Пожалуйста, загрузите оба фото и выберите цвет!");
  }
});

function loadModel() {
  const loader = new GLTFLoader();

  loader.load(
    "/assets/models/zenwood.glb",
    (gltf) => {
      model = gltf.scene;
      model.traverse((object) => {
        if (object.isMesh && object.material) {
          if (object.name === "Mesh" && myTexture) {
            object.material.map = myTexture;
            myTexture.rotation = Math.PI / 2;
            myTexture.repeat.set(-2, 2);
            myTexture.wrapS = THREE.RepeatWrapping;
            myTexture.wrapT = THREE.RepeatWrapping;
            object.material.needsUpdate = true;
            object.material.metalness = 0;
            object.material.roughness = 1;
            object.material = new THREE.MeshBasicMaterial({
              map: myTexture,
            });
          }
          if (object.name === "Mesh_1" && myTexture2) {
            object.material.map = myTexture2;
            myTexture2.rotation = Math.PI / 2;
            myTexture2.repeat.set(-2, 2);
            myTexture2.wrapS = THREE.RepeatWrapping;
            myTexture2.wrapT = THREE.RepeatWrapping;
            object.material.needsUpdate = true;
            object.material.metalness = 0;
            object.material.roughness = 1;
            object.material = new THREE.MeshBasicMaterial({
              map: myTexture2,
            });
          }
          if (object.name === "Cube" && activeWood) {
            [activeWood.map, activeWood.aoMap, activeWood.normalMap].forEach(
              (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
              }
            );

            object.material = new THREE.MeshStandardMaterial({
              map: activeWood.map,
              aoMap: activeWood.aoMap,
              normalMap: activeWood.normalMap,
              metalness: 0,
              roughness: 0.8,
            });

            object.material.needsUpdate = true;
          }
          if (object.name === "Back" && bg) {
            object.material.map = bg;
            bg.wrapS = THREE.RepeatWrapping;
            bg.wrapT = THREE.RepeatWrapping;
            object.material.needsUpdate = true;
            object.material.metalness = 0;
            object.material.roughness = 1;
          }
        }
      });
      scene.add(model);

      simulateBtn.style.display = "none";
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}

function updateTextureOnModel(objectName, newTexture) {
  if (model) {
    model.traverse((object) => {
      if (
        object.name === objectName &&
        object.material &&
        object.name === "Cube"
      ) {
        object.material.map = newTexture;
        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.wrapT = THREE.RepeatWrapping;
        object.material.needsUpdate = true;
      }
      if (
        object.name === objectName &&
        object.material &&
        object.name !== "Cube"
      ) {
        object.material.map = newTexture;
        newTexture.rotation = Math.PI / 2;
        newTexture.repeat.set(2, 2);
        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.wrapT = THREE.RepeatWrapping;
        object.material.needsUpdate = true;
      }
    });
  }
}

camera.position.set(2.5, 2.5, 2.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;

let rotationSpeed = 0.005;
let rotationDirection = 1;
let isMouseOverCanvas = false;

container.addEventListener("mouseenter", () => {
  isMouseOverCanvas = true;
});

container.addEventListener("mouseleave", () => {
  isMouseOverCanvas = false;
});

function animate() {
  requestAnimationFrame(animate);

  if (model && !isMouseOverCanvas) {
    model.rotation.y += rotationSpeed * rotationDirection;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  const scaleFactor = width / height;
  camera.position.z = 5 / scaleFactor;
});
