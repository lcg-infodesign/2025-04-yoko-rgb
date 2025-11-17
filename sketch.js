let outerMargin = 100;

let data;

let hovered;

let minLon, maxLon, minLat, maxLat, maxValue;

function preload() {

  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let allLon = data.getColumn("longitude");
  minLon = min(allLon);
  maxLon = max(allLon);

  let allLat = data.getColumn("latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

  let allValues = data.getColumn("total");
  maxValue = max(allValues);

  console.log("Dati caricati:", data);
}

function draw() {
  background(245, 240, 220); 
  hovered = null;

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let country = data.getString(rowNumber, "country");
    let value = data.getNum(rowNumber, "total");
    let lat = data.getNum(rowNumber, "latitude");
    let lon = data.getNum(rowNumber, "longitude");

    let x = map(lon, minLon, maxLon, outerMargin, width - outerMargin);
    let y = map(lat, minLat, maxLat, height - outerMargin, outerMargin);

    let radius = map(value, 0, maxValue, 5, 50);

    let t = value / maxValue;
    let col;
    if (t < 0.5) {
      col = lerpColor(color('#FF0000'), color('#FF69B4'), t * 2);
    } else {
      col = lerpColor(color('#FF69B4'), color('#800080'), (t - 0.5) * 2);
    }

    let d = dist(mouseX, mouseY, x, y);


    let pulse = sin(frameCount * 0.05) * 5;

    if (d < radius / 2) {
      hovered = { x: x, y: y, country: country, value: value };

      stroke(255);
      strokeWeight(2);
      noFill();
      ellipse(x, y, radius + 10 + pulse, radius + 10 + pulse);

      drawSun(x, y, radius + pulse, col);
    } else {
      drawSun(x, y, radius + pulse, col, 150);
    }
  }

  if (hovered) {
    cursor("pointer");
    let tooltipText = hovered.country + ": " + hovered.value;
    drawTooltip(hovered.x, hovered.y, tooltipText);
  } else {
    cursor("default");
  }
}

function drawSun(x, y, radius, col, alphaVal = 255) {
  push();
  noStroke();
  fill(red(col), green(col), blue(col), alphaVal);
  ellipse(x, y, radius, radius);
  pop();
}

function drawTooltip(px, py, textString) {
  textFont("courier"); 
  textSize(16);
  textAlign(LEFT, CENTER);
  fill(0, 0, 0, 150);
  rect(px + 10, py - 20, textWidth(textString) + 10, 30, 5);
  fill("white");
  noStroke();
  text(textString, px + 15, py - 5);
}

function mousePressed() {
  if (hovered) {
    let newURL = "page.html?country=" + hovered.country;
    window.location.href = newURL;
  }
}