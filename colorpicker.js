{
  const fn = () => {
    if (
      !location.href.includes("shikimori.one") ||
      location.href.includes("/api") ||
      document.querySelector(".customPicker")) return;

    const style = document.createElement("style");
    const stylish = document.createElement("style");
    stylish.innerHTML = `
      .customPicker {
        position: fixed;
        top: 20px;
        height: 30px;
        width: 60px;
        right: calc(calc(100vw - 1200px) / 2 - 50px);
        translate: 50%;
      }
    `;
    document.head.append(stylish);

    const getComputedColor =(str) =>getComputedStyle(document.documentElement).getPropertyValue(str);
    let myClrColor = getComputedColor("--my-clr");
    let dropdownColor = getComputedColor("--dropdown");

    const storage = JSON.parse(sessionStorage.getItem("colorPicker"));
    if (storage) {
      myClrColor = storage.m;
      dropdownColor = storage.d;
    }
    const createInput = (props) => {
      const input = document.createElement("input");
      Object.assign(input, { type: "submit", className: "customPicker", ...props });
      return input;
    };

    const createColorPicker = (color, onChange, style = '') => createInput({
      type: "color",
      value: color,
      style,
      onchange: (e) => {
        onChange(e.target.value);
        changeStyle();
      }
    });

    const myClrPick = createColorPicker(myClrColor, (val) => myClrColor = val);
    const dropdownPick = createColorPicker(dropdownColor, (val) => dropdownColor = val, "top:60px");

    const changeStyle = () => {
      myClrPick.value = myClrColor;
      dropdownPick.value = dropdownColor;
      style.innerHTML = `:root{--my-clr:${myClrColor};--dropdown:${dropdownColor}}`;
      sessionStorage.setItem("colorPicker", JSON.stringify({ m: myClrColor, d: dropdownColor }));
    };

    const createButton = (value, style, onClick) => createInput({
      value,
      style,
      onclick: onClick
    });

    const swapButton = createButton("Swap", "top:100px;", () => {
      [myClrColor, dropdownColor] = [dropdownColor, myClrColor];
      changeStyle();
    });

    const copyButton = createButton("Copy", "top:140px;", () => {
      navigator.clipboard.writeText(`--dropdown:${dropdownColor};\n--my-clr:${myClrColor};`);
      copyButton.value = "Copied!";
      setTimeout(() => copyButton.value = "Copy", 500);
    });

    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

    const randomButton = createButton("Random", "top:180px;", () => {
      myClrColor = randomColor();
      dropdownColor = randomColor();
      console.log(`--dropdown:${dropdownColor};\n--my-clr:${myClrColor};`);
      changeStyle();
    });

    const resetButton = createButton("Reset", "top:220px;", () => {
      style.innerHTML = "";
      myClrColor = getComputedColor("--my-clr");
      dropdownColor = getComputedColor("--dropdown");
      myClrPick.value = myClrColor;
      dropdownPick.value = dropdownColor;
      sessionStorage.removeItem("colorPicker");
    });

    document.body.append(style, myClrPick, dropdownPick, swapButton, copyButton, randomButton, resetButton);
    changeStyle();
  };
  addEventListener('load',fn);
  addEventListener("turbolinks:load",fn);
  fn();
} 