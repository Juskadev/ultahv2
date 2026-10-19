/**
 * Happy Birthday Mutia Fajriah - Romantic Auto-Play & Walking Dolls
 * Features:
 * 1. Automatic show progression (Tanpa klik jalan otomatis!)
 * 2. Walking animated dolls that patrol the screen & react to clicks
 * 3. Photo gallery with real pictures of Mutia Fajriah
 * 4. Web Audio API music & sound effects
 * 5. Interactive cake, love letter, love coupons, and love meter
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. WEB AUDIO API SOUND GENERATOR
  // ==========================================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicMuted = false;
  let fxMuted = false;
  let musicTimeout = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Auto-unlock AudioContext on first touch/interaction
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      initAudioContext();
      if (!isMusicPlaying && !musicMuted) {
        startMusic();
      }
    }, { once: true });
  });

  // Sound: Cute Pop Bubble
  function playPopSound() {
    if (fxMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Sound: Balloon Pop
  function playBalloonBurstSound() {
    if (fxMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 650;
    filter.Q.value = 1.2;

    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
  }

  // Sound: Candle Whoosh
  function playBlowSound() {
    if (fxMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.4);

    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
  }

  // Sound: Fanfare / Party Horn
  function playPartyHornSound() {
    if (fxMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.14, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.52);
    });
  }

  // Happy Birthday Music Box Melody
  const hbdNotes = [
    { n: 261.63, d: 0.35 }, { n: 261.63, d: 0.35 }, { n: 293.66, d: 0.7 }, { n: 261.63, d: 0.7 }, { n: 349.23, d: 0.7 }, { n: 329.63, d: 1.1 },
    { n: 261.63, d: 0.35 }, { n: 261.63, d: 0.35 }, { n: 293.66, d: 0.7 }, { n: 261.63, d: 0.7 }, { n: 392.00, d: 0.7 }, { n: 349.23, d: 1.1 },
    { n: 261.63, d: 0.35 }, { n: 261.63, d: 0.35 }, { n: 523.25, d: 0.7 }, { n: 440.00, d: 0.7 }, { n: 349.23, d: 0.7 }, { n: 329.63, d: 0.7 }, { n: 293.66, d: 0.9 },
    { n: 466.16, d: 0.35 }, { n: 466.16, d: 0.35 }, { n: 440.00, d: 0.7 }, { n: 349.23, d: 0.7 }, { n: 392.00, d: 0.7 }, { n: 349.23, d: 1.3 }
  ];

  function playHBDMelody() {
    if (!isMusicPlaying || musicMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    let timeOffset = audioCtx.currentTime + 0.1;

    hbdNotes.forEach(item => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.n, timeOffset);

      gain.gain.setValueAtTime(0.18, timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + item.d * 0.9);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(timeOffset);
      osc.stop(timeOffset + item.d);

      timeOffset += item.d * 0.95;
    });

    const totalDuration = (timeOffset - audioCtx.currentTime) * 1000;
    musicTimeout = setTimeout(() => {
      if (isMusicPlaying) {
        playHBDMelody();
      }
    }, totalDuration + 1500);
  }

  function startMusic() {
    isMusicPlaying = true;
    playHBDMelody();
  }

  function stopMusic() {
    isMusicPlaying = false;
    if (musicTimeout) clearTimeout(musicTimeout);
  }

  // ==========================================================================
  // 2. CANVAS CONFETTI ENGINE
  // ==========================================================================
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = [
    '#ff3366', '#ff758f', '#ffd166', '#ffbe0b',
    '#e63946', '#06d6a0', '#8338ec', '#ffffff'
  ];

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : -20;
      this.size = Math.random() * 8 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedX = (Math.random() - 0.5) * 8;
      this.speedY = Math.random() * -6 - 3;
      this.gravity = 0.2 + Math.random() * 0.15;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.shape = Math.random() > 0.4 ? 'circle' : (Math.random() > 0.5 ? 'rect' : 'heart');
      this.alpha = 1;
      this.decay = Math.random() * 0.005 + 0.003;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        // Heart shape
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function launchConfetti(x, y, count = 80) {
    for (let i = 0; i < count; i++) {
      particles.push(new ConfettiParticle(x, y));
    }
    if (!animationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    } else {
      animationId = null;
    }
  }

  // ==========================================================================
  // 3. AUTO-PLAY TIMELINE CONTROLLER (TANPA KLIK JALAN OTOMATIS)
  // ==========================================================================
  const progressFill = document.getElementById('auto-progress-fill');
  const statusText = document.getElementById('auto-status-text');
  const giftBox = document.getElementById('gift-box');
  const autoCountdownText = document.getElementById('auto-countdown-text');
  const unboxingSpeech = document.getElementById('unboxing-speech');
  const sceneUnboxing = document.getElementById('scene-unboxing');
  const sceneParty = document.getElementById('scene-party');

  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const candleStatus = document.getElementById('candle-status');
  const flames = [
    document.getElementById('flame-1'),
    document.getElementById('flame-2'),
    document.getElementById('flame-3')
  ];

  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetId) {
    navTabs.forEach(t => {
      if (t.getAttribute('data-target') === targetId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    tabPanes.forEach(p => {
      if (p.id === targetId) {
        p.classList.remove('hidden');
        p.classList.add('active');
      } else {
        p.classList.remove('active');
        p.classList.add('hidden');
      }
    });
  }

  function updateProgress(percent, message) {
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (statusText) statusText.textContent = message;
  }

  // Step 1: Countdown and shake box automatically
  let autoTimer1 = setTimeout(() => {
    updateProgress(15, '🎁 Mempersiapkan kado untuk Mutia: 3...');
    if (autoCountdownText) autoCountdownText.textContent = 'Membuka otomatis dalam 3...';
    giftBox.classList.add('shake');
    playPopSound();
  }, 1000);

  let autoTimer2 = setTimeout(() => {
    updateProgress(30, '🎁 Membuka pita kado: 2...');
    if (autoCountdownText) autoCountdownText.textContent = 'Membuka otomatis dalam 2...';
    giftBox.classList.remove('shake');
    void giftBox.offsetWidth;
    giftBox.classList.add('shake');
    playPopSound();
  }, 2200);

  let autoTimer3 = setTimeout(() => {
    updateProgress(45, '🎁 Bersiap meledakkan cinta: 1...');
    if (autoCountdownText) autoCountdownText.textContent = 'Membuka otomatis dalam 1...';
    giftBox.classList.remove('shake');
    void giftBox.offsetWidth;
    giftBox.classList.add('shake');
    playPopSound();
  }, 3400);

  // Step 2: Unbox automatically!
  let autoTimer4 = setTimeout(() => {
    openGiftBox();
  }, 4400);

  function openGiftBox() {
    initAudioContext();
    startMusic();
    playPartyHornSound();
    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 160);

    giftBox.style.transform = 'scale(1.2) rotate(8deg)';
    giftBox.style.opacity = '0.5';

    updateProgress(60, '🎉 Kado Terbuka! Selamat Ulang Tahun Sayang! 👑');

    setTimeout(() => {
      sceneUnboxing.classList.remove('active');
      sceneUnboxing.classList.add('hidden');

      sceneParty.classList.remove('hidden');
      sceneParty.classList.add('active');

      launchConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 140);

      // Auto-step: Blow candles automatically after 4 seconds
      setTimeout(() => {
        autoBlowCandles();
      }, 4000);

    }, 600);
  }

  // Allow manual clicking anytime as well
  giftBox.addEventListener('click', () => {
    clearTimeout(autoTimer1);
    clearTimeout(autoTimer2);
    clearTimeout(autoTimer3);
    clearTimeout(autoTimer4);
    openGiftBox();
  });

  // Step 3: Blow candles automatically
  function autoBlowCandles() {
    updateProgress(75, '🎂 Meniup lilin & memanjatkan doa terbaik... 💨');
    playBlowSound();
    flames.forEach(f => f.classList.add('blown-out'));

    btnBlowCandles.innerHTML = '<span class="btn-emoji">🔥</span> Nyalakan Lilin Lagi';
    candleStatus.innerHTML = '🎉 <strong>Horeee!</strong> Lilin padam! Semua doa terbaik Juska & Mutia terkabul! Aamiin 🤲❤️';

    setTimeout(() => {
      playPartyHornSound();
      launchConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 150);
    }, 300);

    // Auto-step: Auto-switch through tabs to show Mutia everything!
    setTimeout(() => {
      updateProgress(82, '📸 Menampilkan Galeri Foto Mutia Tercantik...');
      switchTab('tab-gallery');
    }, 3500);

    setTimeout(() => {
      updateProgress(88, '💌 Membuka Surat Cinta Penuh Ketulusan dari Juska...');
      switchTab('tab-letter');
    }, 9000);

    setTimeout(() => {
      updateProgress(94, '🎟️ Menyiapkan Hadiah Kupon Pacar Spesial...');
      switchTab('tab-coupons');
    }, 15000);

    setTimeout(() => {
      updateProgress(100, '💖 Mengukur Cinta Juska (Infinite ♾️%)...');
      switchTab('tab-meter');
      autoTriggerLoveMeter();
    }, 20000);
  }

  // Interactive Candle Toggle (Clicking manually)
  let areCandlesLit = true;
  function toggleCandles() {
    initAudioContext();
    if (areCandlesLit) {
      playBlowSound();
      flames.forEach(f => f.classList.add('blown-out'));
      areCandlesLit = false;
      btnBlowCandles.innerHTML = '<span class="btn-emoji">🔥</span> Nyalakan Lilin Lagi';
      candleStatus.innerHTML = '🎉 <strong>Horeee!</strong> Lilin ditiup! Harapan Mutia pasti terkabul! Aamiin~ 🤲✨';
      setTimeout(() => {
        playPartyHornSound();
        launchConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);
      }, 300);
    } else {
      playPopSound();
      flames.forEach(f => f.classList.remove('blown-out'));
      areCandlesLit = true;
      btnBlowCandles.innerHTML = '<span class="btn-emoji">💨</span> Tiup Lilinnya Dong!';
      candleStatus.textContent = 'Lilin menyala kembali! Make a wish lalu tiup lagi sayang!';
    }
  }

  btnBlowCandles.addEventListener('click', toggleCandles);
  document.getElementById('cake-container').addEventListener('click', toggleCandles);

  // Manual Tab Clicking
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      initAudioContext();
      playPopSound();
      const targetId = tab.getAttribute('data-target');
      switchTab(targetId);
    });
  });

  // ==========================================================================
  // 4. BONEKA ANIMASI YANG JALAN-JALAN (WALKING ANIMATED DOLLS)
  // ==========================================================================
  const dollBear = document.getElementById('doll-bear');
  const dollBunny = document.getElementById('doll-bunny');
  const floatingPet = document.getElementById('floating-pet');
  const dollBearSpeech = document.getElementById('doll-bear-speech');
  const dollBunnySpeech = document.getElementById('doll-bunny-speech');

  const bearQuotes = [
    "Sayang Mutia! ❤️",
    "Bidadari Juska! ✨",
    "Makin glowing! 🌸",
    "Jalan-jalan yuk! 🎡",
    "Love you 3000! 💖",
    "Peluk jauh! 🫂"
  ];

  const bunnyQuotes = [
    "Happy Birthday! 🎂",
    "Cantik banget! 👑",
    "Sehat selalu ya! 🤲",
    "Traktir seblak! 😋",
    "Senyum terus! 🥰",
    "Wish you all the best! ✨"
  ];

  // Rotate speech text periodically
  setInterval(() => {
    if (dollBearSpeech) {
      const q = bearQuotes[Math.floor(Math.random() * bearQuotes.length)];
      dollBearSpeech.textContent = `"${q}"`;
    }
    if (dollBunnySpeech) {
      const q = bunnyQuotes[Math.floor(Math.random() * bunnyQuotes.length)];
      dollBunnySpeech.textContent = `"${q}"`;
    }
  }, 4000);

  // Click on Walking Dolls to make them jump with hearts!
  function triggerDollJump(dollEl, speechEl, customMsg) {
    initAudioContext();
    playPopSound();

    dollEl.classList.remove('jump');
    void dollEl.offsetWidth;
    dollEl.classList.add('jump');

    if (speechEl && customMsg) {
      speechEl.textContent = customMsg;
    }

    // Spawn heart particles
    const rect = dollEl.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top, 25);

    setTimeout(() => {
      dollEl.classList.remove('jump');
    }, 600);
  }

  if (dollBear) {
    dollBear.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerDollJump(dollBear, dollBearSpeech, "Juska sayang Mutia selamanya! ❤️");
    });
  }

  if (dollBunny) {
    dollBunny.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerDollJump(dollBunny, dollBunnySpeech, "Mutia bidadari paling manis! 🌸");
    });
  }

  if (floatingPet) {
    floatingPet.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      playPartyHornSound();
      launchConfetti(window.innerWidth / 2, window.innerHeight * 0.25, 40);
    });
  }

  // ==========================================================================
  // 5. TAB: KUPON CINTA SPESIAL
  // ==========================================================================
  const couponButtons = document.querySelectorAll('.claim-btn');
  const couponAlert = document.getElementById('coupon-alert');

  couponButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      playPopSound();

      const card = btn.closest('.coupon-card');
      const couponName = card.getAttribute('data-coupon');

      card.classList.add('claimed');
      btn.textContent = '✅ Berhasil Diklaim!';
      btn.style.background = '#2ec4b6';

      couponAlert.innerHTML = `
        🎉 <strong>HOREEE!</strong> Mutia resmi mengklaim <strong>${couponName}</strong>!<br>
        Tunjukkan ini ke Juska ya sayang, langsung cair tanpa syarat! 🥰💍
      `;
      couponAlert.classList.remove('hidden');

      const rect = card.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    });
  });

  // ==========================================================================
  // 6. TAB: BALON DOA
  // ==========================================================================
  const balloonGrid = document.getElementById('balloons-grid');
  const balloonMsgBox = document.getElementById('balloon-message-box');
  const msgIcon = document.getElementById('msg-icon');
  const msgTitle = document.getElementById('msg-title');
  const msgText = document.getElementById('msg-text');
  const btnCloseMsg = document.getElementById('btn-close-msg');

  const balloonData = [
    {
      color: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
      emoji: '🌸',
      title: 'Doa Kecantikan & Aura Positif',
      text: 'Semoga Mutia selalu cantik luar dalam, auranya makin memikat, dan hatinya selalu dipenuhi kedamaian!'
    },
    {
      color: 'linear-gradient(135deg, #ffbe0b, #fb5607)',
      emoji: '💸',
      title: 'Doa Rezeki Berlimpah',
      text: 'Semoga rezeki halal berkah mengalir tiada henti! Segala impian dan wishlist Mutia terpenuhi satu per satu!'
    },
    {
      color: 'linear-gradient(135deg, #3a86ff, #0077b6)',
      emoji: '🚀',
      title: 'Doa Langkah Masa Depan',
      text: 'Semoga segala urusan karir, pendidikan, dan cita-cita kita berdua dilancarkan tanpa hambatan!'
    },
    {
      color: 'linear-gradient(135deg, #8338ec, #5a189a)',
      emoji: '💍',
      title: 'Janji Setia Juska',
      text: 'Juska berjanji akan selalu ada di samping Mutia, menemani di saat senang maupun sulit, selamanya! ❤️'
    },
    {
      color: 'linear-gradient(135deg, #06d6a0, #0096c7)',
      emoji: '💪',
      title: 'Doa Sehat & Bahagia Selalu',
      text: 'Semoga selalu sehat jasmani rohani, dijauhkan dari overthinking sebelum tidur, dan selalu tersenyum manis!'
    },
    {
      color: 'linear-gradient(135deg, #ff70a6, #ff9770)',
      emoji: '🍕',
      title: 'Kupon Traktir Spesial',
      text: 'Juska siap traktir makanan favorit Mutia hari ini! Mau makan apa sayang? Semua ditraktir pacarmu! 😋'
    }
  ];

  function createBalloons() {
    balloonGrid.innerHTML = '';
    balloonData.forEach(item => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon-item';
      balloon.style.background = item.color;
      balloon.innerHTML = `
        <span>${item.emoji}</span>
        <div class="balloon-string"></div>
      `;

      balloon.addEventListener('click', () => {
        if (balloon.classList.contains('popped')) return;

        initAudioContext();
        playBalloonBurstSound();
        balloon.classList.add('popped');

        const rect = balloon.getBoundingClientRect();
        launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

        msgIcon.textContent = item.emoji;
        msgTitle.textContent = item.title;
        msgText.textContent = item.text;
        balloonMsgBox.classList.remove('hidden');

        setTimeout(() => {
          balloon.style.visibility = 'hidden';
        }, 300);
      });

      balloonGrid.appendChild(balloon);
    });
  }

  createBalloons();

  btnCloseMsg.addEventListener('click', () => {
    playPopSound();
    balloonMsgBox.classList.add('hidden');
  });

  // ==========================================================================
  // 7. TAB: LOVE METER
  // ==========================================================================
  const btnMeasureLove = document.getElementById('btn-measure-love');
  const meterFill = document.getElementById('meter-fill');
  const meterPercent = document.getElementById('meter-percent');
  const meterResultMsg = document.getElementById('meter-result-msg');

  function autoTriggerLoveMeter() {
    initAudioContext();
    meterFill.style.width = '100%';
    meterPercent.textContent = '9999999% ♾️';

    playPartyHornSound();
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 90);

    meterResultMsg.innerHTML = `
      💖 <strong>HASIL PENGUKURAN: OVERFLOW ERROR! 📈</strong><br>
      Kadar rasa sayang Juska ke Mutia tidak bisa diukur dengan angka, karena cintaku ke kamu itu <strong>TAK TERBATAS (INFINITY ♾️)</strong>! Selalu dan selamanya sayang! 🥰🌹
    `;
    meterResultMsg.classList.remove('hidden');
  }

  btnMeasureLove.addEventListener('click', () => {
    autoTriggerLoveMeter();
  });

  // ==========================================================================
  // 8. EXTRA BUTTONS & LOVE COUNTER
  // ==========================================================================
  const btnPartyHorn = document.getElementById('btn-party-horn');
  btnPartyHorn.addEventListener('click', () => {
    initAudioContext();
    playPartyHornSound();
    launchConfetti(Math.random() * window.innerWidth, window.innerHeight * 0.35, 80);
  });

  const btnSendLove = document.getElementById('btn-send-love');
  const loveCountEl = document.getElementById('love-count');
  let loveCount = 1000;

  btnSendLove.addEventListener('click', (e) => {
    initAudioContext();
    playPopSound();
    loveCount += 1;
    loveCountEl.textContent = loveCount;

    const heart = document.createElement('div');
    heart.textContent = ['💖', '❤️', '💕', '🥰', '🌹'][Math.floor(Math.random() * 5)];
    heart.style.position = 'fixed';
    heart.style.left = `${e.clientX || window.innerWidth / 2}px`;
    heart.style.top = `${e.clientY || window.innerHeight / 2}px`;
    heart.style.fontSize = '2.2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - 0.5) * 120}px, -160px) scale(1.6)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 1200);
  });

  // Replay Button: Reset from Beginning
  const btnReplay = document.getElementById('btn-replay');
  btnReplay.addEventListener('click', () => {
    playPopSound();
    giftBox.style.transform = '';
    giftBox.style.opacity = '1';

    sceneParty.classList.remove('active');
    sceneParty.classList.add('hidden');

    sceneUnboxing.classList.remove('hidden');
    sceneUnboxing.classList.add('active');

    createBalloons();
    balloonMsgBox.classList.add('hidden');

    updateProgress(5, '🎬 Memulai Ulang Kejutan Spesial untuk Mutia...');
    setTimeout(openGiftBox, 3500);
  });

  // Audio Toggles
  const btnMusic = document.getElementById('btn-music');
  const musicText = document.getElementById('music-text');
  const btnSoundFx = document.getElementById('btn-sound-fx');
  const fxText = document.getElementById('fx-text');

  btnMusic.addEventListener('click', () => {
    initAudioContext();
    musicMuted = !musicMuted;
    if (musicMuted) {
      stopMusic();
      musicText.textContent = 'Musik: Off';
      btnMusic.style.opacity = '0.6';
    } else {
      startMusic();
      musicText.textContent = 'Musik: On';
      btnMusic.style.opacity = '1';
    }
  });

  btnSoundFx.addEventListener('click', () => {
    initAudioContext();
    fxMuted = !fxMuted;
    if (fxMuted) {
      fxText.textContent = 'Suara: Off';
      btnSoundFx.style.opacity = '0.6';
    } else {
      fxText.textContent = 'Suara: On';
      btnSoundFx.style.opacity = '1';
      playPopSound();
    }
  });
});
