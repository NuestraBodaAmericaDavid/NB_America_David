// script.js
document.addEventListener('DOMContentLoaded', () => {
  const blockIntro = document.getElementById('block-intro');
  const blockInvitation = document.getElementById('block-invitation');
  const backgroundMusic = document.getElementById('background-music');
  const staticFlowersContainer = document.getElementById('static-flowers');
  const flowerRainContainer = document.getElementById('flower-rain');
  const flowerRainMainContainer = document.getElementById('flower-rain-main');
  
  let audioContext;
  let analyser;
  let microphone;
  let isBlowDetected = false;
  let blowDetectionActive = false;

  // Inicializar MUCHAS flores estáticas
  function initializeStaticFlowers() {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    
    // Crear 60 flores estáticas - ¡MUCHAS MÁS!
    for (let i = 0; i < 60; i++) {
      const flower = document.createElement('div');
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      flower.className = `static-flower ${size}`;
      
      // Posición aleatoria en toda la pantalla
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      // Tipo de flor aleatorio
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      
      flower.style.top = `${top}%`;
      flower.style.left = `${left}%`;
      flower.style.opacity = 0.7 + Math.random() * 0.3; // Variar opacidad
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      // Animación delay y duración aleatoria
      flower.style.animationDelay = `${Math.random() * 6}s`;
      flower.style.animationDuration = `${6 + Math.random() * 4}s`;
      
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
      const duration = 12 + Math.random() * 8; // 12-20 segundos
      const delay = Math.random() * 3;
      const size = 20 + Math.random() * 15; // 20-35px
      
      flower.style.left = `${left}%`;
      flower.style.animationDuration = `${duration}s`;
      flower.style.animationDelay = `${delay}s`;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor" style="width: ${size}px; height: ${size}px;">`;
      
      container.appendChild(flower);
      
      // Remover flor después de caer
      setTimeout(() => {
        if (flower.parentNode) {
          flower.parentNode.removeChild(flower);
        }
      }, duration * 1000);
    }
    
    // Crear flores continuamente - MÁS FRECUENTE
    setInterval(createFallingFlower, 300);
    
    // Crear flores iniciales
    for (let i = 0; i < 15; i++) {
      setTimeout(createFallingFlower, i * 200);
    }
  }

  // DETECCIÓN DE SOPLO MEJORADA
  async function initBlowDetection() {
    try {
      // SOLO pedir audio, no video
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        },
        video: false // IMPORTANTE: no pedir video
      });
      
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      blowDetectionActive = true;
      detectBlow();
      
    } catch (error) {
      console.log('Micrófono no disponible:', error);
      // NO hacer nada - el click funcionará como fallback
    }
  }

  function detectBlow() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const blowThreshold = 160; // Sensibilidad ajustada
    let blowCounter = 0;
    const blowConfirmation = 5; // Necesita 5 frames consecutivos
    
    function checkBlow() {
      if (!blowDetectionActive) return;
      
      analyser.getByteFrequencyData(dataArray);
      const volume = Math.max(...dataArray);
      
      if (volume > blowThreshold && !isBlowDetected) {
        blowCounter++;
        if (blowCounter >= blowConfirmation) {
          handleBlowDetected();
        }
      } else {
        blowCounter = Math.max(0, blowCounter - 1);
      }
      
      requestAnimationFrame(checkBlow);
    }
    checkBlow();
  }

  function handleBlowDetected() {
    if (isBlowDetected) return;
    
    isBlowDetected = true;
    blowDetectionActive = false; // Detener detección
    
    // Efecto visual de soplo MEJORADO
    blockIntro.classList.add('blow-detected');
    
    // Animar TODAS las flores más dramáticamente
    gsap.to('.static-flower', {
      x: "random(-40, 40)",
      y: "random(-30, 30)", 
      rotation: "random(-20, 20)",
      scale: "random(0.8, 1.3)",
      duration: 1.2,
      stagger: {
        amount: 0.6,
        from: "random"
      },
      ease: "power2.out"
    });
    
    // Reproducir música y transición
    playMusic();
    
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 1.8, ease: "back.out(1.7)" }
      );
    }, 1800);
  }

  // CLICK FUNCIONAL SIEMPRE
  function setupClickInteraction() {
    // Click en cualquier parte de la pantalla
    document.addEventListener('click', (e) => {
      if (!isBlowDetected) {
        // Si la detección de soplo está activa, desactivarla
        if (blowDetectionActive) {
          blowDetectionActive = false;
          // Cerrar stream de micrófono si existe
          if (microphone) {
            microphone.disconnect();
          }
        }
        handleBlowDetected();
      }
    });
    
    // También permitir touch
    document.addEventListener('touchstart', (e) => {
      if (!isBlowDetected) {
        if (blowDetectionActive) {
          blowDetectionActive = false;
          if (microphone) {
            microphone.disconnect();
          }
        }
        handleBlowDetected();
      }
    });
  }

  function playMusic() {
    if (backgroundMusic) {
      backgroundMusic.volume = 0.6;
      backgroundMusic.play().catch(error => {
        console.log('Error reproduciendo música:', error);
      });
    }
  }

  // INICIALIZAR TODO
  initializeStaticFlowers();
  initializeFlowerRain(flowerRainContainer);
  initializeFlowerRain(flowerRainMainContainer);
  setupClickInteraction(); // SIEMPRE activar click
  initBlowDetection(); // Intentar detección de soplo

  // Tu código existente para cuenta regresiva, etc.
  // ... (mantén tu código JavaScript existente) ...
});
