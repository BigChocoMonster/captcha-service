// creating a shadow dom for abstraction of element
const captcha = document.getElementById("captcha");
if (captcha) {
  const shadowDOM = captcha.attachShadow({ mode: "closed" });

  // external stylesheet
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://s3.amazonaws.com/captcha.s/captcha.s.min.css";
  link.onload = () => {
    shadowDOM.innerHTML += `
      <div id='__captcha__'>
        <canvas id='__screen__'></canvas>
        <div>
          <div id='__input-w__'>
            <label for='__captcha_input__'>Type the text above:</label>
            <input id='__captcha_input__' />
            <button onclick="submitUserInput()">Continue</button>
          </div>
          <div id='__controls__'>
            <button class="control" onclick="setCaptcha()"><img src='https://s3.amazonaws.com/captcha.s/reload.svg' width="10" height='10' /></button>
            <button class="control" onclick="toggleInfoStatus(true)" ><img src='https://s3.amazonaws.com/captcha.s/help.svg' width="10" height='10' /></button>
            <div id='__info-box__' data-status="hidden">
              Type text from screen in the input field and click 'Continue'.
              If the text matches, you have proved you are not a bot.
              If not, then another text will be appear.
              Click on reload button above if text is unclear.
            </div>
          </div>
        </div>
      </div>
  `;

    // screen render
    const screen = shadowDOM.getElementById("__screen__");
    const context = screen.getContext("2d");

    let screenText;

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
      return (
        context.canvas.height / 2 + 10 - (Math.floor(Math.random() * 25) - 20)
      );
    }

    function insertText() {
      const stream = charStream();

      let next = stream.next();
      let coordinates = {
        x: getRandomXCoordinate(),
        y: getRandomYCoordinate(),
      };
      while (!next.done) {
        screenText += next.value;
        context.fillText(next.value, coordinates.x, coordinates.y);
        coordinates.x += context.measureText(next.value).width + 20;
        coordinates.y = getRandomYCoordinate();
        next = stream.next();
      }
    }

    function setCaptcha() {
      screenText = "";
      shadowDOM.getElementById("__captcha_input__").value = "";
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
      context.fillStyle = `rgb(${or}, ${og}, ${ob})`;
      context.shadowColor = `rgb(${or}, ${og}, ${ob})`;

      insertText();
    }

    setCaptcha();
    // -- x --

    // info control
    let isInfoVisible = false;
    function toggleInfoStatus() {
      isInfoVisible = !isInfoVisible;
      shadowDOM
        .getElementById("__info-box__")
        .setAttribute("data-status", isInfoVisible ? "visible" : "hidden");
    }
    // -- x --

    // user submission
    function submitUserInput() {
      const input = shadowDOM.getElementById("__captcha_input__");
      if (screenText === input.value) {
        const captchaContainer = shadowDOM.getElementById("__captcha__");
        captchaContainer.innerHTML = "";

        const successful = shadowDOM.createElement("div");
        successful.setAttribute("id", "__verified__");
        successful.innerText = "Not a robot";

        captchaContainer.appendChild(successful);
      } else {
        setCaptcha();
      }
    }
  };

  shadowDOM.appendChild(link);
}
