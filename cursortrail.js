// Custom cursor
const cursor = document.createElement('span');
cursor.textContent = '+';
cursor.id = 'custom-cursor';
cursor.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  font-size: 20px;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(cursor);

// Hide default cursor
document.body.style.cursor = 'none';

// Cursor trail
let lastX = 0, lastY = 0;

document.addEventListener('mousemove', (e) => {
    // Update custom cursor position
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Change cursor on hover
    const hovering = document.elementFromPoint(e.clientX, e.clientY);
    if (hovering && (hovering.tagName === 'BUTTON' || hovering.tagName === 'A' || hovering.onclick || hovering.style.cursor === 'pointer' || hovering.classList.contains('floating-city'))) {
        cursor.textContent = 'x';
    } else {
        cursor.textContent = '+';
    }

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    // Only spawn trail if mouse moved enough
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