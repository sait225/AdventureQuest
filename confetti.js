// Confetti particle system
class ConfettiSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y) {
    const colors = [
      '#fbbf24', '#f59e0b', '#ef4444', '#ec4899',
      '#8b5cf6', '#7c5cfc', '#3b82f6', '#06b6d4',
      '#10b981', '#34d399', '#f97316', '#e040fb'
    ];
    return {
      x: x || Math.random() * this.canvas.width,
      y: y || -10,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -8 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.15 + Math.random() * 0.1,
      drag: 0.98,
      opacity: 1,
      shape: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=triangle
      life: 1,
      decay: 0.003 + Math.random() * 0.005
    };
  }

  burst(count = 80) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(cx, cy);
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 4 + Math.random() * 10;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 5;
      this.particles.push(p);
    }
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }

  rain(count = 120, duration = 3000) {
    const interval = duration / count;
    let spawned = 0;
    const spawner = setInterval(() => {
      if (spawned >= count) { clearInterval(spawner); return; }
      const p = this.createParticle();
      p.vy = Math.random() * 2 + 1;
      p.vx = (Math.random() - 0.5) * 3;
      this.particles.push(p);
      spawned++;
    }, interval);
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }

  drawParticle(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.globalAlpha = p.opacity * p.life;
    this.ctx.fillStyle = p.color;

    const s = p.size;
    if (p.shape === 0) {
      this.ctx.fillRect(-s / 2, -s / 2, s, s * 0.6);
    } else if (p.shape === 1) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(0, -s / 2);
      this.ctx.lineTo(s / 2, s / 2);
      this.ctx.lineTo(-s / 2, s / 2);
      this.ctx.closePath();
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }
      this.drawParticle(p);
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.running = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
