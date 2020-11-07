const screen = document.getElementById("__screen__");
const context = screen.getContext("2d");

function* charStream() {
  let i = 1;

  while (i <= 5) {
    i++;
    yield String.fromCharCode(Math.floor(Math.random() * 25) + 97);
  }
}

function insertText() {
  const stream = charStream();

  let next = stream.next();
  let coordinates = {
    x: 50,
    y: context.canvas.height / 2,
  };
  while (!next.done) {
    context.fillText(next.value, coordinates.x, coordinates.y);
    coordinates.x += context.measureText(next.value).width + 20;
    next = stream.next();
  }
}

function setCaptcha() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.font = "50px Poppins";

  insertText();
}

setCaptcha();
