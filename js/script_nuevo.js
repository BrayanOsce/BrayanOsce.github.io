// Carrusel de fotos dinámico - Versión simplificada y funcional

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando carrusel...');
    
    // Seleccionar elementos
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const playBtn = document.querySelector('.play-pause');
    const carousel = document.querySelector('.carousel-images');
    
    // Variables del carrusel
    let current = 0;
    let images = [];
    let shuffledOrder = [];
    let currentShuffleIndex = 0;
    let isPlaying = false;
    let autoPlayInterval = null;
    
    // Verificar que los elementos existan
    if (!prevBtn || !nextBtn || !playBtn || !carousel) {
        console.error('Error: No se encontraron los elementos del carrusel');
        console.log('prevBtn:', prevBtn);
        console.log('nextBtn:', nextBtn);
        console.log('playBtn:', playBtn);
        console.log('carousel:', carousel);
        return;
    }
    
    console.log('Elementos encontrados correctamente');
    
    // Función para barajar array
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Función para mostrar imagen
    function showImage(index) {
        images = Array.from(document.querySelectorAll('.carousel-images img'));
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
    
    // Función para avanzar a la siguiente imagen
    function nextImage() {
        if (images.length === 0) return;
        
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffledOrder.length;
        
        if (currentShuffleIndex === 0) {
            shuffledOrder = shuffleArray(Array.from({length: images.length}, (_, i) => i));
        }
        
        current = shuffledOrder[currentShuffleIndex];
        showImage(current);
    }
    
    // Función para iniciar reproducción automática
    function startAutoPlay() {
        if (!isPlaying) {
            isPlaying = true;
            playBtn.innerHTML = '⏸️';
            console.log('Reproducción automática iniciada');
            autoPlayInterval = setInterval(nextImage, 5000);
        }
    }
    
    // Función para detener reproducción automática
    function stopAutoPlay() {
        if (isPlaying) {
            isPlaying = false;
            playBtn.innerHTML = '▶️';
            console.log('Reproducción automática detenida');
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Función para alternar play/pause
    function toggleAutoPlay() {
        console.log('Botón presionado. Estado actual:', isPlaying);
        if (isPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
    
    // Lista de imágenes
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
    
    // Inicializar carrusel
    const urls = anifotos.map(filename => `anifotos/${filename}`);
    
    if (urls.length === 0) {
        carousel.innerHTML = '<div class="no-images-msg">No hay imágenes para mostrar.</div>';
        return;
    }
    
    // Crear HTML de imágenes
    carousel.innerHTML = urls.map((url, i) =>
        `<img src="${url}" alt="Foto ${i+1}"${i === 0 ? ' class="active"' : ''}>`
    ).join('');
    
    // Obtener imágenes y configurar orden aleatorio
    images = Array.from(document.querySelectorAll('.carousel-images img'));
    shuffledOrder = shuffleArray(Array.from({length: images.length}, (_, i) => i));
    currentShuffleIndex = 0;
    current = shuffledOrder[currentShuffleIndex];
    showImage(current);
    
    console.log('Carrusel inicializado con', images.length, 'imágenes');
    
    // Configurar event listeners
    prevBtn.addEventListener('click', function() {
        console.log('Botón anterior presionado');
        if (isPlaying) stopAutoPlay();
        
        currentShuffleIndex = (currentShuffleIndex - 1 + shuffledOrder.length) % shuffledOrder.length;
        current = shuffledOrder[currentShuffleIndex];
        showImage(current);
    });
    
    nextBtn.addEventListener('click', function() {
        console.log('Botón siguiente presionado');
        if (isPlaying) stopAutoPlay();
        nextImage();
    });
    
    playBtn.addEventListener('click', function() {
        console.log('Botón play/pause presionado');
        toggleAutoPlay();
    });
    
    console.log('Event listeners configurados');
});

// Animación de flores (fuera del DOMContentLoaded)
const canvas = document.getElementById('flowers-bg');
const ctx = canvas.getContext('2d');
let flowers = [];
const flowerImages = [
    'flores/flor1.png',
    'flores/flor2.png',
    'flores/flor3.png'
];
const loadedImages = [];
let imagesLoaded = 0;

// Cargar imágenes de flores
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
        r: 24 + Math.random() * 32,
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
