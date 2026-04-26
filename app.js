// Step data
const STEPS = [
  {
    id: 1, code: "START", title: "Start", emoji: "🏁", points: 0,
    message: "Welcome to the adventure! Scan the QR codes, follow the clues, and collect points. Let's see if you can reach the end!",
    clue: "Keep going straight ahead to find your first challenge."
  },
  {
    id: 2, code: "LIB42", title: "To the Library", emoji: "✨", points: 5,
    message: "Great start! Now, sharpen your mind.",
    clue: "Take a right turn and find the library entrance."
  },
  {
    id: 3, code: "UP88", title: "The Climb", emoji: "🚀", points: 5,
    message: "You are doing great. Time to change levels!",
    clue: "Turn left and go up the stairs to the next level."
  },
  {
    id: 4, code: "SCI7", title: "Science Corridor", emoji: "🧪", points: 5,
    message: "I smell an experiment in the air!",
    clue: "Make a sharp right turn, walk down the corridor, and find the science lab."
  },
  {
    id: 5, code: "BOSS9", title: "Strategic Point", emoji: "🎓", points: 5,
    message: "Now, be quiet! You are near the authority.",
    clue: "Find the headmaster's office, which is directly opposite the lab."
  },
  {
    id: 6, code: "BOOK3", title: "The Secret Shelf", emoji: "🔍", points: 5,
    message: "Almost there! Look closely at your surroundings.",
    clue: "Step into the next room and spot the QR code hidden on the shelf."
  },
  {
    id: 7, code: "DOWN5", title: "Descent Time", emoji: "🏃", points: 5,
    message: "Speed up! The prize is getting closer.",
    clue: "Turn left, go along the corridor, and head down the stairs."
  },
  {
    id: 8, code: "FOOD1", title: "The Final Target", emoji: "🍔", points: 5,
    message: "Hungry for victory? The finish line is near!",
    clue: "Turn left, keep going straight, and find the canteen in the middle of the hall to claim your prize."
  },
  {
    id: 9, code: "WIN99", title: "The Finish Line", emoji: "🎉", points: 0, isFinish: true,
    message: "CONGRATULATIONS!\nYou've completed the quest and collected 40 points! Show this screen to the canteen staff to get your reward!",
    clue: null
  }
];

function getStep() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('step')) return null;
  const s = parseInt(params.get('step'));
  return Math.max(1, Math.min(9, s));
}

// State management
function getUnlockedSteps() {
  const saved = localStorage.getItem('qr_adventure_steps');
  return saved ? JSON.parse(saved) : [1]; // Step 1 is always unlocked
}

function unlockStep(stepId) {
  const unlocked = getUnlockedSteps();
  if (!unlocked.includes(stepId)) {
    unlocked.push(stepId);
    localStorage.setItem('qr_adventure_steps', JSON.stringify(unlocked));
  }
}

function calcTotalPoints() {
  const unlocked = getUnlockedSteps();
  let total = 0;
  for (const s of STEPS) {
    if (unlocked.includes(s.id)) {
      total += s.points;
    }
  }
  return total;
}

function renderCheatScreen(attemptedStep) {
  const container = document.getElementById('game');
  container.innerHTML = `
    <div class="card">
      <div class="step-emoji">🛑</div>
      <div class="step-title">Wait a minute!</div>
      <div class="step-number">You skipped a step!</div>
      <p class="message" style="color:#f87171">You cannot access Step ${attemptedStep} because you haven't found the previous QR codes yet.</p>
      <div class="clue" style="background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3)">
        Go back and find the previous clues to continue your adventure!
      </div>
      <div style="margin-top:1.5rem">
        <button onclick="window.location.href='?step=1'" style="padding:.8rem 2rem;border-radius:12px;border:none;background:linear-gradient(135deg,#7c5cfc,#e040fb);color:#fff;font-weight:bold;cursor:pointer">Restart / Go to Step 1</button>
      </div>
    </div>
  `;
}

function renderMainMenu() {
  const container = document.getElementById('game');
  container.innerHTML = `
    <div class="card">
      <div class="step-emoji">🗺️</div>
      <div class="step-title">QR Adventure Quest</div>
      <p class="message">Welcome to the adventure! Scan the QR codes around the school, follow clues, and collect points!</p>
      
      <div style="margin-top:2rem; display:flex; flex-direction:column; gap:1rem;">
        <button onclick="window.location.href='?step=1'" style="padding:1rem; border-radius:12px; border:none; background:linear-gradient(135deg,#34d399,#06b6d4); color:#fff; font-size:1.1rem; font-weight:bold; cursor:pointer; box-shadow:0 4px 15px rgba(52,211,153,0.3)">🚀 Start Game</button>
        <button onclick="resetProgress()" style="padding:1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#fff; font-size:1rem; cursor:pointer;">🔄 Reset Progress</button>
      </div>
    </div>
  `;
}

function resetProgress() {
  if(confirm("Are you sure you want to reset all your points and progress?")) {
    localStorage.removeItem('qr_adventure_steps');
    alert("Progress reset successfully!");
    window.location.href = '?';
  }
}

function renderStep() {
  const stepId = getStep();
  
  if (stepId === null) {
    renderMainMenu();
    return;
  }
  
  const step = STEPS.find(s => s.id === stepId);
  if (!step) return;

  const unlocked = getUnlockedSteps();

  // Anti-cheat: Check if they are allowed to be here
  // They can only be here if they have unlocked the PREVIOUS step, or if they already unlocked THIS step
  if (stepId > 1 && !unlocked.includes(stepId - 1) && !unlocked.includes(stepId)) {
    renderCheatScreen(stepId);
    return;
  }

  // Valid step, unlock it
  unlockStep(stepId);
  const currentUnlocked = getUnlockedSteps();
  
  // If they reached step 9, they get max points
  const totalPoints = currentUnlocked.includes(9) ? 40 : calcTotalPoints();
  
  // Progress is based on max unlocked step
  const maxUnlocked = Math.max(...currentUnlocked);
  const progress = (maxUnlocked / STEPS.length) * 100;
  
  const isFinish = step.isFinish;

  const container = document.getElementById('game');
  container.innerHTML = `
    <div class="card${isFinish ? ' finish' : ''}">
      <div class="progress-wrap">
        <div class="progress-label">
          <span>Step ${stepId} / ${STEPS.length}</span>
          <span>${Math.round(progress)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
      </div>

      <div class="step-emoji">${step.emoji}</div>
      <div class="step-title">${isFinish ? '🎉 ' + step.title + ' 🎉' : step.title}</div>
      <div class="step-number">Checkpoint ${stepId}</div>

      <div class="score-display">
        <span class="icon">⭐</span>
        <span>${totalPoints} Points</span>
      </div>

      <p class="message">${step.message}</p>

      ${step.clue ? `<div class="clue">📍 ${step.clue}</div>` : ''}
      ${isFinish ? `<div class="finish-reward">🏆 Show this screen to the staff to claim your reward! 🏆</div>` : ''}
      
      ${!isFinish ? `
        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1); text-align:center;">
          <p style="color:#c4b5fd;font-size:.9rem;margin-bottom:.8rem">If the camera doesn't read, enter the next code:</p>
          <div style="display:flex;gap:.5rem;justify-content:center;align-items:center">
            <input id="manualNext" type="text" placeholder="CODE"
              style="padding:.6rem;border-radius:10px;border:1px solid #7c5cfc;background:rgba(255,255,255,.08);color:#fff;font-size:1.1rem;width:100px;text-align:center;-webkit-appearance:none;text-transform:uppercase;">
            <button class="btn-success" onclick="goManualStep()" style="padding:.6rem 1.2rem;font-size:.95rem; border-radius:10px; border:none; background: linear-gradient(135deg, #34d399, #06b6d4); color: white; font-weight: bold; cursor: pointer;">Go</button>
          </div>
        </div>
      ` : ''}

      <div class="nav-buttons" style="display:flex; justify-content:center; margin-top:1.5rem;">
        <button onclick="window.location.href='?'" style="padding:.8rem 2rem; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#fff; font-weight:bold; cursor:pointer;">🏠 Main Menu</button>
      </div>
    </div>
  `;

  // Trigger animations
  const confetti = new ConfettiSystem('confetti-canvas');

  if (step.points > 0) {
    // Show points popup with confetti burst
    const popup = document.getElementById('points-popup');
    popup.textContent = `${step.emoji} +${step.points} Points! ${step.emoji}`;
    popup.classList.add('show');
    confetti.burst(100);

    setTimeout(() => {
      popup.classList.remove('show');
    }, 2800);
  }

  if (isFinish) {
    // Big celebration for finish
    confetti.burst(150);
    confetti.rain(200, 4000);
    setTimeout(() => confetti.burst(100), 1500);
    setTimeout(() => confetti.burst(80), 3000);
  }
}

document.addEventListener('DOMContentLoaded', renderStep);

function goManualStep() {
  const codeInput = document.getElementById('manualNext').value.trim().toUpperCase();
  const matchedStep = STEPS.find(s => s.code === codeInput);
  
  if (matchedStep) {
    // Modify URL parameter and reload
    const url = new URL(window.location);
    url.searchParams.set('step', matchedStep.id);
    window.location.href = url.toString();
  } else {
    alert("Invalid code entered! Please check the code on the wall.");
  }
}
