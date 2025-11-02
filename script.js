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

  // Función para reproducir música - OPTIMIZADA PARA MÓVILES
  function playMusic() {
    if (backgroundMusic) {
      console.log('Intentando reproducir música...');
      // Configurar la música
      backgroundMusic.volume = 0.6;
      backgroundMusic.muted = false;
      
      // Intentar reproducir
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Música reproducida exitosamente');
        }).catch(error => {
          console.log('Error en reproducción automática:', error);
          // Intentar de nuevo después de un breve delay
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
  
  // DETECCIÓN DE AGITADO (SHAKE) - CORREGIDA
  function initShakeDetection() {
    if (!window.DeviceMotionEvent) {
      console.log('Dispositivo no soporta detección de movimiento');
      return;
    }
    
    console.log('Iniciando detección de agitado...');
    
    let lastX = null, lastY = null, lastZ = null;
    let moveCounter = 0;
    const shakeThreshold = 15;
    let isRequestingPermission = false;

    // Función para iniciar la detección de movimiento
    function startMotionDetection() {
      console.log('Iniciando sensor de movimiento...');
      
      window.addEventListener('devicemotion', handleDeviceMotion);
      
      // También agregar detección de orientación como fallback
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Manejar datos del acelerómetro
    function handleDeviceMotion(event) {
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
      
      console.log(`Movimiento detectado - X: ${deltaX.toFixed(2)}, Y: ${deltaY.toFixed(2)}, Z: ${deltaZ.toFixed(2)}`);
      
      if (deltaX + deltaY + deltaZ > shakeThreshold) {
        moveCounter++;
        console.log(`Movimiento fuerte detectado! Contador: ${moveCounter}`);
        
        if (moveCounter >= 3) { // Reducido para mayor sensibilidad
          console.log('¡Agitado detectado! Activando música...');
          handleInteractionDetected();
        }
      } else {
        moveCounter = Math.max(0, moveCounter - 0.1); // Reducir más lentamente
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    }

    // Manejar orientación como fallback
    function handleDeviceOrientation(event) {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      const { beta, gamma } = event; // beta: inclinación front-back, gamma: inclinación left-right
      
      // Detectar cambios bruscos en la orientación
      if (Math.abs(beta) > 45 || Math.abs(gamma) > 45) {
        moveCounter++;
        console.log(`Inclinación detectada! Contador: ${moveCounter}`);
        
        if (moveCounter >= 2) {
          console.log('¡Inclinación fuerte detectada! Activando música...');
          handleInteractionDetected();
        }
      }
    }

    // Pedir permiso para iOS
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      console.log('Solicitando permiso para sensor de movimiento...');
      
      // Crear un botón overlay para pedir permiso en iOS
      const permissionOverlay = document.createElement('div');
      permissionOverlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 87, 163, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
          backdrop-filter: blur(10px);
        ">
          <div style="
            background: rgba(245, 249, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid #D4AF37;
            max-width: 400px;
          ">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 2rem; margin-bottom: 15px; color: #D4AF37;">
              Permiso para Agitar
            </h2>
            <p style="font-size: 1rem; margin-bottom: 25px; line-height: 1.5;">
              Para usar la función de "agitar", necesitamos acceso al sensor de movimiento de tu dispositivo.
            </p>
            <button id="grant-permission-btn" style="
              background: linear-gradient(135deg, #D4AF37, #FFD700);
              color: #0057A3;
              border: none;
              padding: 12px 25px;
              font-size: 1.1rem;
              font-weight: bold;
              border-radius: 50px;
              cursor: pointer;
              font-family: 'Dancing Script', cursive;
              width: 100%;
            ">
              Permitir Sensor de Movimiento
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(permissionOverlay);
      
      document.getElementById('grant-permission-btn').addEventListener('click', function() {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            permissionOverlay.remove();
            if (permissionState === 'granted') {
              console.log('Permiso concedido para sensor de movimiento');
              startMotionDetection();
            } else {
              console.log('Permiso denegado para sensor de movimiento');
            }
          })
          .catch(error => {
            console.log('Error al solicitar permiso:', error);
            permissionOverlay.remove();
          });
      });
    } else {
      // Para Android y otros navegadores que no requieren permiso
      console.log('Iniciando detección sin necesidad de permiso...');
      startMotionDetection();
    }

    // Fallback para desktop - tecla espacio y movimiento de mouse rápido
    document.addEventListener('keydown', (e) => {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      if (e.code === 'Space' || e.key === ' ') {
        console.log('Tecla espacio presionada - simulando agitado');
        handleInteractionDetected();
      }
    });

    // Detectar movimiento rápido de mouse como agitado en desktop
    let lastMouseMove = Date.now();
    document.addEventListener('mousemove', () => {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      const now = Date.now();
      if (now - lastMouseMove < 100) { // Movimiento muy rápido
        moveCounter++;
        console.log('Movimiento rápido de mouse detectado');
        
        if (moveCounter >= 3) {
          console.log('¡Movimiento de mouse detectado como agitado!');
          handleInteractionDetected();
        }
      }
      lastMouseMove = now;
    });
  }

  function handleInteractionDetected() {
    if (isInteractionDetected) return;
    
    console.log('Interacción detectada, activando efectos...');
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
    
    // Reproducir música - IMPORTANTE: esto se ejecuta tanto para click como para shake
    console.log('Reproduciendo música...');
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
    
    // Crear 200 flores estáticas - ¡MUCHÍSIMAS MÁS!
    for (let i = 0; i < 200; i++) {
      const flower = document.createElement('div');
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      flower.className = `static-flower ${size}`;
      
      // Posición aleatoria en TODA la pantalla
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      // Tipo de flor aleatorio
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      
      flower.style.top = `${top}%`;
      flower.style.left = `${left}%`;
      flower.style.opacity = 0.7 + Math.random() * 0.3;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      // Animación delay y duración aleatoria
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
    
    // Crear flores MUY FRECUENTEMENTE
    setInterval(createFallingFlower, 100);
    
    // Crear muchas flores iniciales
    for (let i = 0; i < 40; i++) {
      setTimeout(createFallingFlower, i * 50);
    }
  }

  // CLICK FUNCIONAL
  function setupClickInteraction() {
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    function handleClick(e) {
      if (!isInteractionDetected) {
        console.log('Click detectado, activando...');
        if (shakeDetectionActive) {
          shakeDetectionActive = false;
        }
        handleInteractionDetected();
      }
    }
  }

  // CARRUSEL SIMPLIFICADO - PARA MÚLTIPLES CARRUSELES
  function initialize3DCarousel() {
    const carousels = document.querySelectorAll('.carousel-3d-container');
    
    carousels.forEach(container => {
      const slides = container.querySelectorAll('.carousel-slide');
      const totalSlides = slides.length;
      
      if (totalSlides === 0) return;
      
      let currentSlide = 0;
      let rotationInterval;
      
      // Actualizar clases de los slides
      function updateSlides() {
        slides.forEach((slide, index) => {
          // Remover todas las clases
          slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
          
          // Calcular la posición relativa
          let diff = index - currentSlide;
          
          // Ajustar para el carrusel circular
          if (diff < -Math.floor(totalSlides / 2)) {
            diff += totalSlides;
          } else if (diff > Math.floor(totalSlides / 2)) {
            diff -= totalSlides;
          }
          
          // Asignar clases según la posición
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
      
      // Cambiar al siguiente slide
      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
      }
      
      // Inicializar
      updateSlides();
      
      // Limpiar intervalo anterior si existe
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
      
      // Rotación automática cada 4 segundos (más tiempo)
      rotationInterval = setInterval(nextSlide, 4000);
      
      // Pausar rotación cuando la página no está visible
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
    setupClickInteraction();
    initShakeDetection();
    
    // Iniciar contador
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  init();
});
