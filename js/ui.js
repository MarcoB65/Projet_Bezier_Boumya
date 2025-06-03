export function setupUI(gridContainer) {
  // Crea il rettangolo di overlay
  const overlayRect = document.createElement("div");
  overlayRect.style.position = "fixed";
  overlayRect.style.top = "0";
  overlayRect.style.left = "0";
  overlayRect.style.width = "100%";
  overlayRect.style.height = "100%";
  overlayRect.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  overlayRect.style.pointerEvents = "none";
  overlayRect.style.zIndex = "1";
  document.body.appendChild(overlayRect);

  // Funzione per aggiornare la posizione dell'overlay
  const updateOverlayPosition = () => {
    const rect = gridContainer.getBoundingClientRect();
    overlayRect.style.top = `${rect.top}px`;
    overlayRect.style.left = `${rect.left}px`;
    overlayRect.style.width = `${rect.width}px`;
    overlayRect.style.height = `${rect.height}px`;
  };

  // Crea il bottone per controllare la visibilità del rettangolo
  const toggleButton = document.createElement("button");
  toggleButton.innerHTML = "👁️";
  toggleButton.style.position = "fixed";
  toggleButton.style.top = "20px";
  toggleButton.style.right = "20px";
  toggleButton.style.zIndex = "10000";
  toggleButton.style.padding = "10px";
  toggleButton.style.borderRadius = "50%";
  toggleButton.style.border = "none";
  2;
  toggleButton.style.backgroundColor = "#4CAF50";
  toggleButton.style.color = "white";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.fontSize = "20px";
  document.body.appendChild(toggleButton);

  // Aggiorna la posizione iniziale
  updateOverlayPosition();

  // Aggiorna la posizione quando la finestra viene ridimensionata
  window.addEventListener("resize", updateOverlayPosition);

  // Gestisci il click sul bottone
  let isOverlayVisible = true;
  toggleButton.addEventListener("click", () => {
    isOverlayVisible = !isOverlayVisible;
    overlayRect.style.display = isOverlayVisible ? "block" : "none";
    toggleButton.innerHTML = isOverlayVisible ? "👁️" : "👁️‍🗨️";
    toggleButton.style.backgroundColor = isOverlayVisible
      ? "#4CAF50"
      : "#f44336";
  });

  return {
    toggleButton,
    overlayRect,
    updateOverlayPosition,
  };
}
