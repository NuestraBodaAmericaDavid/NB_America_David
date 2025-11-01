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
  
  let audioContext;
  let analyser;
  let microphone;
  let isBlowDetected = false;
  let blowDetectionActive = false;

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

  // DETECCIÓN DE SOPLO
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
    const blowThreshold = 140;
    let blowCounter = 0;
    const blowConfirmation = 3;
    
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
    
    // Transición después de la animación de soplo
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5 }
      );
    }, 3000);
  }

  // CLICK FUNCIONAL
  function setupClickInteraction() {
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    function handleClick(e) {
      if (!isBlowDetected) {
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

  // INICIALIZAR
  function init() {
    initializeStaticFlowers();
    initializeFlowerRain(flowerRainContainer);
    initializeFlowerRain(flowerRainMainContainer);
    setupClickInteraction();
    initBlowDetection();
    
    // Iniciar contador
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  init();

  // Mantén tu código existente para carruseles, etc.
});
