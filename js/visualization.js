export const typographicChars = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "!",
  "@",
  "#",
  "$",
  "%",
  "&",
  "*",
  "+",
  "-",
  "=",
  "?",
  ">",
  "<",
  "|",
];

export class VisualizationManager {
  constructor() {
    this.mode = 1; // 1: standard, 2: typographic, 3: mixed monochrome
  }

  setMode(mode) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  createTrailPath() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "#FFFFFF");
    path.setAttribute("stroke-width", "0");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "0");
    return path;
  }

  createControlPoint(isMain = true) {
    const elem = document.createElement("div");
    elem.className = `control-point ${
      isMain ? "main-control" : "intermediate-control"
    }`;
    elem.style.backgroundColor = "#FFFFFF";
    elem.style.border = `${isMain ? "4px" : "3px"} solid #FFFFFF`;
    elem.style.visibility = "visible";
    elem.style.opacity = "1";
    elem.style.transition = "opacity 0.5s ease";
    elem.style.width = isMain ? "80px" : "60px";
    elem.style.height = isMain ? "80px" : "60px";
    elem.style.borderRadius = "50%";
    elem.style.position = "absolute";
    elem.style.transform = "translate(-50%, -50%)";
    elem.style.boxShadow = `0 0 ${isMain ? "20px" : "15px"} #FFFFFF`;
    return elem;
  }

  createControlLinesPath() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "#FFFFFF");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "1");
    path.style.transition = "opacity 0.5s ease";
    return path;
  }

  updateTrailPath(path, points) {
    if (points.length > 1) {
      let pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x},${points[i].y}`;
      }
      path.setAttribute("d", pathD);
    }
  }

  updateControlLines(path, points) {
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    path.setAttribute("d", pathD);
  }
}
