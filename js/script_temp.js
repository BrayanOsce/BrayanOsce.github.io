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

function nextImage() {
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
}

function startAutoplay() {
    if (isPlaying) return;
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
    autoplayInterval = setInterval(nextImage, 5000); // Cambia cada 5 segundos
}

function stopAutoplay() {
    if (!isPlaying) return;
    isPlaying = false;
    playPauseBtn.textContent = '▶️';
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
    
    nextBtn.onclick = nextImage;
    
    playPauseBtn.onclick = toggleAutoplay;
    
    // Iniciar autoplay automáticamente
    startAutoplay();
}

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
    const colors = [
        {
            a: '#8b6544',
            b: '#f5e1d3',
            c: '#d4b896',
            d: '#b48a78',
        },
        {
            a: '#ff6b6b',
            b: '#ffd93d',
            c: '#ffef5d',
            d: '#fc65c9',
        },
        {
            a: '#b48a78',
            b: '#f5e1d3',
            c: '#e8cdb5',
            d: '#d4b896',
        }
    ];

    const planeSvg = () => {
        const { a, b, c, d } = colors[Math.floor(Math.random() * colors.length)];
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
    const topValues = [0.5, 1.5, 2.5, 3.5];
    let bannerContent = '¡2#años#de#amor#infinito!#💕#Feliz#aniversario#mi#alma#gemela#❤️';
    const banners = [];
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
        plane.style.top = `${topValues[topIndex] * plane.offsetHeight + (20 * topValues[topIndex])}px`;
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

    const calcWrapIndex = () => {
        const flexWrapper = document.querySelector('.flex_wrapper');
        const wrapIndex = [];
        flexWrapper.innerHTML = bannerContent.split('#').map(word => {
            return `
                <div class="message_ghost">
                    ${word}
                </div>
            `;
        }).join('');
        const messageGhosts = document.querySelectorAll('.message_ghost');
        messageGhosts.forEach((message, i) => {
            if (i === (messageGhosts.length - 1)) return;
            if (message.getBoundingClientRect().y < messageGhosts[i + 1].getBoundingClientRect().y) {
                wrapIndex.push(i);
            }
        });
        return wrapIndex;
    };

    const splitTextForBanners = () => {
        banners.length = 0;
        const word = [];
        const wrapIndex = calcWrapIndex();
        let hashCount = -1;
        bannerContent.split('').forEach((letter, i) => {
            if (letter === '#') hashCount++;
            word.push(letter);
            if ((wrapIndex.find(i => i === hashCount) && letter === '#')) {
                banners.push(word.join(''));
                word.length = 0;
            }
            if (i === (bannerContent.length - 1)) banners.push(word.join(''));
        });
    };

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

    const createPlanes = () => {
        const bannerText = banners[bannerIndex].split('').reverse().join('')[0] === '#'
            ? banners[bannerIndex]
            : banners[bannerIndex] += '#';

        if (bannerText !== '#') createPlane(bannerText.replaceAll('#', ' '));
        bannerIndex = (bannerIndex + 1) < banners.length ? bannerIndex + 1 : 0;

        if (bannerIndex === 0) spriteId = 0;

        count++;
        setTimeout(() => {
            if (count === banners.length) return;
            createPlanes();
        }, 3000);
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
        splitTextForBanners();
        createTimers();
        createPlanes();
    };

    splitTextForBanners();
    createTimers();
    createPlanes();

    // Repetir cada 20 segundos
    setInterval(resetPlanes, 20000);

    window.addEventListener('resize', resetPlanes);
}
