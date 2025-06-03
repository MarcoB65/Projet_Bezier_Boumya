import { scales } from "./scales.js";
import { typographicChars } from "./visualization.js";
import { activateCell } from "./grid.js";

export class BezierCurve {
  constructor(
    audioManager,
    visualizationManager,
    controlManager,
    gridContainer
  ) {
    this.id = 0;
    this.controlSpeed = 2;
    this.curveSpeed = 0.001;
    this.controlPointsMoving = true;
    this.t = 0;
    this.speed = this.curveSpeed * this.controlSpeed;
    this.lastPoint = null;
    this.lastHitSquare = null;
    this.color = this.getRandomColor();

    // Store references to managers
    this.audioManager = audioManager;
    this.visualizationManager = visualizationManager;
    this.controlManager = controlManager;
    this.gridContainer = gridContainer;

    // Get grid dimensions
    const gridRect = gridContainer.getBoundingClientRect();
    this.gridWidth = gridRect.width;
    this.gridHeight = gridRect.height;
    this.gridLeft = gridRect.left;
    this.gridTop = gridRect.top;

    // Create audio components
    this.synth = this.audioManager.createSynth();
    this.filter = this.audioManager.createFilter();
    this.delay = this.audioManager.createDelay();

    // Connect audio components
    this.synth.connect(this.filter);
    this.filter.connect(this.delay);

    // Initialize control points
    this.initializeControlPoints();

    // Create visual elements
    this.createVisualElements();

    // Setup mouse movement tracking
    document.addEventListener("mousemove", () =>
      this.controlManager.handleMouseMove()
    );
  }

  initializeControlPoints() {
    // Generate completely random positions for main control points
    const randomSide1 = Math.floor(Math.random() * 4);
    const randomSide2 = (randomSide1 + 2) % 4;

    // Generate random positions with some randomness in the position
    this.points = [
      this.getRandomPointOnSide(randomSide1),
      this.getRandomPointOnSide(randomSide2),
    ];

    // Initialize control states with random positions
    this.controlStates = [
      {
        side: ["top", "right", "bottom", "left"][randomSide1],
        position:
          this.points[0].position *
          (randomSide1 % 2 === 0 ? this.gridWidth : this.gridHeight),
      },
      {
        side: ["top", "right", "bottom", "left"][randomSide2],
        position:
          this.points[1].position *
          (randomSide2 % 2 === 0 ? this.gridWidth : this.gridHeight),
      },
    ];

    // Generate completely random intermediate points
    this.intermediatePoints = [
      {
        x: this.gridLeft + Math.random() * this.gridWidth,
        y: this.gridTop + Math.random() * this.gridHeight,
      },
      {
        x: this.gridLeft + Math.random() * this.gridWidth,
        y: this.gridTop + Math.random() * this.gridHeight,
      },
    ];
  }

  createVisualElements() {
    // Create moving point
    this.element = document.createElement("div");
    this.element.className = "bezier-point";
    this.element.style.backgroundColor = "#FFFFFF";
    this.element.style.width = "100px";
    this.element.style.height = "100px";
    this.element.style.borderRadius = "50%";
    this.element.style.position = "absolute";
    this.element.style.transform = "translate(-50%, -50%)";
    this.element.style.opacity = "1";
    this.element.style.boxShadow = "0 0 20px #FFFFFF";
    document.body.appendChild(this.element);

    // Create SVG for curve
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";
    this.svg.style.width = "100%";
    this.svg.style.height = "100%";
    this.svg.style.pointerEvents = "none";
    document.body.appendChild(this.svg);

    // Create complete Bezier curve path
    this.completeCurvePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.completeCurvePath.setAttribute("fill", "none");
    this.completeCurvePath.setAttribute("stroke", "#FFFFFF");
    this.completeCurvePath.setAttribute("stroke-width", "4");
    this.completeCurvePath.setAttribute("stroke-dasharray", "10, 5");
    this.completeCurvePath.style.opacity = "0.5";
    this.svg.appendChild(this.completeCurvePath);

    // Create control points
    this.controlElements = this.points.map((point, index) => {
      const elem = this.visualizationManager.createControlPoint(true);
      elem.style.backgroundColor = "#FFFFFF";
      elem.style.left = `${point.x}px`;
      elem.style.top = `${point.y}px`;
      document.body.appendChild(elem);
      return elem;
    });

    // Create intermediate points
    this.intermediateElements = this.intermediatePoints.map((point, index) => {
      const elem = this.visualizationManager.createControlPoint(false);
      elem.style.backgroundColor = "#FFFFFF";
      elem.style.left = `${point.x}px`;
      elem.style.top = `${point.y}px`;
      document.body.appendChild(elem);
      return elem;
    });

    // Create control lines SVG
    this.controlLinesSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.controlLinesSvg.style.position = "absolute";
    this.controlLinesSvg.style.top = "0";
    this.controlLinesSvg.style.left = "0";
    this.controlLinesSvg.style.width = "100%";
    this.controlLinesSvg.style.height = "100%";
    this.controlLinesSvg.style.pointerEvents = "none";
    document.body.appendChild(this.controlLinesSvg);

    // Create control lines path
    this.controlLinesPath = this.visualizationManager.createControlLinesPath();
    this.controlLinesPath.setAttribute("stroke", "#FFFFFF");
    this.controlLinesPath.setAttribute("stroke-width", "2");
    this.controlLinesSvg.appendChild(this.controlLinesPath);

    // Setup drag functionality for intermediate points
    this.intermediateElements.forEach((elem, index) => {
      this.controlManager.setupControlPointDrag(
        elem,
        this.intermediatePoints[index],
        this.gridLeft,
        this.gridTop,
        this.gridWidth,
        this.gridHeight,
        () => this.updatePath()
      );
    });

    // Draw initial complete curve
    this.updateCompleteCurve();
  }

  getRandomPointOnSide(side) {
    const randomPosition = Math.random();
    switch (side) {
      case 0: // top
        return {
          x: this.gridLeft + randomPosition * this.gridWidth,
          y: this.gridTop,
          position: randomPosition,
        };
      case 1: // right
        return {
          x: this.gridLeft + this.gridWidth,
          y: this.gridTop + randomPosition * this.gridHeight,
          position: randomPosition,
        };
      case 2: // bottom
        return {
          x: this.gridLeft + randomPosition * this.gridWidth,
          y: this.gridTop + this.gridHeight,
          position: randomPosition,
        };
      case 3: // left
        return {
          x: this.gridLeft,
          y: this.gridTop + randomPosition * this.gridHeight,
          position: randomPosition,
        };
    }
  }

  calculatePoint(t) {
    const points = [this.points[0], ...this.intermediatePoints, this.points[1]];
    return this.deCasteljau(points, t);
  }

  deCasteljau(points, t) {
    if (points.length === 1) return points[0];

    const newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y,
      });
    }
    return this.deCasteljau(newPoints, t);
  }

  updateCompleteCurve() {
    const points = [this.points[0], ...this.intermediatePoints, this.points[1]];
    let d = `M ${points[0].x} ${points[0].y}`;

    // Generate points along the complete curve
    for (let t = 0; t <= 1; t += 0.01) {
      const point = this.calculatePoint(t);
      d += ` L ${point.x} ${point.y}`;
    }

    this.completeCurvePath.setAttribute("d", d);
  }

  updatePath() {
    // Update complete curve
    this.updateCompleteCurve();

    // Update control lines
    const allPoints = [
      this.points[0],
      ...this.intermediatePoints,
      this.points[1],
    ];
    this.visualizationManager.updateControlLines(
      this.controlLinesPath,
      allPoints
    );
  }

  checkCollisions() {
    const squares = document.querySelectorAll(".grid-item");

    squares.forEach((square) => {
      const rect = square.getBoundingClientRect();
      const ballRect = this.element.getBoundingClientRect();
      const ballCenterX = ballRect.left + ballRect.width / 2;
      const ballCenterY = ballRect.top + ballRect.height / 2;

      if (
        ballCenterX >= rect.left &&
        ballCenterX <= rect.right &&
        ballCenterY >= rect.top &&
        ballCenterY <= rect.bottom
      ) {
        if (this.lastHitSquare !== square) {
          this.lastHitSquare = square;

          const index = parseInt(square.dataset.index);
          const row = Math.floor(index / 42);
          const col = index % 42;
          const noteIndex =
            (row * 5 + col * 3) % scales.pentatonic.notes.length;
          const noteToPlay = scales.pentatonic.notes[noteIndex];

          // Activate cell
          activateCell(
            square,
            this.visualizationManager.getMode(),
            typographicChars
          );

          // Play note
          if (this.audioManager.playNote(noteToPlay, this.synth, 0.2)) {
            square.classList.add("playing");
            setTimeout(() => {
              square.classList.remove("playing");
            }, 1000);
          }
        }
      } else if (this.lastHitSquare === square) {
        this.lastHitSquare = null;
      }
    });
  }

  update() {
    // Update t parameter with the current speed
    this.speed = this.curveSpeed * this.controlSpeed;
    this.t += this.speed;
    if (this.t > 1) {
      this.t = 0;
    }

    // Update control points if moving
    if (this.controlPointsMoving) {
      this.controlStates.forEach((state, index) => {
        this.controlManager.updateControlPoint(
          state,
          this.points[index],
          this.controlElements[index],
          this.gridLeft,
          this.gridTop,
          this.gridWidth,
          this.gridHeight,
          this.controlSpeed
        );
      });
    }

    // Calculate current position
    this.currentPoint = this.calculatePoint(this.t);

    // Update visual elements
    this.element.style.left = `${this.currentPoint.x}px`;
    this.element.style.top = `${this.currentPoint.y}px`;

    // Check collisions
    this.checkCollisions();

    // Update paths
    this.updatePath();
  }

  getRandomColor() {
    return "#FFFFFF"; // Sempre bianco
  }

  remove() {
    this.svg.remove();
    this.controlLinesSvg.remove();
    this.element.remove();
    this.controlElements.forEach((elem) => elem.remove());
    this.intermediateElements.forEach((elem) => elem.remove());
    this.synth.disconnect();
    this.filter.disconnect();
    this.delay.disconnect();
  }
}
