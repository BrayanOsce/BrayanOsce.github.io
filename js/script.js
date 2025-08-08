// --- Firebase Authentication para GitHub Pages ---
const firebaseConfig = {
  apiKey: "AIzaSyA_IcjbhzZxcf78d4FGca2SiLcZmU-8NGU",
  authDomain: "aniversario-3a910.firebaseapp.com",
  projectId: "aniversario-3a910",
  storageBucket: "aniversario-3a910.appspot.com",
  messagingSenderId: "901698875349",
  appId: "1:901698875349:web:fdca923863aaeea58c975c",
  measurementId: "G-CEEDYF2JJ5"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales para autenticación
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('password-modal');
  const main = document.getElementById('main-content');
  const authForm = document.getElementById('auth-form');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const authError = document.getElementById('auth-error');
  const authLoading = document.getElementById('auth-loading');

  if (!modal || !main || !authForm) return;

  // Función para mostrar error
  function showError(message) {
    authError.textContent = message;
    authError.style.display = 'block';
    authLoading.style.display = 'none';
  }

  // Función para mostrar loading
  function showLoading() {
    authError.style.display = 'none';
    authLoading.style.display = 'block';
  }

  // Función para ocultar mensajes
  function hideMessages() {
    authError.style.display = 'none';
    authLoading.style.display = 'none';
  }

  // Función para mostrar contenido principal
  function showMainContent(user) {
    currentUser = user;
    modal.style.display = 'none';
    main.style.display = '';
    
    // Inicializar todos los componentes
    inicializarCarrusel();
    setupDeseos();
    setupLiterario();
    
    console.log('Usuario autenticado:', user.email);
  }

  // Login con email y contraseña
  authForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
      showError('Por favor completa todos los campos');
      return;
    }

    showLoading();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      showMainContent(userCredential.user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  });

  // Registro de nueva cuenta
  registerBtn.addEventListener('click', async function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
      showError('Por favor completa todos los campos para registrarte');
      return;
    }

    if (password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    showLoading();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      showMainContent(userCredential.user);
    } catch (error) {
      console.error('Error al registrar:', error);
      let errorMessage = 'Error al crear la cuenta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este correo';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
          break;
        default:
          errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  });

  // Escuchar cambios en el estado de autenticación
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // Usuario está autenticado
      showMainContent(user);
    } else {
      // Usuario no está autenticado
      currentUser = null;
      modal.style.display = 'flex';
      main.style.display = 'none';
      hideMessages();
    }
  });

  // Limpiar mensajes al escribir
  emailInput.addEventListener('input', hideMessages);
  passwordInput.addEventListener('input', hideMessages);
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
    }, 8000); // Cambia cada 8 segundos
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
// Firebase ya está configurado arriba, usando las mismas variables globales
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
        'No ha llegado el siguiente regalo',
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
        
        // Si hemos mostrado todos los mensajes, reiniciar el ciclo
        if (shownCount >= banners.length) {
            shownCount = 0;
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
        shownCount = 0; // Reiniciar contador al resetear
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
function setupDeseos() {
  // Verifica duplicidad de IDs
  const deseosForm = document.getElementById('deseos-form');
  const deseosInput = document.getElementById('deseo-input');
  const deseosLista = document.getElementById('deseos-lista');
  if (!deseosForm || !deseosInput || !deseosLista) {
    console.error('No se encontraron los elementos de la lista de deseos. Verifica los IDs en el HTML.');
    return;
  }

  // Evitar múltiples inicializaciones
  if (deseosForm.hasAttribute('data-initialized')) {
    return;
  }
  deseosForm.setAttribute('data-initialized', 'true');

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
  const deseosRef = db.collection('deseos');

  // Función para migrar elementos existentes sin campo orden
  async function migrateExistingDeseos() {
    try {
      const snapshot = await deseosRef.get();
      const batch = db.batch();
      let needsUpdate = false;
      
      snapshot.forEach((doc, index) => {
        const data = doc.data();
        if (data.orden === undefined) {
          batch.update(doc.ref, { orden: index });
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        await batch.commit();
        console.log('Elementos existentes migrados con campo orden');
      }
    } catch (error) {
      console.log('Error en migración (no crítico):', error);
    }
  }

  // Ejecutar migración una sola vez
  migrateExistingDeseos();

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
      deseos.forEach((deseo, index) => {
        const li = document.createElement('li');
        li.className = 'deseo-item' + (deseo.hecho ? ' hecho' : '');
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-id', deseo.id);
        li.setAttribute('data-orden', deseo.orden || index);
        const iconUrl = mushroomIcons[Math.floor(Math.random() * mushroomIcons.length)];
        li.innerHTML = `
          <label class="deseo-check-label" style="--mushroom-icon: url('${iconUrl}')">
            <input type="checkbox" class="deseo-check" ${deseo.hecho ? 'checked' : ''} data-id="${deseo.id}">
            <div class="drag-handle" title="Arrastrar para reordenar">⋮⋮</div>
            <span class="deseo-text">${deseo.texto}</span>
          </label>
          <button class="deseo-eliminar" title="Eliminar" data-id="${deseo.id}">
            <img src="css/shovel.gif" alt="Eliminar" style="height:1em;vertical-align:middle;margin-top:-3px;">
          </button>
        `;
        
        // Event listeners para drag and drop (escritorio y móvil)
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);
        
        // Event listeners para touch (móvil)
        const dragHandle = li.querySelector('.drag-handle');
        if (dragHandle) {
          dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
          dragHandle.addEventListener('touchmove', handleTouchMove, { passive: false });
          dragHandle.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
        
        deseosLista.appendChild(li);
      });
    }

    // Escucha en tiempo real los cambios en la colección de deseos
    deseosRef.orderBy('fecha', 'asc').onSnapshot(snapshot => {
      const deseos = [];
      snapshot.forEach((doc, index) => {
        const data = doc.data();
        // Si no tiene orden, asignar uno basado en el índice actual
        const orden = data.orden !== undefined ? data.orden : index;
        deseos.push({ id: doc.id, ...data, orden });
      });
      
      // Ordenar por orden, luego por fecha
      deseos.sort((a, b) => {
        if (a.orden !== b.orden) {
          return a.orden - b.orden;
        }
        return new Date(a.fecha?.toDate?.() || a.fecha) - new Date(b.fecha?.toDate?.() || b.fecha);
      });
      
      renderDeseosFirebase(deseos);
    }, err => {
      console.error('Error al leer deseos de Firestore:', err);
    });

    // Variables para drag and drop
    let draggedElement = null;
    let draggedOverElement = null;

    function handleDragStart(e) {
      draggedElement = this;
      this.style.opacity = '0.5';
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.outerHTML);
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }

    function handleDragEnter(e) {
      if (this !== draggedElement) {
        this.classList.add('drag-over');
        draggedOverElement = this;
      }
    }

    function handleDragLeave(e) {
      this.classList.remove('drag-over');
      if (this === draggedOverElement) {
        draggedOverElement = null;
      }
    }

    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      if (draggedElement !== this && draggedElement && this) {
        // Obtener todos los elementos de la lista
        const allItems = Array.from(deseosLista.querySelectorAll('.deseo-item:not(.deseo-vacio)'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const droppedIndex = allItems.indexOf(this);

        if (draggedIndex !== -1 && droppedIndex !== -1) {
          // Reordenar elementos en el DOM
          if (draggedIndex < droppedIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
          } else {
            this.parentNode.insertBefore(draggedElement, this);
          }

          // Actualizar el orden en Firebase
          updateOrderInFirebase(allItems, draggedIndex, droppedIndex);
        }
      }

      return false;
    }

    function handleDragEnd(e) {
      this.style.opacity = '';
      this.classList.remove('dragging');
      
      // Limpiar todas las clases de drag-over
      const allItems = deseosLista.querySelectorAll('.deseo-item');
      allItems.forEach(item => {
        item.classList.remove('drag-over');
      });
      
      draggedElement = null;
      draggedOverElement = null;
    }

    async function updateOrderInFirebase(allItems, fromIndex, toIndex) {
      const batch = db.batch();
      
      try {
        // Crear un nuevo array con el orden actualizado
        const newOrder = Array.from(allItems);
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);

        // Actualizar el orden en Firebase
        newOrder.forEach((item, index) => {
          const id = item.getAttribute('data-id');
          if (id) {
            const docRef = deseosRef.doc(id);
            batch.update(docRef, { orden: index });
          }
        });

        await batch.commit();
        console.log('Orden actualizado en Firebase');
      } catch (error) {
        console.error('Error al actualizar el orden:', error);
        // Recargar la lista en caso de error
        location.reload();
      }
    }

    // Variables para touch events (móvil)
    let touchStartY = 0;
    let touchCurrentY = 0;
    let touchDraggedElement = null;
    let touchPlaceholder = null;
    let touchOffset = 0;

    function handleTouchStart(e) {
      const touch = e.touches[0];
      touchStartY = touch.clientY;
      touchCurrentY = touch.clientY;
      
      // Encontrar el elemento li más cercano
      touchDraggedElement = e.target.closest('.deseo-item');
      if (!touchDraggedElement) return;
      
      // Calcular offset desde el inicio del elemento
      const rect = touchDraggedElement.getBoundingClientRect();
      touchOffset = touch.clientY - rect.top;
      
      // Agregar clase visual
      touchDraggedElement.classList.add('touch-dragging');
      
      // Crear placeholder
      touchPlaceholder = touchDraggedElement.cloneNode(true);
      touchPlaceholder.classList.add('touch-placeholder');
      touchPlaceholder.classList.remove('touch-dragging');
      
      e.preventDefault();
    }

    function handleTouchMove(e) {
      if (!touchDraggedElement) return;
      
      const touch = e.touches[0];
      touchCurrentY = touch.clientY;
      
      // Mover el elemento arrastrado
      const deltaY = touchCurrentY - touchStartY;
      touchDraggedElement.style.transform = `translateY(${deltaY}px)`;
      touchDraggedElement.style.zIndex = '1000';
      
      // Encontrar el elemento sobre el que estamos
      const elementBelow = findElementBelow(touch.clientX, touch.clientY);
      
      if (elementBelow && elementBelow !== touchDraggedElement && elementBelow.classList.contains('deseo-item')) {
        // Insertar placeholder en la nueva posición
        if (touchPlaceholder.parentNode) {
          touchPlaceholder.parentNode.removeChild(touchPlaceholder);
        }
        
        const rect = elementBelow.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;
        
        if (touch.clientY < middle) {
          elementBelow.parentNode.insertBefore(touchPlaceholder, elementBelow);
        } else {
          elementBelow.parentNode.insertBefore(touchPlaceholder, elementBelow.nextSibling);
        }
      }
      
      e.preventDefault();
    }

    function handleTouchEnd(e) {
      if (!touchDraggedElement) return;
      
      // Restaurar estilos
      touchDraggedElement.style.transform = '';
      touchDraggedElement.style.zIndex = '';
      touchDraggedElement.classList.remove('touch-dragging');
      
      // Si hay placeholder, realizar el reordenamiento
      if (touchPlaceholder && touchPlaceholder.parentNode) {
        const allItems = Array.from(deseosLista.querySelectorAll('.deseo-item:not(.deseo-vacio)'));
        const originalIndex = allItems.indexOf(touchDraggedElement);
        
        // Insertar elemento en la posición del placeholder
        touchPlaceholder.parentNode.insertBefore(touchDraggedElement, touchPlaceholder);
        touchPlaceholder.parentNode.removeChild(touchPlaceholder);
        
        // Recalcular índices después del movimiento
        const newAllItems = Array.from(deseosLista.querySelectorAll('.deseo-item:not(.deseo-vacio)'));
        const newIndex = newAllItems.indexOf(touchDraggedElement);
        
        if (originalIndex !== newIndex) {
          updateOrderInFirebase(newAllItems, originalIndex, newIndex);
        }
      }
      
      // Limpiar variables
      touchDraggedElement = null;
      touchPlaceholder = null;
      touchStartY = 0;
      touchCurrentY = 0;
      touchOffset = 0;
      
      e.preventDefault();
    }

    function findElementBelow(x, y) {
      // Temporalmente ocultar el elemento arrastrado para encontrar el que está debajo
      const originalDisplay = touchDraggedElement.style.display;
      touchDraggedElement.style.display = 'none';
      
      const elementBelow = document.elementFromPoint(x, y);
      const deseoItem = elementBelow ? elementBelow.closest('.deseo-item') : null;
      
      // Restaurar visibilidad
      touchDraggedElement.style.display = originalDisplay;
      
      return deseoItem;
    }

    // Añadir nuevo deseo
    deseosForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const texto = deseosInput.value.trim();
      if (!texto) return;
      
      try {
        // Obtener el siguiente número de orden
        const snapshot = await deseosRef.get();
        let nextOrder = 0;
        
        if (!snapshot.empty) {
          // Encontrar el orden más alto existente
          let maxOrder = -1;
          snapshot.forEach(doc => {
            const data = doc.data();
            const orden = data.orden !== undefined ? data.orden : 0;
            if (orden > maxOrder) {
              maxOrder = orden;
            }
          });
          nextOrder = maxOrder + 1;
        }

        await deseosRef.add({
          texto,
          hecho: false,
          fecha: new Date(),
          orden: nextOrder
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

// === MODAL DE CONFIRMACIÓN PERSONALIZADO ===
function showCustomConfirm(message, onConfirm, onCancel = null) {
  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'custom-confirm-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    backdrop-filter: blur(3px);
  `;
  
  // Crear el contenido del modal
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    max-width: 320px;
    width: 85%;
    text-align: center;
    font-family: 'Roboto', sans-serif;
    animation: modalSlideIn 0.3s ease;
  `;
  
  // Añadir animación CSS
  if (!document.querySelector('#modal-animations')) {
    const style = document.createElement('style');
    style.id = 'modal-animations';
    style.textContent = `
      @keyframes modalSlideIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  modalContent.innerHTML = `
    <div style="margin-bottom: 25px;">
      <div style="margin-bottom: 15px;">
        <img src="css/delete_text.png" alt="Eliminar" style="width: 40px; height: 40px; object-fit: contain;">
      </div>
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.3em;">${message}</h3>
      <p style="margin: 0; color: #666; font-size: 0.95em;">Esta acción no se puede deshacer</p>
    </div>
    <div style="display: flex; gap: 15px; justify-content: center;">
      <button id="confirm-yes" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      ">Sí, eliminar</button>
      <button id="confirm-no" style="
        background: #95a5a6;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      ">Cancelar</button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Añadir efectos hover
  const yesBtn = modalContent.querySelector('#confirm-yes');
  const noBtn = modalContent.querySelector('#confirm-no');
  
  yesBtn.addEventListener('mouseover', () => {
    yesBtn.style.background = '#c0392b';
    yesBtn.style.transform = 'translateY(-1px)';
  });
  yesBtn.addEventListener('mouseout', () => {
    yesBtn.style.background = '#e74c3c';
    yesBtn.style.transform = 'translateY(0)';
  });
  
  noBtn.addEventListener('mouseover', () => {
    noBtn.style.background = '#7f8c8d';
    noBtn.style.transform = 'translateY(-1px)';
  });
  noBtn.addEventListener('mouseout', () => {
    noBtn.style.background = '#95a5a6';
    noBtn.style.transform = 'translateY(0)';
  });
  
  // Enfocar en el botón "No" por defecto (más seguro)
  noBtn.focus();
  
  // Funciones para cerrar el modal
  function closeModal() {
    modal.style.animation = 'modalSlideOut 0.2s ease';
    setTimeout(() => {
      if (modal.parentNode) {
        document.body.removeChild(modal);
      }
    }, 200);
  }
  
  // Event listeners
  yesBtn.addEventListener('click', () => {
    closeModal();
    if (onConfirm) onConfirm();
  });
  
  noBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });
  
  // Cerrar con Escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (onCancel) onCancel();
    }
  });
  
  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
      if (onCancel) onCancel();
    }
  });
}

// === PANEL LITERARIO SINCRONIZADO FIRESTORE ===
function setupLiterario() {
  const form = document.getElementById('literario-form');
  const textoInput = document.getElementById('literario-texto');
  const autorInput = document.getElementById('literario-autor');
  const lista = document.getElementById('literario-lista');
  const charCounter = document.getElementById('char-counter');
  if (!form || !textoInput || !autorInput || !lista) return;

  // Evitar múltiples inicializaciones
  if (form.hasAttribute('data-initialized')) {
    return;
  }

  // Contador de caracteres
  if (charCounter) {
    function updateCharCounter() {
      const currentLength = textoInput.value.length;
      const maxLength = 5000;
      charCounter.textContent = `${currentLength}/${maxLength}`;
      
      // Cambiar color según proximidad al límite
      if (currentLength > maxLength * 0.9) {
        charCounter.style.color = '#d32f2f';
        charCounter.style.fontWeight = 'bold';
      } else if (currentLength > maxLength * 0.75) {
        charCounter.style.color = '#f57c00';
        charCounter.style.fontWeight = 'normal';
      } else {
        charCounter.style.color = '#bd5532';
        charCounter.style.fontWeight = 'normal';
      }
    }

    textoInput.addEventListener('input', updateCharCounter);
    textoInput.addEventListener('keyup', updateCharCounter);
    textoInput.addEventListener('paste', () => {
      setTimeout(updateCharCounter, 10);
    });
    
    // Inicializar el contador
    updateCharCounter();
  }
  form.setAttribute('data-initialized', 'true');
  
  // === FUNCIONALIDAD FULLSCREEN MÓVIL ===
  const panel = document.getElementById('literario-panel');
  
  function isMobile() {
    return window.innerWidth <= 480;
  }
  
  function toggleFullscreen() {
    if (!isMobile()) return;
    
    panel.classList.toggle('fullscreen');
    
    // Prevenir scroll del body cuando está en fullscreen
    if (panel.classList.contains('fullscreen')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Activar fullscreen al hacer clic en el panel en móvil
  if (panel) {
    panel.addEventListener('click', function(e) {
      if (isMobile() && !panel.classList.contains('fullscreen')) {
        // Solo activar si no se está haciendo clic en un botón o input
        if (!e.target.closest('button, input, textarea, .literario-actions')) {
          toggleFullscreen();
        }
      }
    });
    
    // Cerrar fullscreen con botón back o escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('fullscreen')) {
        toggleFullscreen();
      }
    });
    
    // Cerrar fullscreen al hacer clic fuera del contenido en móvil
    panel.addEventListener('click', function(e) {
      if (isMobile() && panel.classList.contains('fullscreen') && e.target === panel) {
        toggleFullscreen();
      }
    });
  }

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
      
      // Verificar si el texto es largo (más de 150 caracteres o más de 2 líneas)
      const isLongText = item.texto.length > 150 || item.texto.split('\n').length > 2;
      
      li.innerHTML = `
        <span class="literario-texto">${item.texto}</span>
        ${item.autor ? `<span class="literario-autor">- ${item.autor}</span>` : ''}
        <div class="literario-actions">
          <button class="literario-fav-btn${item.favorito ? ' fav' : ''}" title="Favorito">&#9733;</button>
          <button class="literario-edit-btn" title="Editar">&#9998;</button>
          <button class="literario-del-btn" title="Eliminar">&#128465;</button>
          <button class="literario-expand-btn" title="Expandir/Contraer"><img src="css/expand.png" alt="Expandir" style="height:1em;vertical-align:middle;"></button>
        </div>
      `;
      
      // Agregar clase para todos los textos (no solo largos)
      li.classList.add('has-expandable-text');
      if (isLongText) {
        li.classList.add('has-long-text');
      }
      
      // Función para alternar expansión
      function toggleExpansion() {
        li.classList.toggle('expanded');
        
        // Actualizar el botón de expansión si existe
        const expandBtn = li.querySelector('.literario-expand-btn');
        if (expandBtn) {
          const isExpanded = li.classList.contains('expanded');
          expandBtn.innerHTML = isExpanded 
            ? '<img src="css/minimize.png" alt="Contraer" style="height:1em;vertical-align:middle;">'
            : '<img src="css/expand.png" alt="Expandir" style="height:1em;vertical-align:middle;">';
          expandBtn.title = isExpanded ? 'Contraer' : 'Expandir';
        }
        
        // Scroll suave al elemento expandido
        if (li.classList.contains('expanded')) {
          setTimeout(() => {
            li.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }, 100);
        }
      }
      
      // Solo el botón específico de expansión (funciona para todos los textos)
      const expandBtn = li.querySelector('.literario-expand-btn');
      if (expandBtn) {
        expandBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleExpansion();
        });
      }
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
        
        // Verificar si ya está en modo edición
        if (li.classList.contains('editing')) return;
        
        li.classList.add('editing');
        
        // Obtener elementos actuales
        const textoSpan = li.querySelector('.literario-texto');
        const autorSpan = li.querySelector('.literario-autor');
        const actions = li.querySelector('.literario-actions');
        
        // Crear elementos de edición
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        editContainer.innerHTML = `
          <textarea class="edit-texto" placeholder="Escribe el texto...">${item.texto}</textarea>
          <div class="edit-buttons">
            <button class="save-btn" title="Guardar">💾</button>
            <button class="cancel-btn" title="Cancelar">❌</button>
          </div>
        `;
        
        // Ocultar contenido original y mostrar editor
        textoSpan.style.display = 'none';
        if (autorSpan) autorSpan.style.display = 'none';
        actions.style.display = 'none';
        
        // Insertar editor después del texto
        textoSpan.parentNode.insertBefore(editContainer, actions);
        
        // Enfocar en el textarea
        const textarea = editContainer.querySelector('.edit-texto');
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        
        // Función para guardar
        const saveEdit = async () => {
          const nuevoTexto = textarea.value.trim();
          
          if (!nuevoTexto) {
            alert('El texto no puede estar vacío');
            return;
          }
          
          try {
            await litRef.doc(item.id).update({
              texto: nuevoTexto
            });
            // La actualización se manejará automáticamente por el listener de Firestore
          } catch (err) {
            alert("Error al guardar los cambios.");
            console.error('Error al editar:', err);
          }
        };
        
        // Función para cancelar
        const cancelEdit = () => {
          li.classList.remove('editing');
          editContainer.remove();
          textoSpan.style.display = '';
          if (autorSpan) autorSpan.style.display = '';
          actions.style.display = '';
        };
        
        // Event listeners
        editContainer.querySelector('.save-btn').onclick = saveEdit;
        editContainer.querySelector('.cancel-btn').onclick = cancelEdit;
        
        // Guardar con Ctrl+Enter
        textarea.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
          }
        });
      };
      // Eliminar
      li.querySelector('.literario-del-btn').onclick = async function(e) {
        e.stopPropagation();
        showCustomConfirm(
          "¿Eliminar este texto?",
          async () => {
            try {
              await litRef.doc(item.id).delete();
            } catch (err) { 
              alert("Error al eliminar."); 
            }
          }
        );
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
