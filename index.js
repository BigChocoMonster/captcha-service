const screen = document.getElementById("__screen__");
const context = screen.getContext("2d");

function* charStream() {
  let i = 1;

  while (i <= 5) {
    i++;
    yield String.fromCharCode(Math.floor(Math.random() * 25) + 97);
  }
}

function getRandomXCoordinate() {
  return 40 - (Math.floor(Math.random() * 25) - 5);
}

function getRandomYCoordinate() {
  return context.canvas.height / 2 + 10 - (Math.floor(Math.random() * 25) - 20);
}

function insertText() {
  console.log(context);
  const stream = charStream();

  let next = stream.next();
  let coordinates = {
    x: getRandomXCoordinate(),
    y: getRandomYCoordinate(),
  };
  while (!next.done) {
    context.strokeText(next.value, coordinates.x, coordinates.y);
    coordinates.x += context.measureText(next.value).width + 20;
    coordinates.y = getRandomYCoordinate();
    next = stream.next();
  }
}

function setCaptcha() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.font = "50px Poppins";

  // these lines exist to give a distorted feel to the text
  context.shadowBlur = 2.5;
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;

  // adding random background color
  const [r, g, b] = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
  context.fillStyle = `rgb(${r}, ${g}, ${b})`;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  // changing font and shadow to a somewhat opposite color
  const [or, og, ob] = [255 - r, 255 - r, 255 - r];
  context.strokeStyle = `rgb(${or}, ${og}, ${ob})`;
  context.shadowColor = `rgb(${or}, ${og}, ${ob})`;

  insertText();
}

setCaptcha();
