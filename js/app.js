// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = [];
const clock = new THREE.Clock();

const MODEL_PATH = "scene_garage.gltf";
const startPosition = {
  x: 0.18195096798711896,
  y: -1.112188446897392,
  z: -33.664122549907965
};

function init() {
  container = document.querySelector("#scene-container");

  scene = new THREE.Scene();
  //   scene.background = new THREE.Color(0x8fbcd4);

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    100000
  );

  camera.position.set(startPosition.x, startPosition.y, startPosition.z);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 100000);

  const mainLight = new THREE.DirectionalLight(0xffffff, 9);
  var light = new THREE.PointLight(0xfffff, 10, 100);
  light.position.set(
    startPosition.x + 10,
    startPosition.y + 10,
    startPosition.z + 10
  );
  scene.add(light);
  mainLight.position.set(startPosition.x, startPosition.y, startPosition.z);

  scene.add(ambientLight, mainLight);
}

function loadModels() {
  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = (gltf, position) => {
    const model = gltf.scene;
    model.position.copy(position);

    // const animation = gltf.animations[0];

    // const mixer = new THREE.AnimationMixer(model);
    // mixers.push(mixer);

    // const action = mixer.clipAction(animation);
    // action.play();

    scene.add(model);
  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3(0, 0, 2.5);
  loader.load(
    MODEL_PATH,
    gltf => onLoad(gltf, parrotPosition),
    onProgress,
    onError
  );
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
  //   see where the camera is, helpful for finding starting camera angle
  camera.updateMatrixWorld();
  var vector = camera.position.clone();
  console.log(vector);
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
