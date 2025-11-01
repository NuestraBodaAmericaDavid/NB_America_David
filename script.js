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
  let musicStarted = false;
  let musicOverlayShown = false;

  // Función para reproducir música - MEJORADA PARA MÓVILES
  function playMusic() {
    if (musicStarted) return;
    
    if (backgroundMusic) {
      // Configurar música
      backgroundMusic.volume = 0.6;
      
      // Intentar reproducir
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Música reproducida exitosamente');
          musicStarted = true;
          // Remover overlay si existe
          const existingOverlay = document.getElementById('music-activation-overlay');
          if (existingOverlay) {
            existingOverlay.remove();
          }
        }).catch(error => {
          console.log('Error reproduciendo música:', error);
          // En móviles, mostrar overlay para activación manual
          if (!musicOverlayShown) {
            showMusicActivationOverlay();
          }
        });
      }
    }
  }

  // Mostrar overlay para activación de música
  function showMusicActivationOverlay() {
    if (musicOverlayShown) return;
    
    musicOverlayShown = true;
    
    // Crear un botón overlay para activar música
    const musicOverlay = document.createElement('div');
    musicOverlay.id = 'music-activation-overlay';
    musicOverlay.innerHTML = `
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
          padding: 40px 30px;
          border-radius: 20px;
          border: 2px solid #D4AF37;
          max-width: 400px;
          width: 90%;
        ">
          <h2 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-bottom: 20px; color: #D4AF37;">
            🎵 Activar Música 🎵
          </h2>
          <p style="font-size: 1.1rem; margin-bottom: 30px; line-height: 1.5;">
            Para una experiencia completa, activa la música de fondo tocando el botón below
          </p>
          <button id="activate-music-btn" style="
            background: linear-gradient(135deg, #D4AF37, #FFD700);
            color: #0057A3;
            border: none;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            font-family: 'Dancing Script', cursive;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 15px;
            width: 100%;
          ">
            Activar Música
          </button>
          <button id="skip-music-btn" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.5);
            padding: 12px 25px;
            font-size: 1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
          ">
            Continuar sin música
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(musicOverlay);
    
    // Agregar event listeners
    document.getElementById('activate-music-btn').addEventListener('click', activateMusic);
    document.getElementById('skip-music-btn').addEventListener('click', skipMusic);
    
    // Agregar estilos para hover
    const activateBtn = document.getElementById('activate-music-btn');
    const skipBtn = document.getElementById('skip-music-btn');
    
    activateBtn.addEventListener('mouseenter', () => {
      activateBtn.style.transform = 'translateY(-2px)';
      activateBtn.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
    });
    
    activateBtn.addEventListener('mouseleave', () => {
      activateBtn.style.transform = 'translateY(0)';
      activateBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    });
    
    skipBtn.addEventListener('mouseenter', () => {
      skipBtn.style.background = 'rgba(255, 255, 255, 0.1)';
      skipBtn.style.borderColor = '#D4AF37';
    });
    
    skipBtn.addEventListener('mouseleave', () => {
      skipBtn.style.background = 'transparent';
      skipBtn.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    });
  }

  // Función para activar música
  function activateMusic() {
    if (musicStarted) return;
    
    backgroundMusic.play().then(() => {
      console.log('Música activada por usuario');
      musicStarted = true;
      const musicOverlay = document.getElementById('music-activation-overlay');
      if (musicOverlay) {
        musicOverlay.remove();
      }
    }).catch(error => {
      console.log('Error al activar música:', error);
      // Si falla, mostrar mensaje de error
      const activateBtn = document.getElementById('activate-music-btn');
      const message = document.querySelector('#music-activation-overlay p');
      if (activateBtn && message) {
        activateBtn.textContent = '❌ Error al activar';
        activateBtn.style.background = '#ff4444';
        message.textContent = 'El navegador no permite la reproducción. Verifica que el sonido esté activado y intenta nuevamente.';
        message.style.color = '#ff6b6b';
        
        // Resetear después de 3 segundos
        setTimeout(() => {
          activateBtn.textContent = 'Intentar nuevamente';
          activateBtn.style.background = 'linear-gradient(135deg, #D4AF37, #FFD700)';
          message.textContent = 'Para una experiencia completa, activa la música de fondo tocando el botón below';
          message.style.color = 'white';
        }, 3000);
      }
    });
  }

  // Función para saltar música
  function skipMusic() {
    console.log('Usuario eligió continuar sin música');
    musicStarted = true; // Marcar como iniciada para no mostrar de nuevo
    const musicOverlay = document.getElementById('music-activation-overlay');
    if (musicOverlay) {
      musicOverlay.remove();
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
  
  // DETECCIÓN DE AGITADO (SHAKE)
  function initShakeDetection() {
    if (!window.DeviceMotionEvent) {
      console.log('Dispositivo no soporta detección de movimiento');
      return;
    }
    
    let lastX, lastY, lastZ;
    let moveCounter = 0;
    const shakeThreshold = 15; // Sensibilidad del agitado
    
    window.addEventListener('devicemotion', (event) => {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      const acceleration = event.accelerationIncludingGravity;
      const { x, y, z } = acceleration;
      
      if (!lastX && !lastY && !lastZ) {
        lastX = x;
        lastY = y;
        lastZ = z;
        return;
      }
      
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      if (deltaX + deltaY + deltaZ > shakeThreshold) {
        moveCounter++;
        
        if (moveCounter > 5) { // Confirmar agitado
          handleInteractionDetected();
        }
      } else {
        moveCounter = Math.max(0, moveCounter - 0.5);
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    });
    
    // Fallback para desktop - simular agitado con tecla espacio
    document.addEventListener('keydown', (e) => {
      if (!shakeDetectionActive || isInteractionDetected) return;
      
      if (e.code === 'Space' || e.key === ' ') {
        handleInteractionDetected();
      }
    });
  }

  function handleInteractionDetected() {
    if (isInteractionDetected) return;
    
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
    
    // Reproducir música
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
    setInterval(createFallingFlower, 200);
    
    // Crear muchas flores iniciales
    for (let i = 0; i < 40; i++) {
      setTimeout(createFallingFlower, i * 50);
    }
  }

  // CLICK FUNCIONAL - CORREGIDO
  function setupClickInteraction() {
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    function handleClick(e) {
      if (!isInteractionDetected) {
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
    
    // Intentar reproducir música automáticamente (para desktop)
    setTimeout(() => {
      if (!musicStarted) {
        playMusic();
      }
    }, 1000);
  }

  init();
});
