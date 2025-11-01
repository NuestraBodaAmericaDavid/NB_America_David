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
  
  let isBlowDetected = false;
  let shakeDetectionActive = true;

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
      if (!shakeDetectionActive || isBlowDetected) return;
      
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
          handleShakeDetected();
        }
      } else {
        moveCounter = Math.max(0, moveCounter - 0.5);
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    });
    
    // Fallback para desktop - simular agitado con tecla espacio o movimiento de mouse rápido
    let mouseMoves = 0;
    let lastMouseTime = 0;
    
    document.addEventListener('mousemove', () => {
      if (!shakeDetectionActive || isBlowDetected) return;
      
      const now = Date.now();
      if (now - lastMouseTime < 100) { // Movimiento rápido
        mouseMoves++;
        if (mouseMoves > 10) {
          handleShakeDetected();
        }
      }
      lastMouseTime = now;
    });
    
    document.addEventListener('keydown', (e) => {
      if (!shakeDetectionActive || isBlowDetected) return;
      
      if (e.code === 'Space' || e.key === ' ') {
        handleShakeDetected();
      }
    });
  }

  function handleShakeDetected() {
    if (isBlowDetected) return;
    
    isBlowDetected = true;
    shakeDetectionActive = false;
    
    // Efecto visual de agitado
    blockIntro.classList.add('blow-detected');
    
    // Animación extra para los anillos
    gsap.to('.rings-image', {
      rotation: 360,
      scale: 1.2,
      duration: 
