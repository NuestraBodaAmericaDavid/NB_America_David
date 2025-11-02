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

  // Función para reproducir música
  function playMusic() {
    if (backgroundMusic) {
      console.log('Reproduciendo música...');
      backgroundMusic.volume = 0.6;
      backgroundMusic.muted = false;
      
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Música reproducida exitosamente');
        }).catch(error => {
          console.log('Error en reproducción:', error);
          setTimeout(() => {
            backgroundMusic.play().catch(e => {
              console.log('Segundo intento fallido:', e);
            });
          }, 500);
        });
      }
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
  
  // DETECCIÓN DE AGITADO - SIMULA CLICK CUANDO SE DETECTA
  function initShakeDetection() {
    if (!window.DeviceMotionEvent) {
      console.log('Dispositivo no soporta detección de movimiento');
      return;
    }
    
    console.log('Iniciando detección de agitado...');
    
    let lastX = null, lastY = null, lastZ = null;
    let moveCounter = 0;
    const shakeThreshold = 15;

    // Función para simular un click
    function simulateClick() {
      console.log('¡Agitado detectado! Simulando click...');
      
      // Crear y disparar un evento de click
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      // Disparar el click en el documento
      document.dispatchEvent(clickEvent);
      
      // También disparar un touchstart para móviles
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: Date.now(),
          target: document.body,
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2
        })]
      });
      
      document.dispatchEvent(touchEvent);
    }

    // Función para iniciar la detección de movimiento
    function startMotionDetection() {
      console.log('Sensor de movimiento activado');
      
      window.addEventListener('devicemotion', (event) => {
        if (!shakeDetectionActive || isInteractionDetected) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        const { x, y, z } = acceleration;
        
        if (lastX === null || lastY === null || lastZ === null) {
          lastX = x;
          lastY = y;
          lastZ = z;
          return;
        }
        
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        
        const totalMovement = deltaX + deltaY + deltaZ;
        
        if (totalMovement > shakeThreshold) {
          moveCounter++;
          console.log(`Movimiento detectado! Fuerza: ${totalMovement.toFixed(2)}, Contador: ${moveCounter}`);
          
          if (moveCounter >= 2) { // Solo necesita 2 movimientos fuertes
            simulateClick(); // ¡SIMULAR CLICK!
            moveCounter = 0; // Resetear contador
          }
        } else {
          moveCounter = Math.max(0, moveCounter - 0.2);
        }
        
        lastX = x;
        lastY = y;
        lastZ = z;
      });
    }

    // Para iOS - pedir permiso
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      console.log('iOS detectado - solicitando permiso...');
      
      // Esperar un momento y luego pedir permiso automáticamente
      setTimeout(() => {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              console.log('Permiso concedido para sensor de movimiento');
              startMotionDetection();
            } else {
              console.log('Permiso denegado para sensor de movimiento');
            }
          })
          .catch(error => {
            console.log('Error al solicitar permiso:', error);
          });
      }, 1000);
    } else {
      // Para Android y otros navegadores
      console.log('Iniciando detección sin permiso...');
      startMotionDetection();
    }

    // Fallback para desktop - tecla espacio simula click
    document.addEventListener('keydown', (e) => {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      if (e.code === 'Space' || e.key === ' ') {
        console.log('Tecla espacio - simulando click');
        simulateClick();
      }
    });
  }

  // FUNCIÓN PRINCIPAL QUE SE EJECUTA CON CLICK O SHAKE
  function handleInteractionDetected() {
    if (isInteractionDetected) return;
    
    console.log('Interacción detectada (click o shake)');
    isInteractionDetected = true;
    shakeDetectionActive = false;
    
    // Efecto visual de agitado
    blockIntro.classList.add('blow-detected');
    
    // Animación extra para los anillos
    gsap.to('.rings-image', {
      rotation: 360,
      scale: 1.2,
      duration: 1.5,
      ease: "back.out(1.7)"
    });
    
    // Reproducir música - ESTO SE EJECUTA TANTO PARA CLICK COMO PARA SHAKE
    playMusic();
    
    // Transición después de la animación
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5 }
      );
      
      // INICIALIZAR CARRUSEL después de mostrar el bloque
      setTimeout(initialize3DCarousel, 500);
    }, 2000);
  }

  // Inicializar FLORES MUY DENSAS
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

  // Inicializar lluvia de flores MUY DENSA
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

  // CLICK FUNCIONAL - ESTA ES LA FUNCIÓN QUE SE EJECUTA CON CLICK REAL O SIMULADO
  function setupClickInteraction() {
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    function handleClick(e) {
      if (!isInteractionDetected) {
        console.log('Click real o simulado detectado');
        if (shakeDetectionActive) {
          shakeDetectionActive = false;
        }
        handleInteractionDetected();
      }
    }
  }

  // CARRUSEL SIMPLIFICADO
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
          
          if (diff === 0) {
            slide.classList.add('active');
          } else if (diff === -1 || (diff === totalSlides - 1 && currentSlide === 0)) {
            slide.classList.add('prev');
          } else if (diff === 1 || (diff === -totalSlides + 1 && currentSlide === totalSlides - 1)) {
            slide.classList.add('next');
          } else if (diff === -2 || (diff === totalSlides - 2 && currentSlide <= 1)) {
            slide.classList.add('far-prev');
          } else if (diff === 2 || (diff === -totalSlides + 2 && currentSlide >= totalSlides - 2)) {
            slide.classList.add('far-next');
          }
        });
      }
      
      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
      }
      
      updateSlides();
      
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
      
      rotationInterval = setInterval(nextSlide, 4000);
      
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(rotationInterval);
        } else {
          rotationInterval = setInterval(nextSlide, 4000);
        }
      });
    });
  }

  // INICIALIZAR
  function init() {
    initializeStaticFlowers();
    initializeFlowerRain(flowerRainContainer);
    initializeFlowerRain(flowerRainMainContainer);
    setupClickInteraction(); // Esta función maneja tanto clicks reales como simulados
    initShakeDetection(); // Esta función simula clicks cuando detecta shake
    
    // Iniciar contador
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  init();
});
