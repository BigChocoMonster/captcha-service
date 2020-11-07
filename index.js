function* charStream() {
  let i = 1;

  while (i <= 5) {
    i++;
    yield String.fromCharCode(Math.floor(Math.random() * 25) + 97);
  }
}

function insertText() {
  const stream = charStream();

  let text = "";
  let next = stream.next();
  while (!next.done) {
    text += next.value;
    next = stream.next();
  }

  const screen = document.getElementById("__screen__");
  screen.innerText = text;
}

insertText();
