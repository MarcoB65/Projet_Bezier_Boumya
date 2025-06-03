export function createGrid(gridContainer) {
  // Imposta il layout della griglia a 25x42
  gridContainer.style.gridTemplateColumns = "repeat(42, 1fr)";
  gridContainer.style.gridTemplateRows = "repeat(25, 1fr)";
  gridContainer.style.width = "100vw";
  gridContainer.style.height = "100vh";
  gridContainer.style.aspectRatio = "42/25"; // Mantiene il rapporto 42:25 per la griglia

  // Crea 1050 quadrati (25x42)
  for (let i = 0; i < 1050; i++) {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.dataset.index = i;
    gridItem.dataset.division = "0";

    // Stile per la cella
    gridItem.style.display = "grid";
    gridItem.style.gridTemplateColumns = "1fr";
    gridItem.style.gridTemplateRows = "1fr";
    gridItem.style.backgroundColor = "#000000";
    gridItem.style.transition = "all 0.3s ease";
    gridItem.style.position = "relative";
    gridItem.style.overflow = "hidden";
    gridItem.style.border = "none";
    gridItem.style.boxShadow = "none";
    gridItem.style.outline = "none";
    gridItem.style.width = "100%";
    gridItem.style.height = "100%";
    gridItem.style.aspectRatio = "1/1"; // Forza le celle ad essere quadrate

    gridContainer.appendChild(gridItem);
  }
}

export function resetCell(cell) {
  cell.innerHTML = "";
  cell.style.backgroundColor = "#000000";
  cell.style.borderRadius = "0";
  cell.style.color = "";
  cell.style.fontSize = "";
  cell.style.fontWeight = "";
  cell.style.display = "";
  cell.style.alignItems = "";
  cell.style.justifyContent = "";
  cell.style.textShadow = "";
  cell.style.letterSpacing = "";
  cell.style.lineHeight = "";
  cell.style.boxShadow = "";
  cell.style.opacity = "1";
  cell.style.transform = "";
  cell.dataset.isActive = "false";
}

export function activateCell(cell, visualizationMode, typographicChars) {
  // Resetta lo stile precedente
  resetCell(cell);
  cell.style.transition = "all 0.3s ease";

  if (visualizationMode === 2) {
    // Modalità tipografica
    const randomChar =
      typographicChars[Math.floor(Math.random() * typographicChars.length)];
    cell.innerHTML = randomChar;
    cell.style.fontSize = "8em";
    cell.style.fontWeight = "900";
    cell.style.color = "#FFFFFF";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.backgroundColor = "transparent";
    cell.style.borderRadius = "0";
    cell.style.textShadow = "0 0 15px rgba(255, 255, 255, 0.7)";
    cell.style.letterSpacing = "0.1em";
    cell.style.lineHeight = "1";
  } else if (visualizationMode === 3) {
    // Modalità mista monocolore
    const isTypographic = Math.random() > 0.5; // 50% di probabilità per ogni tipo

    if (isTypographic) {
      // Elemento tipografico
      const randomChar =
        typographicChars[Math.floor(Math.random() * typographicChars.length)];
      cell.innerHTML = randomChar;
      cell.style.fontSize = "8em";
      cell.style.fontWeight = "900";
      cell.style.color = "#808080";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.backgroundColor = "transparent";
      cell.style.borderRadius = "0";
      cell.style.letterSpacing = "0.1em";
      cell.style.lineHeight = "1";
    } else {
      // Elemento geometrico
      const isCircle = Math.random() > 0.5;
      cell.style.backgroundColor = "#808080";
      cell.style.borderRadius = isCircle ? "50%" : "0";
      cell.style.boxShadow = "0 0 15px rgba(128, 128, 128, 0.7)";
    }
  } else {
    // Modalità standard (quadrati e cerchi)
    const randomCellStyles = [
      // Quadrato pieno che occupa tutta la cella
      (cell) => {
        const colors = ["#808080", "#FFFFFF", "#0000FF"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = color;
        cell.innerHTML = "";
        cell.style.borderRadius = "0";
      },
      // Cerchio pieno che occupa tutta la cella
      (cell) => {
        const colors = ["#808080", "#FFFFFF", "#0000FF"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        cell.innerHTML = "";
        cell.style.backgroundColor = color;
        cell.style.borderRadius = "50%";
      },
    ];
    const styleFn =
      randomCellStyles[Math.floor(Math.random() * randomCellStyles.length)];
    styleFn(cell);
  }

  cell.dataset.isActive = "true";
  cell.dataset.originalColor = cell.style.backgroundColor;

  // Aumenta la durata della scia a 2 secondi
  setTimeout(() => {
    if (visualizationMode === 2) {
      resetCell(cell);
    } else if (visualizationMode === 3) {
      // Reset completo per la modalità 3
      resetCell(cell);
      cell.style.backgroundColor = "transparent";
      cell.style.boxShadow = "";
      cell.style.textShadow = "";
    } else {
      cell.style.backgroundColor = "#000000";
      cell.style.borderRadius = "0";
      cell.dataset.isActive = "false";
    }
  }, 2000);
}
