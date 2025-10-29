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

  // Inicializar MUCHAS MÁS flores estáticas
  function initializeStaticFlowers() {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    const sizes = ['tiny', 'small', 'medium', 'large', 'xlarge'];
    
    // Crear 120 flores estáticas - ¡MUCHAS MÁS!
    for (let i = 0; i < 120; i++) {
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
      flower.style.opacity = 0.6 + Math.random() * 0.4; // Variar opacidad
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      // Animación delay y duración aleatoria
      flower.style.animationDelay = `${Math.random() * 8}s`;
      flower.style.animationDuration = `${7 + Math.random() * 5}s`;
      
      staticFlowersContainer.appendChild(flower);
    }
  }

  // Inicializar lluvia de flores MÁS DENSA
  function initializeFlowerRain(container) {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    
    function createFallingFlower() {
      const flower = document.createElement('div');
      flower.className = 'falling-flower';
      
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 10; // 10-20 segundos
      const delay = Math.random() * 2;
      const size = 15 + Math.random() * 20; // 15-35px
      
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
    
    // Crear flores continuamente - MUCHO MÁS FRECUENTE
    setInterval(createFallingFlower, 150);
    
    // Crear muchas flores iniciales
    for (let i = 0; i < 25; i++) {
      setTimeout(createFallingFlower, i * 100);
    }
  }

  // DETECCIÓN DE SOPLO MEJORADA
  async function initBlowDetection() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        },
        video: false
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
      console.log('Micrófono no disponible, usando solo click');
    }
  }

  function detectBlow() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const blowThreshold = 150;
    let blowCounter = 0;
    const blowConfirmation = 4;
    
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
    blowDetectionActive = false;
    
    // Aplicar efecto de soplo suave
    blockIntro.classList.add('blow-detected');
    
    // Reproducir música
    playMusic();
    
    // Transición a siguiente pantalla
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 1.8, ease: "back.out(1.7)" }
      );
    }, 2500); // Dar tiempo a la animación de soplo
  }

  // CLICK FUNCIONAL SIEMPRE - CORREGIDO
  function setupClickInteraction() {
    // Click en cualquier parte de la pantalla
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    function handleClick(e) {
      if (!isBlowDetected) {
        // Si la detección de soplo está activa, desactivarla
        if (blowDetectionActive && microphone) {
          blowDetectionActive = false;
          microphone.disconnect();
        }
        handleBlowDetected();
      }
    }
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
  function init() {
    initializeStaticFlowers();
    initializeFlowerRain(flowerRainContainer);
    initializeFlowerRain(flowerRainMainContainer);
    setupClickInteraction();
    initBlowDetection();
    
    console.log('Página cargada - Click o sopla para continuar');
  }

  init();

  // Tu código existente para cuenta regresiva, carruseles, etc.
  // ... (mantén tu código JavaScript existente) ...
});
