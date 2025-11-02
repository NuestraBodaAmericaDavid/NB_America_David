// script.js
document.addEventListener('DOMContentLoaded', () => {
  const blockIntro = document.getElementById('block-intro');
  const blockInvitation = document.getElementById('block-invitation');
  const backgroundMusic = document.getElementById('background-music');
  const staticFlowersContainer = document.getElementById('static-flowers');
  const flowerRainContainer = document.getElementById('flower-rain');
  const flowerRainMainContainer = document.getElementById('flower-rain-main');
  
  // Elementos del contador
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  // Fecha objetivo: 18 de DICIEMBRE de 2025
  const targetDate = new Date(2025, 11, 18, 0, 0, 0);
  
  let isInteractionDetected = false;
  let shakeDetectionActive = true;
  let musicActivated = false;

  // Función para activar música - SOLO SE LLAMA DESDE LA ANIMACIÓN DE ANILLOS
  function activateMusic() {
    if (musicActivated) return;
    
    console.log('🎵 ACTIVANDO MÚSICA DESDE ANIMACIÓN DE ANILLOS...');
    musicActivated = true;
    
    if (backgroundMusic) {
      backgroundMusic.volume = 0.6;
      backgroundMusic.muted = false;
      
      backgroundMusic.play().then(() => {
        console.log('✅ Música activada exitosamente');
      }).catch(error => {
        console.log('❌ Error activando música:', error);
      });
    }
  }

  // Función para actualizar la cuenta regresiva
  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // DETECCIÓN DE AGITADO
  function initShakeDetection() {
    if (!window.DeviceMotionEvent) {
      return;
    }
    
    let lastAcceleration = null;
    
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            startShakeDetection();
          }
        })
        .catch(console.error);
    } else {
      startShakeDetection();
    }
    
    function startShakeDetection() {
      window.addEventListener('devicemotion', (event) => {
        if (!shakeDetectionActive || isInteractionDetected) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        if (!lastAcceleration) {
          lastAcceleration = { x: acceleration.x, y: acceleration.y, z: acceleration.z };
          return;
        }
        
        const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
        const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
        const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);
        const totalMovement = deltaX + deltaY + deltaZ;
        
        if (totalMovement > 20) {
          handleInteractionDetected();
        }
        
        lastAcceleration = { x: acceleration.x, y: acceleration.y, z: acceleration.z };
      });
    }
  }

  // FUNCIÓN PRINCIPAL - SOLO INICIA ANIMACIONES
  function handleInteractionDetected() {
    if (isInteractionDetected) return;
    
    console.log('🚀 Iniciando animaciones...');
    isInteractionDetected = true;
    shakeDetectionActive = false;
    
    // Efectos visuales
    blockIntro.classList.add('blow-detected');
    
    // ANIMACIÓN DE ANILLOS - ESTA ES LA QUE ACTIVA LA MÚSICA
    gsap.to('.rings-image', {
      rotation: 360,
      scale: 1.2,
      duration: 1.5,
      ease: "back.out(1.7)",
      onStart: function() {
        console.log('🔄 ANIMACIÓN DE ANILLOS INICIADA - ACTIVANDO MÚSICA');
        activateMusic(); // 🔥 LA MÚSICA SE ACTIVA AQUÍ
      }
    });
    
    // Transición a segunda pantalla
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5 }
      );
      
      // Inicializar carrusel
      setTimeout(initialize3DCarousel, 500);
    }, 2000);
  }

  // Inicializar FLORES
  function initializeStaticFlowers() {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    const sizes = ['tiny', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
    
    for (let i = 0; i < 200; i++) {
      const flower = document.createElement('div');
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      flower.className = `static-flower ${size}`;
      
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      
      flower.style.top = `${top}%`;
      flower.style.left = `${left}%`;
      flower.style.opacity = 0.7 + Math.random() * 0.3;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      flower.style.animationDelay = `${Math.random() * 12}s`;
      flower.style.animationDuration = `${8 + Math.random() * 8}s`;
      
      staticFlowersContainer.appendChild(flower);
    }
  }

  // Inicializar lluvia de flores
  function initializeFlowerRain(container) {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    
    function createFallingFlower() {
      const flower = document.createElement('div');
      flower.className = 'falling-flower';
      
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 1.5;
      const size = 20 + Math.random() * 40;
      
      flower.style.left = `${left}%`;
      flower.style.animationDuration = `${duration}s`;
      flower.style.animationDelay = `${delay}s`;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor" style="width: ${size}px; height: ${size}px;">`;
      
      container.appendChild(flower);
      
      setTimeout(() => {
        if (flower.parentNode) {
          flower.parentNode.removeChild(flower);
        }
      }, duration * 1000);
    }
    
    setInterval(createFallingFlower, 100);
    
    for (let i = 0; i < 40; i++) {
      setTimeout(createFallingFlower, i * 50);
    }
  }

  // CLICK FUNCIONAL
  function setupClickInteraction() {
    document.addEventListener('click', () => {
      if (!isInteractionDetected) {
        handleInteractionDetected();
      }
    });
    
    document.addEventListener('touchstart', () => {
      if (!isInteractionDetected) {
        handleInteractionDetected();
      }
    });
  }

  // CARRUSEL
  function initialize3DCarousel() {
    const carousels = document.querySelectorAll('.carousel-3d-container');
    
    carousels.forEach(container => {
      const slides = container.querySelectorAll('.carousel-slide');
      const totalSlides = slides.length;
      
      if (totalSlides === 0) return;
      
      let currentSlide = 0;
      let rotationInterval;
      
      function updateSlides() {
        slides.forEach((slide, index) => {
          slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
          
          let diff = index - currentSlide;
          
          if (diff < -Math.floor(totalSlides / 2)) {
            diff += totalSlides;
          } else if (diff > Math.floor(totalSlides / 2)) {
            diff -= totalSlides;
          }
          
          if (diff === 0) slide.classList.add('active');
          else if (diff === -1 || (diff === totalSlides - 1 && currentSlide === 0)) slide.classList.add('prev');
          else if (diff === 1 || (diff === -totalSlides + 1 && currentSlide === totalSlides - 1)) slide.classList.add('next');
          else if (diff === -2 || (diff === totalSlides - 2 && currentSlide <= 1)) slide.classList.add('far-prev');
          else if (diff === 2 || (diff === -totalSlides + 2 && currentSlide >= totalSlides - 2)) slide.classList.add('far-next');
        });
      }
      
      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
      }
      
      updateSlides();
      
      if (rotationInterval) clearInterval(rotationInterval);
      rotationInterval = setInterval(nextSlide, 4000);
      
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(rotationInterval);
        else rotationInterval = setInterval(nextSlide, 4000);
      });
    });
  }

  // INICIALIZAR
  function init() {
    initializeStaticFlowers();
    initializeFlowerRain(flowerRainContainer);
    initializeFlowerRain(flowerRainMainContainer);
    setupClickInteraction();
    initShakeDetection();
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  init();
});
