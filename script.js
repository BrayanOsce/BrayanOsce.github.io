
// Carrusel de fotos dinámico desde .txt de Google Drive

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let current = 0;
const carousel = document.querySelector('.carousel-images');
let images = [];


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

// Leer el archivo .txt y generar el carrusel
fetch('anifotos_enlaces/anifotosenlaces.txt')
    .then(response => response.text())
    .then(text => {
        const ids = text.split(/\r?\n/)
            .map(line => {
                const match = line.match(/[-\w]{25,}/);
                return match ? match[0] : null;
            })
            .filter(Boolean);
        carousel.innerHTML = ids.map((id, i) =>
            `<img src="https://drive.google.com/uc?export=view&id=${id}" alt="Foto ${i+1}"${i === 0 ? ' class="active"' : ''}>`
        ).join('');
        images = Array.from(document.querySelectorAll('.carousel-images img'));
        current = 0;
        showImage(current);

        prevBtn.onclick = () => {
            images = Array.from(document.querySelectorAll('.carousel-images img'));
            if (images.length === 0) return;
            current = (current - 1 + images.length) % images.length;
            showImage(current);
        };
        nextBtn.onclick = () => {
            images = Array.from(document.querySelectorAll('.carousel-images img'));
            if (images.length === 0) return;
            current = (current + 1) % images.length;
            showImage(current);
        };
    });

// Animación de "flores" usando imágenes PNG personalizadas
const canvas = document.getElementById('flowers-bg');
const ctx = canvas.getContext('2d');
let flowers = [];
// Pon aquí los nombres de tus imágenes PNG (deben estar en la carpeta del proyecto)
const flowerImages = [
    'flor1.png', // reemplaza por tus archivos
    'flor2.png',
    'flor3.png'
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
