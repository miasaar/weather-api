let lastX = 0, lastY = 0;

document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    // Only spawn if mouse moved enough
    if (dx * dx + dy * dy > 3600) {
        const sparkle = document.createElement('span');
        sparkle.textContent = '╷';
        sparkle.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      pointer-events: none;
      z-index: 9999;
      font-size: 24px;
      animation: fade 0.6s ease-out forwards;
    `;
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 600);

        lastX = e.clientX;
        lastY = e.clientY;
    }
});