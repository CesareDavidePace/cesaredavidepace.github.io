import React, { useRef, useEffect } from 'react';

interface BackgroundAnimationProps {
  darkMode: boolean;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Walker state
    let walkerX = -100;
    let walkerY = height / 2;
    const speed = 2.5;
    let time = 0;
    let glitchTimer = 0;
    let isGlitching = false;
    let direction = 1; // 1 = right, -1 = left
    
    // Animation modes
    let animationMode: 'walk' | 'run' | 'jump' | 'dance' = 'walk';
    let modeTimer = 0;
    let modeDuration = 300; // frames before changing mode
    
    // Movement pattern
    let movementPattern: 'horizontal' | 'wave' | 'zigzag' | 'spiral' = 'horizontal';
    let patternTimer = 0;
    let patternDuration = 500;
    let waveOffset = 0;
    
    // Particle system for trail effect
    const particles: Array<{x: number, y: number, vx: number, vy: number, life: number, maxLife: number}> = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      walkerY = height * 0.6; // Start position
    };

    window.addEventListener('resize', resize);
    resize();

    // Helper to draw a bone
    const drawBone = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    // Helper to draw a joint
    const drawJoint = (x: number, y: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- Update Logic ---
      time += 0.05;
      
      // Change animation mode randomly
      modeTimer++;
      if (modeTimer > modeDuration) {
        const modes: Array<'walk' | 'run' | 'jump' | 'dance'> = ['walk', 'walk', 'run', 'jump', 'dance'];
        animationMode = modes[Math.floor(Math.random() * modes.length)];
        modeTimer = 0;
        modeDuration = 200 + Math.random() * 400; // 200-600 frames
      }
      
      // Change movement pattern
      patternTimer++;
      if (patternTimer > patternDuration) {
        const patterns: Array<'horizontal' | 'wave' | 'zigzag' | 'spiral'> = ['horizontal', 'wave', 'zigzag', 'spiral'];
        movementPattern = patterns[Math.floor(Math.random() * patterns.length)];
        patternTimer = 0;
        patternDuration = 400 + Math.random() * 600;
      }
      
      // Adjust speed based on mode
      let currentSpeed = speed;
      if (animationMode === 'run') currentSpeed = speed * 2;
      if (animationMode === 'jump') currentSpeed = speed * 1.5;
      if (animationMode === 'dance') currentSpeed = 0;
      
      // Move walker horizontally
      walkerX += currentSpeed * direction;
      
      // Apply movement pattern to vertical position
      waveOffset += 0.05;
      const baseY = height * 0.6;
      
      switch(movementPattern) {
        case 'wave':
          walkerY = baseY + Math.sin(waveOffset * 2) * 80;
          break;
        case 'zigzag':
          walkerY = baseY + (Math.floor(waveOffset) % 2 === 0 ? -50 : 50);
          break;
        case 'spiral':
          const spiralRadius = 60;
          const spiralSpeed = 0.1;
          walkerY = baseY + Math.sin(time * spiralSpeed) * spiralRadius * Math.sin(waveOffset);
          break;
        default: // horizontal
          walkerY = baseY + Math.sin(time * 6) * 10; // subtle bobbing
      }
      
      // Turn around if off screen
      if (direction === 1 && walkerX > width + 100) {
        direction = -1;
        walkerX = width + 100;
      } else if (direction === -1 && walkerX < -100) {
        direction = 1;
        walkerX = -100;
      }

      // Random Glitch Trigger (1 in 300 chance per frame ~ every 5-10 sec)
      if (!isGlitching && Math.random() < 0.003) {
        isGlitching = true;
        glitchTimer = 60; // Glitch for 60 frames (1 sec)
      }

      if (glitchTimer > 0) {
        glitchTimer--;
        if (glitchTimer === 0) isGlitching = false;
      }
      
      // Add particles on each step
      if (Math.random() < 0.3) {
        particles.push({
          x: walkerX + (Math.random() - 0.5) * 20,
          y: walkerY + 50 + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1,
          vy: -Math.random() * 2 - 1,
          life: 1,
          maxLife: 30 + Math.random() * 30
        });
      }
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life++;
        
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        
        const alpha = (1 - p.life / p.maxLife) * 0.4;
        const size = 2 * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? `rgba(56, 189, 248, ${alpha})` : `rgba(251, 146, 60, ${alpha})`;
        ctx.fill();
      }

      // --- Kinematics (The "Science" bit) ---
      // Scale of the skeleton
      const s = 1.2; 
      
      // Base positions
      const hipX = walkerX;
      const hipY = walkerY;
      
      // Oscillations for walking gait
      // If glitching, we add random noise to the phases
      const noise = () => isGlitching ? (Math.random() - 0.5) * 150 : 0;
      
      // Adjust animation parameters based on mode
      let legSpeed = 3;
      let armSpeed = 3;
      let legAmplitude = 30;
      let armAmplitude = 20;
      let verticalBob = 5;
      let jumpHeight = 0;
      
      if (animationMode === 'run') {
        legSpeed = 5;
        armSpeed = 5;
        legAmplitude = 45;
        armAmplitude = 35;
        verticalBob = 8;
      } else if (animationMode === 'jump') {
        jumpHeight = Math.abs(Math.sin(time * 2)) * 80;
        legAmplitude = 20;
        armAmplitude = 15;
      } else if (animationMode === 'dance') {
        legSpeed = 4;
        armSpeed = 4;
        legAmplitude = 15;
        armAmplitude = 30;
        verticalBob = Math.abs(Math.sin(time * 4)) * 10;
      }
      
      const legPhase = time * legSpeed;
      const armPhase = time * armSpeed;

      // Body parts (Simple 2D rig)
      const headX = hipX + noise() * 0.2;
      const headY = hipY - 60 * s + Math.sin(time * 6) * verticalBob + noise() - jumpHeight; // Bobbing head

      const shoulderX = hipX;
      const shoulderY = hipY - 45 * s + noise() - jumpHeight;

      // Legs (Inverse Kinematics-ish via sine waves)
      // Left Leg
      const lHipX = hipX;
      const lHipY = hipY - jumpHeight;
      const lKneeX = hipX + Math.sin(legPhase) * legAmplitude * s + noise();
      const lKneeY = hipY + 25 * s - Math.cos(legPhase) * 10 * s + noise() - jumpHeight;
      const lFootX = hipX + Math.sin(legPhase - 0.5) * legAmplitude * 1.6 * s + noise();
      const lFootY = hipY + 55 * s + Math.min(0, Math.sin(legPhase)) * 10 * s + noise() - jumpHeight; // Lift foot

      // Right Leg (Phase offset Math.PI)
      const rHipX = hipX;
      const rHipY = hipY - jumpHeight;
      const rKneeX = hipX + Math.sin(legPhase + Math.PI) * legAmplitude * s + noise();
      const rKneeY = hipY + 25 * s - Math.cos(legPhase + Math.PI) * 10 * s + noise() - jumpHeight;
      const rFootX = hipX + Math.sin(legPhase + Math.PI - 0.5) * legAmplitude * 1.6 * s + noise();
      const rFootY = hipY + 55 * s + Math.min(0, Math.sin(legPhase + Math.PI)) * 10 * s + noise() - jumpHeight;

      // Arms (Opposite to legs)
      // Left Arm
      const lShoulderX = shoulderX;
      const lShoulderY = shoulderY;
      const lElbowX = shoulderX + Math.sin(armPhase + Math.PI) * armAmplitude * s + noise();
      const lElbowY = shoulderY + 20 * s + noise();
      const lHandX = shoulderX + Math.sin(armPhase + Math.PI) * armAmplitude * 2 * s + noise();
      const lHandY = shoulderY + 40 * s - Math.abs(Math.sin(armPhase)) * 10 * s + noise();

      // Right Arm
      const rShoulderX = shoulderX;
      const rShoulderY = shoulderY;
      const rElbowX = shoulderX + Math.sin(armPhase) * armAmplitude * s + noise();
      const rElbowY = shoulderY + 20 * s + noise();
      const rHandX = shoulderX + Math.sin(armPhase) * armAmplitude * 2 * s + noise();
      const rHandY = shoulderY + 40 * s - Math.abs(Math.sin(armPhase)) * 10 * s + noise();


      // --- Drawing ---
      // Theme colors
      const boneColor = darkMode ? 'rgba(14, 165, 233, 0.4)' : 'rgba(251, 146, 60, 0.4)';
      const jointColor = darkMode ? '#38bdf8' : '#fb923c';
      const glitchColor = '#ef4444'; // Red for error

      const currentBoneColor = isGlitching ? glitchColor : boneColor;
      const currentJointColor = isGlitching ? glitchColor : jointColor;

      // Draw Bones
      drawBone(headX, headY + 10, shoulderX, shoulderY, currentBoneColor); // Neck
      drawBone(shoulderX, shoulderY, hipX, hipY, currentBoneColor); // Spine
      
      // Arms
      drawBone(lShoulderX, lShoulderY, lElbowX, lElbowY, currentBoneColor);
      drawBone(lElbowX, lElbowY, lHandX, lHandY, currentBoneColor);
      drawBone(rShoulderX, rShoulderY, rElbowX, rElbowY, currentBoneColor);
      drawBone(rElbowX, rElbowY, rHandX, rHandY, currentBoneColor);

      // Legs
      drawBone(lHipX, lHipY, lKneeX, lKneeY, currentBoneColor);
      drawBone(lKneeX, lKneeY, lFootX, lFootY, currentBoneColor);
      drawBone(rHipX, rHipY, rKneeX, rKneeY, currentBoneColor);
      drawBone(rKneeX, rKneeY, rFootX, rFootY, currentBoneColor);

      // Draw Head
      ctx.beginPath();
      ctx.arc(headX, headY, 8 * s, 0, Math.PI * 2);
      ctx.strokeStyle = currentJointColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add glow effect to head
      if (!isGlitching) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = darkMode ? '#38bdf8' : '#fb923c';
        ctx.beginPath();
        ctx.arc(headX, headY, 6 * s, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(251, 146, 60, 0.2)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Joints
      [
        {x: headX, y: headY}, {x: shoulderX, y: shoulderY},
        {x: lElbowX, y: lElbowY}, {x: rElbowX, y: rElbowY},
        {x: lHandX, y: lHandY}, {x: rHandX, y: rHandY},
        {x: hipX, y: hipY},
        {x: lKneeX, y: lKneeY}, {x: rKneeX, y: rKneeY},
        {x: lFootX, y: lFootY}, {x: rFootX, y: rFootY}
      ].forEach(p => drawJoint(p.x, p.y, currentJointColor));

      // Draw "UI" box floating above head
      const boxX = walkerX - 60;
      const boxY = walkerY - 180;
      
      // Add subtle shadow/glow to box
      ctx.shadowBlur = 10;
      ctx.shadowColor = darkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(251, 146, 60, 0.3)';
      ctx.fillStyle = darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 247, 237, 0.9)';
      ctx.fillRect(boxX, boxY, 120, 50);
      ctx.shadowBlur = 0;
      
      // Border
      ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.5)' : 'rgba(251, 146, 60, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, 120, 50);
      
      ctx.font = '10px monospace';
      ctx.fillStyle = darkMode ? '#94a3b8' : '#78716c';
      ctx.fillText(`ID: WALKER_01`, boxX + 10, boxY + 15);
      
      // Display current mode and pattern
      ctx.font = '8px monospace';
      ctx.fillStyle = darkMode ? '#64748b' : '#a8a29e';
      const modeLabel = animationMode.toUpperCase();
      const patternLabel = movementPattern.toUpperCase();
      ctx.fillText(`${modeLabel} | ${patternLabel}`, boxX + 10, boxY + 27);
      
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = isGlitching ? '#ef4444' : (darkMode ? '#4ade80' : '#15803d');
      const conf = isGlitching ? (Math.random() * 0.2).toFixed(2) : (0.95 + Math.random() * 0.04).toFixed(2);
      ctx.fillText(`CONF: ${conf}`, boxX + 10, boxY + 41);

      if (isGlitching) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '9px monospace';
        ctx.fillText(`⚠ TRACKING LOST`, boxX + 10, walkerY - 145);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-1000"
      style={{ opacity: 0.6 }}
    />
  );
};

export default BackgroundAnimation;
