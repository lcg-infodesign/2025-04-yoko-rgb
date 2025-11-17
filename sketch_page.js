let data;

function preload() {
  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245, 240, 220);
  angleMode(DEGREES);
}

function draw() {
  background(245, 240, 220);

  let params = getURLParams();
  if (!params.country) return;

  let matches = data.findRows(params.country, "country");
  if (matches.length === 0) return;

  let selected = matches[0];


  let dimensions = [
    "Access to financial assets",
    "Access to justice",
    "Access to land assets",
    "Access to non-land assets",
    "Child marriage eradication",
    "Female genital mutilation eradication",
    "Freedom of movement",
    "Household responsibilities",
    "Political voice",
    "Violence against women eradication",
    "Workplace rights",
  ];

  // etichette più brevi
  let shortLabels = [
    "Financial assets",
    "Justice",
    "Land assets",
    "Non-land assets",
    "Child marriage",
    "FGM",
    "Movement",
    "Household",
    "Political voice",
    "Violence",
    "Workplace"
  ];

  let guideR = 50;
  let maxSpan = 280;

  let lineCol = color(0, 120, 80, 128);
  let petalCol = color(255, 105, 180, 128);
  let petalColLight = color(255, 190, 210, 128);

  let n = dimensions.length;
  let cols = min(5, n);

  let rows = ceil(n / cols);

  let marginX = 60;
  let marginTop = 160;    
  let baselineY = height - 40; 

  let usableHeight = baselineY - marginTop - guideR * 2;
  let rowGap = rows > 1 ? usableHeight / (rows - 1) : 0;
  let usableWidth = width - marginX * 2;
  let colGap = cols > 1 ? usableWidth / (cols - 1) : 0;

  // disegna i fiori
  for (let i = 0; i < n; i++) {
    let dim = dimensions[i];
    let raw = selected.get(dim);
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;

    let r = floor(i / cols);
    let c = i % cols;
    let cx = marginX + c * colGap;
    let cy = marginTop + r * rowGap;

    drawFlower(
      cx, cy, baselineY, guideR,
      v,
      shortLabels[i],
      raw,
      shortLabels[i],
      lineCol, petalCol, petalColLight
    );
  }
}

function drawFlower(cx, cy, baselineY, guideR, value, label, rawValue, countryName, stemCol, petalCol, petalColLight) {

  push();

textAlign(LEFT, BOTTOM);
textFont("courier");
textSize(10);
fill(0);
noStroke();
text(label, cx, cy - guideR - 10);

 

  // apertura del fiore
  let span = map(constrain(value, 0, 100), 0, 100, 0, 280);
  let centerAngle = -90;
  let startA = centerAngle - span / 2;
  let endA = centerAngle + span / 2;

  // petali esterni
  noStroke();
  fill(petalColLight);
  arc(cx, cy, guideR * 2, guideR * 2, startA, endA, PIE);

  // petali interni
  fill(petalCol);
  let innerR = guideR * 0.75;
  arc(cx, cy, innerR * 2, innerR * 2, startA, endA, PIE);

  // centro fiore
  fill(255, 105, 180);
  ellipse(cx, cy, guideR * 0.30, guideR * 0.30);

  // stelo curvo
  stroke(255, 105, 180);
  strokeWeight(1.2);
  noFill();

  let stemTopX = cx;
  let stemTopY = cy;

  let stemMidX = cx - guideR * 0.2;
  let stemMidY = (stemTopY + baselineY) / 2;

  bezier(stemTopX, stemTopY, stemMidX, stemMidY, stemMidX, stemMidY + 20, cx, baselineY);


  pop();
}