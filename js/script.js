// --- Protección por contraseña para GitHub Pages ---
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('password-modal');
  var main = document.getElementById('main-content');
  var form = document.getElementById('password-form');
  var input = document.getElementById('password-input');
  var error = document.getElementById('password-error');
  var PASSWORD = 'aniversario';

  if (!modal || !main || !form || !input) return;

  form.onsubmit = function(e) {
    e.preventDefault();
    if (input.value === PASSWORD) {
      modal.style.display = 'none';
      main.style.display = '';
      input.value = '';
      error.style.display = 'none';
      // Inicializa el carrusel y listeners solo cuando el contenido es visible
      inicializarCarrusel();
    } else {
      error.style.display = 'block';
      input.value = '';
      input.focus();
    }
  };
  input.onkeydown = function(e) {
    if (e.key === 'Enter') form.onsubmit(e);
  };
});

function inicializarCarrusel() {
  // Variables y listeners del carrusel
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const playPauseBtn = document.querySelector('.play-pause');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const carousel = document.querySelector('.carousel-images');
  let current = 0;
  let shuffledOrder = [];
  let currentShuffleIndex = 0;
  let autoplayInterval;
  let isPlaying = false;

  // Función para barajar un array (algoritmo Fisher-Yates)
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Mensajes cacheados localmente para evitar recargas innecesarias
  const tempMessages = {};

  function renderCarousel() {
    if (urls.length === 0) {
      carousel.innerHTML = '<div class="no-images-msg">No hay imágenes para mostrar.</div>';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    const idx = current;
    const url = urls[idx];
    const photoKey = anifotos[idx];
    let savedMsg = tempMessages[photoKey] || '';
    carousel.innerHTML = `
      <div class="carousel-flip" id="flipCard">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${url}" alt="Foto ${idx+1}" class="active">
            <button class="flip-btn flip-icon-btn" id="toBackBtn" title="Escribir mensaje" style="position:absolute;bottom:12px;right:12px;z-index:3;padding:6px 8px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.85);border-radius:50%;box-shadow:0 2px 8px #e1b86644;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bd5532" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.25V21h3.75l11.06-11.06a2.12 2.12 0 0 0-3-3L3 17.25z"></path><path d="M14.5 6.5l3 3"></path></svg>
            </button>
          </div>
          <div class="flip-card-back">
            <textarea id="flipMsg" placeholder="Escribe aquí...">${savedMsg}</textarea>
            <button class="flip-btn" id="toFrontBtn">Volver</button>
          </div>
        </div>
      </div>
    `;
    // Flip logic
    const flipCard = document.getElementById('flipCard');
    const toBackBtn = document.getElementById('toBackBtn');
    const toFrontBtn = document.getElementById('toFrontBtn');
    const flipMsg = document.getElementById('flipMsg');
    if (toBackBtn) {
      toBackBtn.onclick = () => {
        flipCard.classList.add('flipped');
      };
    }
    if (toFrontBtn) {
      toFrontBtn.onclick = () => {
        flipCard.classList.remove('flipped');
      };
    }
    if (flipMsg) {
      // Cargar mensaje desde Firestore si no está en cache
      if (!tempMessages[photoKey]) {
        db.collection('flipMessages').doc(photoKey).get().then(doc => {
          if (doc.exists) {
            tempMessages[photoKey] = doc.data().message;
            flipMsg.value = tempMessages[photoKey];
          }
        });
      }
      flipMsg.addEventListener('input', () => {
        tempMessages[photoKey] = flipMsg.value;
        db.collection('flipMessages').doc(photoKey).set({ message: flipMsg.value });
      });
    }
  }
  window.renderCarousel = renderCarousel;

  // Crear orden aleatorio inicial
  shuffledOrder = shuffleArray(Array.from({length: urls.length}, (_, i) => i));
  currentShuffleIndex = 0;
  current = shuffledOrder[currentShuffleIndex];
  renderCarousel();

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (urls.length === 0) return;
      currentShuffleIndex = (currentShuffleIndex - 1 + shuffledOrder.length) % shuffledOrder.length;
      current = shuffledOrder[currentShuffleIndex];
      renderCarousel();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (urls.length === 0) return;
      currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
      current = shuffledOrder[currentShuffleIndex];
      renderCarousel();
    };
  }
  if (playPauseBtn) {
    playPauseBtn.onclick = function(e) {
      if (e.type === 'click' && (e.button === 0 || e.which === 1)) {
        toggleAutoplay();
      }
    };
  }

  function nextImage() {
    if (urls.length === 0) return;
    currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
    if (currentShuffleIndex === 0) {
      shuffledOrder = shuffleArray(Array.from({length: urls.length}, (_, i) => i));
    }
    current = shuffledOrder[currentShuffleIndex];
    renderCarousel();
  }

  function startAutoplay() {
    if (isPlaying) return;
    isPlaying = true;
    if (playPauseIcon) {
      playPauseIcon.src = 'css/pause.png';
      playPauseIcon.className = 'icon-pause';
    }
    autoplayInterval = setInterval(() => {
      nextImage();
      renderCarousel();
    }, 10000);
  }

  function stopAutoplay() {
    if (!isPlaying) return;
    isPlaying = false;
    if (playPauseIcon) {
      playPauseIcon.src = 'css/play.png';
      playPauseIcon.className = 'icon-play';
    }
    clearInterval(autoplayInterval);
  }

  function toggleAutoplay() {
    if (isPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }
}

// Carrusel de fotos simple sin Firebase
// Carrusel de fotos dinámico desde .txt de Google Drive

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const playPauseBtn = document.querySelector('.play-pause');
let current = 0;
const carousel = document.querySelector('.carousel-images');
let images = [];
let shuffledOrder = []; // Array para mantener el orden aleatorio
let currentShuffleIndex = 0; // Índice actual en el array barajado
let autoplayInterval;
let isPlaying = false; // Cambiado: iniciar pausado

const playPauseIcon = document.getElementById('playPauseIcon');

// Función para barajar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}


// No longer needed: showImage. Now handled by renderCarousel.

function nextImage() {
    if (urls.length === 0) return;
    currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
    if (currentShuffleIndex === 0) {
        shuffledOrder = shuffleArray(Array.from({length: urls.length}, (_, i) => i));
    }
    current = shuffledOrder[currentShuffleIndex];
    renderCarousel();
}

function startAutoplay() {
    if (isPlaying) return;
    isPlaying = true;
    if (playPauseIcon) {
      playPauseIcon.src = 'css/pause.png';
      playPauseIcon.className = 'icon-pause';
    }
    autoplayInterval = setInterval(() => {
      nextImage();
      renderCarousel();
    }, 10000); // Cambia cada 10 segundos
}

function stopAutoplay() {
    if (!isPlaying) return;
    isPlaying = false;
    if (playPauseIcon) {
      playPauseIcon.src = 'css/play.png';
      playPauseIcon.className = 'icon-play';
    }
    clearInterval(autoplayInterval);
}

function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

// Leer las imágenes de la carpeta local "anifotos" y generar el carrusel
const anifotos = [
    "1000000968.jpg",
    "1000026277.jpg",
    "1000100071.jpg",
    "1000122489.jpg",
    "1000130574.jpg",
    "foto1.jpg",
    "foto2.jpg",
    "IMG-20230902-WA0018.jpg",
    "IMG-20230930-WA0012.jpg",
    "IMG-20231008-WA0035.jpg",
    "IMG-20240602-WA0023.jpg",
    "IMG-20240602-WA0037.jpg",
    "IMG-20240609-WA0021.jpg",
    "IMG-20240609-WA0025.jpg",
    "IMG-20240609-WA0027.jpg",
    "IMG-20240609-WA0029.jpg",
    "IMG-20240616-WA0042.jpg",
    "IMG-20240616-WA0049.jpg",
    "IMG-20240616-WA0050.jpg",
    "IMG-20240617-WA0060.jpg",
    "IMG-20240623-WA0020.jpg",
    "IMG-20240630-WA0007.jpg",
    "IMG-20240709-WA0053.jpg",
    "IMG-20240709-WA0054.jpg",
    "IMG-20240722-WA0002.jpg",
    "IMG-20240722-WA0004.jpg",
    "IMG-20240722-WA0006.jpg",
    "IMG-20240722-WA0060.jpg",
    "IMG-20240725-WA0016.jpg",
    "IMG-20240725-WA0017.jpg",
    "IMG-20240725-WA0019.jpg",
    "IMG-20240826-WA0009.jpg",
    "IMG-20241006-WA0093.jpg",
    "IMG-20241006-WA0097.jpg",
    "IMG-20241014-WA0014.jpg",
    "IMG-20241019-WA0005.jpg",
    "IMG-20241019-WA0006.jpg",
    "IMG-20241025-WA0012.jpg",
    "IMG-20241103-WA0015.jpg",
    "IMG-20241103-WA0021.jpg",
    "IMG-20241110-WA0030.jpg",
    "IMG-20241110-WA0031.jpg",
    "IMG-20241117-WA0023.jpg",
    "IMG-20241117-WA0024.jpg",
    "IMG-20241208-WA0007.jpg",
    "IMG-20241212-WA0019.jpg",
    "IMG-20241215-WA0009.jpg",
    "IMG-20241215-WA0011.jpg",
    "IMG-20241225-WA0010.jpg",
    "IMG-20241225-WA0011.jpg",
    "IMG-20241225-WA0012.jpg",
    "IMG-20241225-WA0013.jpg",
    "IMG-20241228-WA0024.jpg",
    "IMG-20241228-WA0031.jpg",
    "IMG-20250114-WA0000.jpg",
    "IMG-20250215-WA0033.jpg",
    "IMG-20250215-WA0036.jpg",
    "IMG-20250215-WA0037.jpg",
    "IMG-20250321-WA0044.jpg",
    "IMG-20250325-WA0020.jpg",
    "IMG-20250330-WA0018.jpg",
    "IMG-20250512-WA0017.jpg",
    "IMG-20250512-WA0018.jpg",
    "IMG-20250530-WA0017.jpg",
    "IMG-20250530-WA0021.jpg",
    "IMG-20250530-WA0023.jpg",
    "IMG-20250530-WA0026.jpg",
    "IMG-20250614-WA0018.jpg",
    "IMG-20250628-WA0017.jpg",
    "IMG-20250628-WA0019.jpg",
    "IMG-20250628-WA0025.jpg",
    "IMG-20250628-WA0027.jpg",
    "IMG-20250628-WA0030.jpg",
    "IMG-20250628-WA0032.jpg",
    "IMG-20250629-WA0007.jpg",
    "IMG_20230908_181135.jpg",
    "IMG_20231103_180820.jpg",
    "IMG_20231103_233143.jpg",
    "IMG_20231114_222613.jpg",
    "IMG_20231125_114212.jpg",
    "IMG_20231125_150601.jpg",
    "IMG_20231130_133740.jpg",
    "IMG_20240323_121552.jpg",
    "IMG_20240403_213457.jpg",
    "IMG_20240518_134149.jpg",
    "IMG_20240518_134153.jpg",
    "IMG_20241130_205139.jpg",
    "IMG_20241224_210447.jpg",
    "IMG_20241224_210457.jpg",
    "IMG_20250215_190425.jpg",
    "IMG_20250215_200632.jpg",
    "IMG_20250411_143008.jpg",
    "IMG_20250418_185528.jpg",
    "IMG_20250419_174424.jpg",
    "IMG_20250419_174428.jpg",
    "IMG_20250503_155719.jpg",
    "IMG_20250628_192427.jpg",
    "IMG_20250628_192431.jpg"
];

const urls = anifotos.map(filename => `anifotos/${filename}`);
// --- INTEGRACIÓN FIREBASE FIRESTORE PARA MENSAJES PERSISTENTES ---
// Configuración Firebase (rellena con tus credenciales reales)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_IcjbhzZxcf78d4FGca2SiLcZmU-8NGU",
  authDomain: "aniversario-3a910.firebaseapp.com",
  projectId: "aniversario-3a910",
  storageBucket: "aniversario-3a910.appspot.com",
  messagingSenderId: "901698875349",
  appId: "1:901698875349:web:fdca923863aaeea58c975c",
  measurementId: "G-CEEDYF2JJ5"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
// Mensajes cacheados localmente para evitar recargas innecesarias
const tempMessages = {};
function renderCarousel() {
  if (urls.length === 0) {
    carousel.innerHTML = '<div class="no-images-msg">No hay imágenes para mostrar.</div>';
    images = [];
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  const idx = current;
  const url = urls[idx];
  const photoKey = anifotos[idx];
  // Si ya está en cache, úsalo; si no, busca en Firestore
  let savedMsg = tempMessages[photoKey] || '';
  carousel.innerHTML = `
    <div class="carousel-flip" id="flipCard">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img src="${url}" alt="Foto ${idx+1}" class="active">
          <button class="flip-btn flip-icon-btn" id="toBackBtn" title="Escribir mensaje" style="position:absolute;bottom:12px;right:12px;z-index:3;padding:6px 8px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.85);border-radius:50%;box-shadow:0 2px 8px #e1b86644;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bd5532" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.25V21h3.75l11.06-11.06a2.12 2.12 0 0 0-3-3L3 17.25z"></path><path d="M14.5 6.5l3 3"></path></svg>
          </button>
        </div>
        <div class="flip-card-back">
          <textarea id="flipMsg" placeholder="Escribe aquí...">${savedMsg}</textarea>
          <button class="flip-btn" id="toFrontBtn">Volver</button>
        </div>
      </div>
    </div>
  `;
  // Flip logic
  const flipCard = document.getElementById('flipCard');
  const toBackBtn = document.getElementById('toBackBtn');
  const toFrontBtn = document.getElementById('toFrontBtn');
  const flipMsg = document.getElementById('flipMsg');
  if (toBackBtn) {
    toBackBtn.onclick = () => {
      flipCard.classList.add('flipped');
    };
  }
  if (toFrontBtn) {
    toFrontBtn.onclick = () => {
      flipCard.classList.remove('flipped');
    };
  }
  if (flipMsg) {
    // Cargar mensaje desde Firestore si no está en cache
    if (!tempMessages[photoKey]) {
      db.collection('flipMessages').doc(photoKey).get().then(doc => {
        if (doc.exists) {
          tempMessages[photoKey] = doc.data().message;
          flipMsg.value = tempMessages[photoKey];
        }
      });
    }
    flipMsg.addEventListener('input', () => {
      tempMessages[photoKey] = flipMsg.value;
      db.collection('flipMessages').doc(photoKey).set({ message: flipMsg.value });
    });
  }
}

// Crear orden aleatorio inicial
shuffledOrder = shuffleArray(Array.from({length: urls.length}, (_, i) => i));
currentShuffleIndex = 0;
current = shuffledOrder[currentShuffleIndex];
renderCarousel();

prevBtn.onclick = () => {
  if (urls.length === 0) return;
  currentShuffleIndex = (currentShuffleIndex - 1 + shuffledOrder.length) % shuffledOrder.length;
  // No barajar aquí, solo avanzar/retroceder
  current = shuffledOrder[currentShuffleIndex];
  renderCarousel();
};
nextBtn.onclick = () => {
  if (urls.length === 0) return;
  currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
  // No barajar aquí, solo avanzar/retroceder
  current = shuffledOrder[currentShuffleIndex];
  renderCarousel();
};
playPauseBtn.onclick = function(e) {
  if (e.type === 'click' && (e.button === 0 || e.which === 1)) {
    toggleAutoplay();
  }
};
// NO iniciar autoplay automáticamente

// Animación de "flores" usando imágenes PNG personalizadas
const canvas = document.getElementById('flowers-bg');
const ctx = canvas.getContext('2d');
let flowers = [];
// Pon aquí los nombres de tus imágenes PNG (deben estar en la carpeta del proyecto)
const flowerImages = [
    'flores/flor1.png',
    'flores/flor2.png',
    'flores/flor3.png',
    'flores/flor4.png',
    'flores/flor5.png',
];
const loadedImages = [];
let imagesLoaded = 0;

// Cargar imágenes
for (let src of flowerImages) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === flowerImages.length) {
            startFlowers();
        }
    };
    loadedImages.push(img);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomFlower() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 24 + Math.random() * 32, // tamaño de la imagen
        img: loadedImages[Math.floor(Math.random() * loadedImages.length)],
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        sway: 10 + Math.random() * 20,
        swaySpeed: 0.01 + Math.random() * 0.02
    };
}

function drawFlowerImg(f) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.translate(f.x + Math.sin(f.angle) * f.sway, f.y);
    ctx.drawImage(f.img, -f.r/2, -f.r/2, f.r, f.r);
    ctx.globalAlpha = 1;
    ctx.restore();
}

function animateFlowers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let f of flowers) {
        drawFlowerImg(f);
        f.y += f.speed;
        f.angle += f.swaySpeed;
        if (f.y - f.r > canvas.height) {
            // Reiniciar arriba
            Object.assign(f, randomFlower(), { y: -f.r });
        }
    }
    requestAnimationFrame(animateFlowers);
}

function startFlowers() {
    flowers = [];
    for (let i = 0; i < 18; i++) {
        flowers.push(randomFlower());
    }
    animateFlowers();
    // Inicializar aviones después de las flores
    initPlanes();
}

// Funcionalidad de aviones con pancartas
function initPlanes() {
    // Colores para modo diurno y nocturno
    const colorsDay = [
        {
            a: '#373b44',
            b: '#dee1b6',
            c: '#73c8a9',
            d: '#e1b866',
        },
        {
            a: '#bd5532',
            b: '#dee1b6',
            c: '#e1b866',
            d: '#73c8a9',
        },
        {
            a: '#373b44',
            b: '#73c8a9',
            c: '#dee1b6',
            d: '#bd5532',
        }
    ];
    const colorsNight = [
        {
            a: '#fffbe9',
            b: '#2a3557',
            c: '#3a4a7a',
            d: '#232b45',
        },
        {
            a: '#ffe6c1',
            b: '#232b45',
            c: '#3a4a7a',
            d: '#fffbe9',
        },
        {
            a: '#fffbe9',
            b: '#3a4a7a',
            c: '#232b45',
            d: '#ffe6c1',
        }
    ];

    // Detecta modo nocturno
    function getCurrentColors() {
        return document.body.classList.contains('night-mode') ? colorsNight : colorsDay;
    }

    const planeSvg = () => {
        const palette = getCurrentColors();
        const { a, b, c, d } = palette[Math.floor(Math.random() * palette.length)];
        return `<svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 52 26"><path fill="${a}" d="M 35 2h1v1h-1v-1"/> <path fill="${a}" d="M 42 2h1v1h-1v-1"/> <path fill="${a}" d="M 9 3h1v1h-1v-1"/> <path fill="${a}" d="M 16 3h1v1h-1v-1"/> <path fill="${a}" d="M 34 3h1v6h-1v-6"/> <path fill="${b}" d="M 35 3h1v1h1v1h4v-1h1v-1h1v6h-1v1h-6v-1h-1v-6"/> <path fill="${a}" d="M 36 3h1v1h-1v-1"/> <path fill="${a}" d="M 41 3h1v1h-1v-1"/> <path fill="${a}" d="M 43 3h1v6h-1v-6"/> <path fill="${a}" d="M 8 4h1v6h-1v-6"/> <path fill="${b}" d="M 9 4h1v1h1v1h4v-1h1v-1h1v6h-1v1h-6v-1h-1v-6"/> <path fill="${a}" d="M 10 4h1v1h-1v-1"/> <path fill="${a}" d="M 15 4h1v1h-1v-1"/> <path fill="${a}" d="M 17 4h1v6h-1v-6"/> <path fill="${a}" d="M 37 4h4v1h-4v-1"/> <path fill="${a}" d="M 11 5h4v1h-4v-1"/> <path fill="${c}" d="M 23 6h2v6h-1v-1h-1v-1h-3v-1h1v-1h1v-1h1v-1"/> <path fill="${a}" d="M 36 6h1v2h-1v-2"/> <path fill="${a}" d="M 41 6h1v2h-1v-2"/> <path fill="${c}" d="M 49 6h2v6h-1v-1h-1v-1h-3v-1h1v-1h1v-1h1v-1"/> <path fill="${a}" d="M 10 7h1v2h-1v-2"/> <path fill="${a}" d="M 15 7h1v2h-1v-2"/> <path fill="${a}" d="M 38 8h2v1h-2v-1"/> <path fill="${a}" d="M 12 9h2v1h-2v-1"/> <path fill="${a}" d="M 35 9h1v1h-1v-1"/> <path fill="${a}" d="M 42 9h1v1h-1v-1"/> <path fill="${d}" d="M 5 10h3v1h1v1h1v1h6v-1h1v-1h1v-1h5v1h1v1h1v2h-4v1h1v1h1v1h-1v1h-5v-3h-1v-1h-6v1h-1v3h-6v-1h-1v-1h-1v-3h1v-1h1v-1h2v-1"/> <path fill="${c}" d="M 8 10h1v1h-1v-1"/> <path fill="${a}" d="M 9 10h1v1h-1v-1"/> <path fill="${a}" d="M 16 10h1v1h-1v-1"/> <path fill="${c}" d="M 17 10h1v1h-1v-1"/> <path fill="${d}" d="M 31 10h3v1h1v1h1v1h6v-1h1v-1h1v-1h5v1h1v1h1v2h-4v1h1v1h1v1h-1v1h-5v-3h-1v-1h-6v1h-1v3h-6v-1h-1v-1h-1v-3h1v-1h1v-1h2v-1"/> <path fill="${c}" d="M 34 10h1v1h-1v-1"/> <path fill="${b}" d="M 35 10h1v1h-1v-1"/> <path fill="${a}" d="M 36 10h6v1h-6v-1"/> <path fill="${b}" d="M 42 10h1v1h-1v-1"/> <path fill="${c}" d="M 43 10h1v1h-1v-1"/> <path fill="${c}" d="M 9 11h1v1h-1v-1"/> <path fill="${a}" d="M 10 11h6v1h-6v-1"/> <path fill="${c}" d="M 16 11h1v1h-1v-1"/> <path fill="${c}" d="M 35 11h1v1h-1v-1"/> <path fill="${b}" d="M 36 11h6v1h-6v-1"/> <path fill="${c}" d="M 42 11h1v1h-1v-1"/> <path fill="${c}" d="M 10 12h6v1h-6v-1"/> <path fill="${c}" d="M 36 12h6v1h-6v-1"/> <path fill="${c}" d="M 10 14h6v1h1v7h-1v1h-3v-1h-1v-1h-1v-1h-1v-1h-1v-4h1v-1"/> <path fill="${c}" d="M 21 14h4v4h-1v-1h-1v-1h-1v-1h-1v-1"/> <path fill="${c}" d="M 36 14h6v1h1v7h-1v1h-3v-1h-1v-1h-1v-1h-1v-1h-1v-4h1v-1"/> <path fill="${c}" d="M 47 14h4v4h-1v-1h-1v-1h-1v-1h-1v-1"/></svg>`;
    };

    const rope = () => {
        const a = '#fff';
        return `
        <div class="rope">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 26 26">
                <path fill="${a}" d="M 24 9h1v1h-1v-1"/> <path fill="${a}" d="M 23 10h1v1h-1v-1"/> <path fill="${a}" d="M 22 11h1v1h-1v-1"/> <path fill="${a}" d="M 21 12h1v1h-1v-1"/> <path fill="${a}" d="M 1 13h20v1h-20v-1"/> <path fill="${a}" d="M 21 14h1v1h-1v-1"/> <path fill="${a}" d="M 22 15h1v1h-1v-1"/> <path fill="${a}" d="M 23 16h1v1h-1v-1"/> <path fill="${a}" d="M 24 17h1v1h-1v-1"/>
            </svg>
        </div>`;
    };

    const planeTimer = [];
    const wrapper = document.querySelector('.wrapper');
    const cellD = 60;
    // Todos los valores en cero para que los aviones pasen pegados al borde superior
    const topValues = [0, 0, 0, 0];
    // Escribe aquí tus frases personalizadas, una por elemento
    let bannerContents = [
        'Tu me haces feliz',
        'Me encanta compartir contigo',
        'Por eso siempre querré darte más de mi',
        'También otras sorpresas',
        '¿esperas otra?',
        'Claro que sí hay... y habrán',
        'Un día más contigo',
        'Es lo que necesito para estar bien',
        'Ah, espera',
        'Otro regalo llega la otra semana',
        'C***U B**K'
    ];
    const banners = bannerContents;
    let spriteId = 0;
    let topIndex = 3;
    let count = 0;
    let bannerIndex = 0;

    const animate = (actor, frame, cellD) => {
        const leftV = +(actor.style.left).replace('px', '');
        let newLeftV = leftV - cellD;
        newLeftV = newLeftV < ((-1 * (frame - 1)) * cellD) ? 0 : newLeftV;
        actor.style.left = `${newLeftV}px`;
    };

    const bop = (actors, index) => {
        const actor = actors[index];
        const motion = 6;
        const topV = actor.dataset.top ? actor.dataset.top : motion;
        const newTopV = +topV === motion ? -motion : motion;
        actor.style.top = `${newTopV}px`;
        actor.dataset.top = newTopV;
        if (actor.classList.contains('front')) actor.childNodes[3].style.transform = `rotate(${newTopV / (motion / -2)}deg)`;
        setTimeout(() => {
            const newIndex = index >= (actors.length - 1) ? 0 : index + 1;
            bop(actors, newIndex);
        }, 120);
    };

    const mapModules = words => {
        return words.map(word => {
            return `
            <div class="message module module_${spriteId}">
                ${word}
            </div>
            `;
        }).join('');
    };

    const createPlane = sentence => {
        const plane = document.createElement('div');
        spriteId++;
        plane.classList.add('plane_wrapper');
        plane.innerHTML = `
        <div class="front module module_${spriteId}">
            <div class="sprite_container">
                <div class="sprite sprite_${spriteId}">
                    ${planeSvg()}
                </div>    
            </div>
            ${rope()}
        </div>    
        ${mapModules(sentence.split(' '))}
        `;
        wrapper.append(plane);
        const sprite = document.querySelector(`.sprite_${spriteId}`);
        setInterval(() => {
            animate(sprite, 2, cellD);
        }, 200);
        const modules = document.querySelectorAll(`.module_${spriteId}`);
        bop(modules, 0);
        topIndex = (topIndex + 1) < topValues.length ? topIndex + 1 : 0;

        if (count === banners.length) {
            topIndex = 0;
            count = 0;
            return;
        }
        // Restar un margen mayor para que el avión pase aún más arriba del borde superior
        plane.style.top = `${topValues[topIndex] * plane.offsetHeight + (20 * topValues[topIndex]) - 40}px`;
        plane.style.left = '100%';
        plane.style.transition = '6s ease';

        planeTimer[bannerIndex].timerOne = setTimeout(() => {
            plane.style.left = '10%';
        }, 100);
        planeTimer[bannerIndex].timerTwo = setTimeout(() => {
            plane.style.left = `-${plane.offsetWidth + 200}px`;
        }, 8000);
        planeTimer[bannerIndex].timerThree = setTimeout(() => {
            wrapper.removeChild(plane);
            const planeNo = document.querySelectorAll('.plane_wrapper').length;
            if ((count === banners.length && planeNo < banners.length)) {
                topIndex = 3;
                count = 0;
                createPlanes();
            }
        }, 20000);
    };

    // No se necesita splitTextForBanners ni calcWrapIndex con array

    const createTimers = () => {
        planeTimer.length = 0;
        banners.forEach(() => {
            planeTimer.push({
                timerOne: null,
                timerTwo: null,
                timerThree: null,
            });
        });
    };

    let shownCount = 0;
    let intervalId = null;
    const createPlanes = () => {
        // Limpiar el avión anterior antes de mostrar el nuevo
        wrapper.innerHTML = '<div class="flex_wrapper"></div>';
        spriteId = 0;
        topIndex = 3;
        count = 0;
        bannerIndex = 0;
        createTimers();
        if (shownCount >= 10) {
            // Detener el intervalo y no mostrar más aviones
            if (intervalId) clearInterval(intervalId);
            return;
        }
        let bannerText = banners[shownCount];
        createPlane(bannerText.replaceAll('#', ' '));
        shownCount++;
    };

    const resetPlanes = () => {
        planeTimer.forEach(timers => {
            clearTimeout(timers.timerOne);
            clearTimeout(timers.timerTwo);
            clearTimeout(timers.timerThree);
        });
        wrapper.innerHTML = '<div class="flex_wrapper"></div>';
        spriteId = 0;
        topIndex = 3;
        count = 0;
        bannerIndex = 0;
        // splitTextForBanners(); // Elimina esta línea, no es necesaria
        createTimers();
        createPlanes();
    };

    createTimers();
    createPlanes(); // Muestra la primera frase al cargar

    // Mostrar la siguiente frase cada 30 segundos, hasta el total de frases
    intervalId = setInterval(() => {
        createPlanes();
    }, 30000);

    window.addEventListener('resize', resetPlanes);

    // Función global para cambiar el texto de la pancarta dinámicamente
    window.cambiarPancarta = (nuevoTexto) => {
        bannerContent = nuevoTexto;
        resetPlanes();
        console.log(`Pancarta cambiada a: "${nuevoTexto}"`);
    };
}

// === LISTA DE DESEOS CON FIREBASE FIRESTORE ===
(function () {
  // Espera a que el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupDeseos);
  } else {
    setupDeseos();
  }

  function setupDeseos() {
    // Verifica duplicidad de IDs
    const deseosForm = document.getElementById('deseos-form');
    const deseosInput = document.getElementById('deseo-input');
    const deseosLista = document.getElementById('deseos-lista');
    if (!deseosForm || !deseosInput || !deseosLista) {
      console.error('No se encontraron los elementos de la lista de deseos. Verifica los IDs en el HTML.');
      return;
    }

    // Verifica que solo haya un elemento con cada ID
    ['deseos-form', 'deseo-input', 'deseos-lista'].forEach(id => {
      if (document.querySelectorAll(`#${id}`).length > 1) {
        console.error(`Duplicidad de ID: ${id}. Solo debe haber uno en el HTML.`);
      }
    });

    // Verifica inicialización de Firebase
    if (!window.firebase || !window.firebase.firestore) {
      console.error('Firebase no está inicializado correctamente.');
      return;
    }
    const db = window.firebase.firestore();
    const deseosRef = db.collection('deseos');

    function renderDeseosFirebase(deseos) {
      deseosLista.innerHTML = '';
      if (deseos.length === 0) {
        deseosLista.innerHTML = '<li class="deseo-vacio">(Sin deseos aún)</li>';
        return;
      }
      const mushroomIcons = [
        'css/mushroom1.png',
        'css/mushroom2.png',
        'css/mushroom3.png',
        'css/mushroom4.png',
        'css/mushroom5.png',
        'css/mushroom6.png',
      ];
      deseos.forEach((deseo) => {
        const li = document.createElement('li');
        li.className = 'deseo-item' + (deseo.hecho ? ' hecho' : '');
        const iconUrl = mushroomIcons[Math.floor(Math.random() * mushroomIcons.length)];
        li.innerHTML = `
          <label class="deseo-check-label" style="--mushroom-icon: url('${iconUrl}')">
            <input type="checkbox" class="deseo-check" ${deseo.hecho ? 'checked' : ''} data-id="${deseo.id}">
            <span class="deseo-text">${deseo.texto}</span>
          </label>
          <button class="deseo-eliminar" title="Eliminar" data-id="${deseo.id}">
            <img src="css/shovel.gif" alt="Eliminar" style="height:1em;vertical-align:middle;margin-top:-3px;">
          </button>
        `;
        deseosLista.appendChild(li);
      });
    }

    // Escucha en tiempo real los cambios en la colección de deseos
    deseosRef.orderBy('fecha', 'asc').onSnapshot(snapshot => {
      const deseos = [];
      snapshot.forEach(doc => {
        deseos.push({ id: doc.id, ...doc.data() });
      });
      renderDeseosFirebase(deseos);
    }, err => {
      console.error('Error al leer deseos de Firestore:', err);
    });

    // Añadir nuevo deseo
    deseosForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const texto = deseosInput.value.trim();
      if (!texto) return;
      try {
        await deseosRef.add({
          texto,
          hecho: false,
          fecha: new Date()
        });
        deseosInput.value = '';
      } catch (err) {
        alert("Error al añadir el deseo. Intenta de nuevo.");
        console.error('Error al añadir el deseo:', err);
      }
    });

    // Eliminar o marcar como hecho
    deseosLista.addEventListener('click', async function(e) {
      let btn = null;
      if (e.target.classList.contains('deseo-eliminar')) {
        btn = e.target;
      } else if (e.target.tagName === 'IMG' && e.target.parentElement.classList.contains('deseo-eliminar')) {
        btn = e.target.parentElement;
      }
      if (btn) {
        const id = btn.getAttribute('data-id');
        try {
          await deseosRef.doc(id).delete();
        } catch (err) {
          alert("Error al eliminar el deseo.");
          console.error('Error al eliminar el deseo:', err);
        }
      } else if (e.target.classList.contains('deseo-check')) {
        const id = e.target.getAttribute('data-id');
        const hecho = e.target.checked;
        try {
          await deseosRef.doc(id).update({ hecho });
        } catch (err) {
          alert("Error al actualizar el deseo.");
          console.error('Error al actualizar el deseo:', err);
        }
      }
    });
  }
})();

// === PANEL LITERARIO SINCRONIZADO FIRESTORE ===
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupLiterario);
  } else {
    setupLiterario();
  }

  function setupLiterario() {
    const form = document.getElementById('literario-form');
    const textoInput = document.getElementById('literario-texto');
    const autorInput = document.getElementById('literario-autor');
    const lista = document.getElementById('literario-lista');
    if (!form || !textoInput || !autorInput || !lista) return;

    // Firestore
    if (!window.firebase || !window.firebase.firestore) return;
    const db = window.firebase.firestore();
    const litRef = db.collection('literario');

    // Render literario items
    function renderLiterario(items) {
      lista.innerHTML = '';
      if (items.length === 0) {
        lista.innerHTML = '<li class="literario-item" style="opacity:0.7;">(Sin textos aún)</li>';
        return;
      }
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'literario-item';
        li.innerHTML = `
          <span class="literario-texto">${item.texto}</span>
          ${item.autor ? `<span class="literario-autor">— ${item.autor}</span>` : ''}
          <div class="literario-actions">
            <button class="literario-fav-btn${item.favorito ? ' fav' : ''}" title="Favorito">&#9733;</button>
            <button class="literario-edit-btn" title="Editar">&#9998;</button>
            <button class="literario-del-btn" title="Eliminar">&#128465;</button>
          </div>
        `;
        // Expand/collapse on click
        li.onclick = function(e) {
          if (
            e.target.classList.contains('literario-fav-btn') ||
            e.target.classList.contains('literario-del-btn') ||
            e.target.classList.contains('literario-edit-btn')
          ) return;
          li.classList.toggle('expanded');
        };
        // Favorito
        li.querySelector('.literario-fav-btn').onclick = async function(e) {
          e.stopPropagation();
          try {
            await litRef.doc(item.id).update({ favorito: !item.favorito });
          } catch (err) { alert("Error al marcar favorito."); }
        };
        // Editar
        li.querySelector('.literario-edit-btn').onclick = async function(e) {
          e.stopPropagation();
          const nuevoTexto = prompt("Modifica el texto:", item.texto);
          if (nuevoTexto === null) return;
          const nuevoAutor = prompt("Modifica el autor:", item.autor || "");
          if (nuevoAutor === null) return;
          try {
            await litRef.doc(item.id).update({
              texto: nuevoTexto.trim(),
              autor: nuevoAutor.trim()
            });
          } catch (err) { alert("Error al editar."); }
        };
        // Eliminar
        li.querySelector('.literario-del-btn').onclick = async function(e) {
          e.stopPropagation();
          if (confirm("¿Eliminar este texto?")) {
            try {
              await litRef.doc(item.id).delete();
            } catch (err) { alert("Error al eliminar."); }
          }
        };
        lista.appendChild(li);
      });
    }

    // Escucha en tiempo real los textos literarios
    litRef.orderBy('fechaTS', 'desc').onSnapshot(snapshot => {
      const items = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        items.push({
          id: doc.id,
          texto: data.texto,
          autor: data.autor,
          favorito: !!data.favorito,
          fechaTS: data.fechaTS
        });
      });
      renderLiterario(items);
    });

    // Añadir nuevo texto literario
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const texto = textoInput.value.trim();
      const autor = autorInput.value.trim();
      if (!texto) return;
      const fechaObj = new Date();
      try {
        await litRef.add({
          texto,
          autor,
          favorito: false,
          fechaTS: fechaObj.getTime()
        });
        textoInput.value = '';
        autorInput.value = '';
      } catch (err) {
        alert("Error al guardar el texto.");
      }
    });
  }
})();

// Detecta cambio de modo nocturno y reinicia los aviones con nuevos colores
document.addEventListener('DOMContentLoaded', function() {
  const nightBtn = document.getElementById('night-mode-btn');
  if (nightBtn) {
    nightBtn.addEventListener('click', function() {
      // Espera a que el modo nocturno se aplique y reinicia los aviones
      setTimeout(() => {
        if (typeof initPlanes === 'function') {
          // Elimina todos los aviones actuales y vuelve a crear
          const wrapper = document.querySelector('.wrapper');
          if (wrapper) wrapper.innerHTML = '<div class="flex_wrapper"></div>';
          initPlanes();
        }
      }, 300);
    });
  }
});
