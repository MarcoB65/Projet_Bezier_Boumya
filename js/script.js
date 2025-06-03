import { BezierCurve } from "./bezierCurve.js";
import { setupUI } from "./ui.js";
import { scales } from "./scales.js";
import { createGrid, resetCell, activateCell } from "./grid.js";
import { AudioManager, rhythmPatterns } from "./audio.js";
import { VisualizationManager, typographicChars } from "./visualization.js";
import { ControlManager } from "./controls.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elementi dell'interfaccia
  const gridContainer = document.querySelector(".grid-container");
  const curves = []; // Array per tenere traccia di tutte le curve

  // Inizializza i manager
  const audioManager = new AudioManager();
  const visualizationManager = new VisualizationManager();
  const controlManager = new ControlManager();

  // Inizializza l'audio
  audioManager.initialize(scales.pentatonic);

  // Crea il wrapper per la griglia
  const gridWrapper = document.createElement("div");
  gridWrapper.className = "grid-wrapper";
  document.body.appendChild(gridWrapper);
  gridWrapper.appendChild(gridContainer);

  // Mostra gli elementi necessari
  gridContainer.style.border = "1px solid #333";
  gridContainer.style.backgroundColor = "#000000";
  gridContainer.style.boxShadow = "0 2px 4px rgba(255,255,255,0.1)";

  // Nascondi il titolo se presente
  const title = document.querySelector("h1");
  if (title) {
    title.style.display = "none";
  }

  // Crea la griglia
  createGrid(gridContainer);

  // Modifica l'event listener per i tasti
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      curves.forEach((curve) => {
        curve.controlPointsMoving = !curve.controlPointsMoving;
      });
    } else if (event.code === "Digit1") {
      visualizationManager.setMode(1);
      const gridItems = document.querySelectorAll(".grid-item");
      gridItems.forEach((cell) => resetCell(cell));
    } else if (event.code === "Digit2") {
      visualizationManager.setMode(2);
      const gridItems = document.querySelectorAll(".grid-item");
      gridItems.forEach((cell) => resetCell(cell));
    } else if (event.code === "Digit3") {
      visualizationManager.setMode(3);
      const gridItems = document.querySelectorAll(".grid-item");
      gridItems.forEach((cell) => resetCell(cell));
    } else if (event.code === "ArrowUp") {
      event.preventDefault();
      curves.forEach((curve) => {
        curve.controlSpeed = Math.min(curve.controlSpeed + 0.2, 5);
      });
    } else if (event.code === "ArrowDown") {
      event.preventDefault();
      curves.forEach((curve) => {
        curve.controlSpeed = Math.max(curve.controlSpeed - 0.2, 0.5);
      });
    }
  });

  // Animation loop per tutte le curve
  function animate() {
    curves.forEach((curve) => {
      curve.update();
    });
    requestAnimationFrame(animate);
  }

  // Crea le tre curve iniziali
  const initialCurve = new BezierCurve(
    audioManager,
    visualizationManager,
    controlManager,
    gridContainer
  );
  initialCurve.id = 0;
  curves.push(initialCurve);

  const secondCurve = new BezierCurve(
    audioManager,
    visualizationManager,
    controlManager,
    gridContainer
  );
  secondCurve.id = 1;
  curves.push(secondCurve);

  const thirdCurve = new BezierCurve(
    audioManager,
    visualizationManager,
    controlManager,
    gridContainer
  );
  thirdCurve.id = 2;
  curves.push(thirdCurve);

  // Avvia l'animazione
  animate();

  // Gestione visibilità della finestra dei comandi
  const commandHelp = document.getElementById("commandHelp");
  let helpTimeout;
  function showCommandHelp() {
    if (commandHelp) {
      commandHelp.style.opacity = 1;
      commandHelp.style.pointerEvents = "auto";
    }
    clearTimeout(helpTimeout);
    helpTimeout = setTimeout(() => {
      if (commandHelp) {
        commandHelp.style.opacity = 0;
        commandHelp.style.pointerEvents = "none";
      }
    }, 3000);
  }
  if (commandHelp) {
    commandHelp.style.transition = "opacity 0.5s";
    commandHelp.style.opacity = 1;
  }
  document.addEventListener("mousemove", showCommandHelp);
});
