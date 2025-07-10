
// Carrusel de fotos dinámico desde .txt de Google Drive

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let current = 0;
const carousel = document.querySelector('.carousel-images');
let images = [];
let shuffledOrder = []; // Array para mantener el orden aleatorio
let currentShuffleIndex = 0; // Índice actual en el array barajado

// Función para barajar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showImage(index) {
    // Siempre actualiza el array de imágenes por si el DOM cambió
    images = Array.from(document.querySelectorAll('.carousel-images img'));
    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    // Deshabilita botones si no hay imágenes
    prevBtn.disabled = images.length === 0;
    nextBtn.disabled = images.length === 0;
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
    "IMG-20240712-WA0019.jpg",
    "IMG-20240712-WA0034.jpg",
    "IMG-20240712-WA0045.jpg",
    "IMG-20240712-WA0048.jpg",
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
    "IMG-20250120-WA0034.jpg",
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
if (urls.length === 0) {
    carousel.innerHTML = '<div class="no-images-msg">No hay imágenes para mostrar.</div>';
    images = [];
    prevBtn.disabled = true;
    nextBtn.disabled = true;
} else {
    carousel.innerHTML = urls.map((url, i) =>
        `<img src="${url}" alt="Foto ${i+1}"${i === 0 ? ' class="active"' : ''}>`
    ).join('');
    images = Array.from(document.querySelectorAll('.carousel-images img'));
    
    // Crear orden aleatorio inicial
    shuffledOrder = shuffleArray(Array.from({length: images.length}, (_, i) => i));
    currentShuffleIndex = 0;
    current = shuffledOrder[currentShuffleIndex];
    showImage(current);

    prevBtn.onclick = () => {
        images = Array.from(document.querySelectorAll('.carousel-images img'));
        if (images.length === 0) return;
        
        // Ir al anterior en el orden aleatorio
        currentShuffleIndex = (currentShuffleIndex - 1 + shuffledOrder.length) % shuffledOrder.length;
        
        // Si completamos un ciclo hacia atrás, rebarajar
        if (currentShuffleIndex === shuffledOrder.length - 1) {
            shuffledOrder = shuffleArray(Array.from({length: images.length}, (_, i) => i));
        }
        
        current = shuffledOrder[currentShuffleIndex];
        showImage(current);
    };
    
    nextBtn.onclick = () => {
        images = Array.from(document.querySelectorAll('.carousel-images img'));
        if (images.length === 0) return;
        
        // Ir al siguiente en el orden aleatorio
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
        
        // Si completamos un ciclo completo, rebarajar para el siguiente ciclo
        if (currentShuffleIndex === 0) {
            shuffledOrder = shuffleArray(Array.from({length: images.length}, (_, i) => i));
        }
        
        current = shuffledOrder[currentShuffleIndex];
        showImage(current);
    };
}

// Animación de "flores" usando imágenes PNG personalizadas
const canvas = document.getElementById('flowers-bg');
const ctx = canvas.getContext('2d');
let flowers = [];
// Pon aquí los nombres de tus imágenes PNG (deben estar en la carpeta del proyecto)
const flowerImages = [
    'flores/flor1.png',
    'flores/flor2.png',
    'flores/flor3.png'
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
}
