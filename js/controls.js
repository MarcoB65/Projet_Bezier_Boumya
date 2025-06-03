export class ControlManager {
  constructor() {
    this.lastMouseMoveTime = Date.now();
    this.controlsVisible = true;
    this.mouseTimeout = null;
  }

  handleMouseMove() {
    this.lastMouseMoveTime = Date.now();
    if (!this.controlsVisible) {
      this.controlsVisible = true;
      // Show all control elements including lines, trail and complete curve
      document
        .querySelectorAll(
          ".control-point, .control-lines, path, .bezier-point, svg path"
        )
        .forEach((elem) => {
          elem.style.opacity = "1";
          elem.style.transition = "opacity 0.3s ease";
        });
    }
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    this.mouseTimeout = setTimeout(() => {
      if (Date.now() - this.lastMouseMoveTime >= 3000) {
        this.controlsVisible = false;
        // Hide all control elements including lines, trail and complete curve
        document
          .querySelectorAll(
            ".control-point, .control-lines, path, .bezier-point, svg path"
          )
          .forEach((elem) => {
            elem.style.opacity = "0";
            elem.style.transition = "opacity 0.3s ease";
          });
      }
    }, 3000);
  }

  updateControlPoint(
    state,
    point,
    element,
    gridLeft,
    gridTop,
    gridWidth,
    gridHeight,
    controlSpeed
  ) {
    // Update position based on current side
    switch (state.side) {
      case "top":
        state.position += controlSpeed;
        if (state.position > gridWidth) {
          state.side = "right";
          state.position = 0;
        }
        point.x = gridLeft + state.position;
        point.y = gridTop;
        break;
      case "right":
        state.position += controlSpeed;
        if (state.position > gridHeight) {
          state.side = "bottom";
          state.position = 0;
        }
        point.x = gridLeft + gridWidth;
        point.y = gridTop + state.position;
        break;
      case "bottom":
        state.position += controlSpeed;
        if (state.position > gridWidth) {
          state.side = "left";
          state.position = 0;
        }
        point.x = gridLeft + gridWidth - state.position;
        point.y = gridTop + gridHeight;
        break;
      case "left":
        state.position += controlSpeed;
        if (state.position > gridHeight) {
          state.side = "top";
          state.position = 0;
        }
        point.x = gridLeft;
        point.y = gridTop + gridHeight - state.position;
        break;
    }

    // Update element position
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;
  }

  setupControlPointDrag(
    element,
    point,
    gridLeft,
    gridTop,
    gridWidth,
    gridHeight,
    updatePath
  ) {
    let isDragging = false;
    let startX, startY;
    let startPointX, startPointY;

    element.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPointX = point.x;
      startPointY = point.y;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      point.x = Math.max(
        gridLeft,
        Math.min(gridLeft + gridWidth, startPointX + dx)
      );
      point.y = Math.max(
        gridTop,
        Math.min(gridTop + gridHeight, startPointY + dy)
      );

      element.style.left = `${point.x}px`;
      element.style.top = `${point.y}px`;

      updatePath();
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
}
