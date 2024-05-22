{
    const fn = () => {
      if (
        document.querySelector(".customPicker") ||
        location.href.includes("/api")
      )
        return;
      const style = document.createElement("style");
      // get property
      let myClrColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--my-clr");
      let dropdownColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--dropdown");
  
      const createInput = (props) =>
        Object.assign(document.createElement("input"), {
          type: "submit",
          className: "customPicker",
          ...props,
        });
      // changer style
      const changeStyle = () =>
        (style.innerHTML = `:root{--my-clr:${myClrColor};--dropdown:${dropdownColor}}`);
      // --my-clr colorpicker
      const myClrPick = createInput({
        type: "color",
        value: myClrColor,
        onchange: (e) => {
          myClrColor = e.target.value;
          changeStyle();
        },
      });
      // --dropdown colorpicker
      const dropdownPick = createInput({
        type: "color",
        value: dropdownColor,
        style: "top:60px",
        onchange: (e) => {
          dropdownColor = e.target.value;
          changeStyle();
        },
      });
      // swap colors button
  
      const swapButton = createInput({
        value: "Swap",
        style: "top:100px;",
        onclick: () => {
          let tmp = myClrColor;
          myClrColor = dropdownColor;
          dropdownColor = tmp;
          myClrPick.value = myClrColor;
          dropdownPick.value = dropdownColor;
          changeStyle();
        },
      });
  
      // copy to clipboard button
      const copyButton = createInput({
        value: "Copy",
        style: "top:140px;",
        onclick: () => {
          navigator.clipboard.writeText(
            `--dropdown:${dropdownColor};\n --my-clr:${myClrColor};`
          );
          copyButton.value = "Copied!";
          setTimeout(() => (copyButton.value = "Copy"), 500);
        },
      });
  
      //random colors
  
      const randomColor = () =>
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
      const randomButton = createInput({
        value: "Random",
        style: "top:180px;",
        onclick: () => {
          myClrColor = randomColor();
          dropdownColor = randomColor();
          myClrPick.value = myClrColor;
          dropdownPick.value = dropdownColor;
          console.log(`--dropdown:${dropdownColor};\n --my-clr:${myClrColor};`);
          changeStyle();
        },
      });
  
      // reset style
      const resetButton = createInput({
        value: "Reset",
        style: "top:220px",
        onclick: () => {
          style.innerHTML = "";
          myClrColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--my-clr");
          dropdownColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--dropdown");
          changeStyle();
        },
      });
  
      //style for items
      const stylish = document.createElement("style");
      stylish.innerHTML = `.customPicker{position:fixed;top:20px;height:30px;width:60px; right:calc(calc(100vw - 1200px) / 2 - 50px);translate:50%}`;
      // appender
      document.body.append(stylish, style);
      document.body.append(
        myClrPick,
        dropdownPick,
        swapButton,
        copyButton,
        randomButton,
        resetButton
      );
      changeStyle();
    };
    addEventListener('load',fn);
    addEventListener("turbolinks:load",fn)
    fn();
}