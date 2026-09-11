// ========================================
// 1. SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    observer.observe(element);
});


// ========================================
// 2. THREE.JS
// ========================================

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ========================================
// 3. CONTAINER 3D
// ========================================

const container = document.getElementById("model3d-container");

if (!container) {

    console.error("3D container tidak ditemukan.");

} else {

    // Scene
    const scene = new THREE.Scene();


    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(0, 0.5, 6);


    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);


    // ========================================
    // 4. LIGHT
    // ========================================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2
    );

    scene.add(ambientLight);


    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    directionalLight.position.set(4, 5, 5);

    scene.add(directionalLight);


    const blueLight = new THREE.PointLight(
        0x8df0ff,
        10,
        20
    );

    blueLight.position.set(3, 2, 4);

    scene.add(blueLight);


    // ========================================
    // 5. LOAD MODEL GLB
    // ========================================

    const loader = new GLTFLoader();

    let model = null;


    loader.load(
        "./retro_computer.glb",

        function (gltf) {

            model = gltf.scene;

            // Ukuran
           scene.add(model);

// ================================
// OTOMATIS MENYESUAIKAN MODEL
// ================================

const box = new THREE.Box3().setFromObject(model);

const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

// Pindahkan model ke tengah
model.position.x -= center.x;
model.position.y -= center.y;
model.position.z -= center.z;

// Hitung ukuran terbesar
const maxSize = Math.max(
    size.x,
    size.y,
    size.z
);

// Skala otomatis
const targetSize = 3;
const scale = targetSize / maxSize;

model.scale.set(
    scale,
    scale,
    scale
);

// Posisi sedikit ke bawah
model.position.y = -0;

console.log("✅ Model 3D berhasil dimuat!");

        },

        function (progress) {

            if (progress.total) {

                const percent =
                    (progress.loaded / progress.total) * 100;

                console.log(
                    "Loading 3D:",
                    percent.toFixed(0) + "%"
                );
            }

        },

        function (error) {

            console.error(
                "❌ Model 3D gagal dimuat:",
                error
            );

        }
    );


    // ========================================
    // 6. RESIZE
    // ========================================

    window.addEventListener(
        "resize",
        function () {

            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height
            );

        }
    );


    // ========================================
    // 7. ANIMATION
    // ========================================

   let targetRotation = -0.5;
let currentRotation = -0.5;

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;

    targetRotation = -0.5 + scroll * 0.0015;
});


function animate() {
    requestAnimationFrame(animate);

    if (model) {
        currentRotation +=
            (targetRotation - currentRotation) * 0.08;

        model.rotation.y = currentRotation;
    }

    renderer.render(
        scene,
        camera
    );
}

animate();
}


// ========================================
// 8. 3D TILT CARD
// ========================================

const tiltCards =
    document.querySelectorAll("[data-tilt]");

tiltCards.forEach((card) => {

    card.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -5;

            const rotateY =
                ((x - centerX) / centerX) * 5;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "perspective(900px) rotateX(0deg) rotateY(0deg)";

        }
    );

});


// ========================================
// 9. ACTIVE NAVBAR
// ========================================

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll("nav a");


const navObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    navLinks.forEach((link) => {

                        link.classList.remove("active");

                    });


                    const activeLink =
                        document.querySelector(
                            `nav a[href="#${entry.target.id}"]`
                        );


                    if (activeLink) {

                        activeLink.classList.add("active");

                    }

                }

            });

        },
        {
            threshold: 0.45
        }
    );


sections.forEach((section) => {

    navObserver.observe(section);

});