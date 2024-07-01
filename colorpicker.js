
  class ColorPicker {
    COLORS = {
      /** @type {[string,boolean]} */
      myClr: ["#ba0", false],
      /** @type {[string,boolean]} */
      dropdown: ["#ab0", false],
    };
    debug = false; 
    /** @type {string[]} */
    COLORS_VARIANCE = [];
    /** @type {HTMLDivElement} */
    container;
    /** @type {HTMLStyleElement} */
    styleContainer;
    /** @type {HTMLStyleElement} */
    styleChanger;
    constructor(debug = false) {
      if (document.getElementById("colorPickerJS")) return;
      this.debug = debug;
      this.#setupContainerAndStyle();
  
      this.#setStyleContainer();
      this.#getStorage();
      this.#setColors();
  
      this.#initItems();
    }
    log(...attr) {
      this.debug && console.log(...attr);
    }
    #setupContainerAndStyle() {
      this.container = document.createElement("div");
      this.container.id = "colorPickerJS";
  
      const header = document.createElement("div");
      header.innerHTML = `<a href="https://github.com/Dedonych/Shikimori-Dark-Theme">Color-picker</a>`;
      const closeBtn = document.createElement("input");
      closeBtn.type = "checkbox";
      closeBtn.id = "closeBtn";
      closeBtn.checked = true;
      closeBtn.addEventListener("change", (e) => {
        e.preventDefault();
        this.container.removeAttribute("style");
      });
      // create function that can container move around
      this.container.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName == "BUTTON") return;
        console.log(e.target.tagName);
        let shiftX = e.clientX - this.container.getBoundingClientRect().left;
        let shiftY = e.clientY - this.container.getBoundingClientRect().top;
        const moveAt = (pageX, pageY) => {
          this.container.style.left = pageX - shiftX + "px";
          this.container.style.top = pageY - shiftY + "px";
        };
  
        const onMouseMove = (e) => {
          moveAt(e.clientX, e.clientY);
        };
        document.addEventListener("mousemove", onMouseMove);
  
        this.container.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", onMouseMove);
          this.container.onmouseup = null;
        });
  
        this.container.ondragstart = () => {
          return false;
        };
      });
  
      header.append(closeBtn);
      this.container.append(header, closeBtn);
  
      this.styleChanger = document.createElement("style");
      document.body.append(this.container, this.styleChanger);
    }
    #setStyleContainer() {
      this.styleContainer = document.createElement("style");
      this.styleContainer.innerHTML = `
      #colorPickerJS{
        display:grid;
        flex-wrap:wrap;
        gap:8px;
        position: fixed;
        bottom: 0;
        right: 0;
        width: 238px;
        height: 238px;
        padding:10px;
        background-color: #2e2e2e;
        border-top-left-radius: 10px;
        z-index:9999;
      }
      #colorPickerJS div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #72bfeb;
        font-size: 20px;
        a:hover {
          text-decoration: underline;
        }
      }
      #colorPickerJS > input {
        visibility: hidden;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        &:before {
          content: "x";
          visibility: visible;
          display: grid;
          place-content: center;
          font-size: 24px;
          line-height: 0.5rem;
        }
        #colorPickerJS:has(&:checked) {
          width: auto;
          height: auto;
          padding: 0;
          & *:not(& > input) {
            display: none;
          }
        }
        &:checked {
          margin: auto;
          top: -60px;
          right: 50px;
          &:before {
            content: "🎨";
            padding: 24px;
            border-radius: 50%;
            background-color: #2e2e2e;
            line-height: 0;
          }
        }
      }
      #colorPickerJS span {
        display: flex;
        align-items: center;
        gap: 8px;
        p {
        pointer-events:none;
          flex: 1;
        }
      }
      #colorPickerJS button {
        padding: 6px 10px;
        width: max-content;
        height: max-content;
        border-radius: 8px;
        border: 0;
        background-color: #1f1f1f;
        svg {
          fill: #ddd;
          height: 32px;
          pointer-events:none;
        }
      }
      #colorPickerJS div:last-child {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: row;
        align-content: space-between;
        gap: 2px;
        button {
          flex: 1;
        }
      }
    `;
      this.container.append(this.styleContainer);
    }
    #changeStyle() {
      this.styleChanger.innerHTML = `:root{--my-clr:${this.COLORS.myClr[0]};--dropdown:${this.COLORS.dropdown[0]}}`;
    }
    #setColors() {
      this.#changeStyle();
      this.#setStorage();
    }
    #getDefColors() {
      const comp = getComputedStyle(document.documentElement);
      let myClr = comp.getPropertyValue("--my-clr");
      if (myClr.length === 4)
        myClr = "#" + myClr.match(/[^#]/g).reduce((a, b) => a + b + b, "");
      let dropdown = comp.getPropertyValue("--dropdown");
      if (dropdown.length === 4)
        dropdown = "#" + dropdown.match(/[^#]/g).reduce((a, b) => a + b + b, "");
      return [myClr, dropdown];
    }
    #getStorage() {
      /** @type {string[]} */
      let storage = JSON.parse(sessionStorage.getItem("colorPickerJS"));
      if (!storage) storage = this.#getDefColors();
      this.COLORS.myClr[0] = storage[0];
      this.COLORS.dropdown[0] = storage[1];
    }
    #setStorage() {
      const { myClr, dropdown } = this.COLORS;
      sessionStorage.setItem(
        "colorPickerJS",
        JSON.stringify([myClr[0], dropdown[0]])
      );
    }
    #onChangeColor(name, value) {
      this.COLORS[name][0] = value;
      this.COLORS_VARIANCE[name === "myClr" ? 0 : 1] = value;
      this.#setColors();
      console.log(value);
      console.log(this.COLORS);
    }
    /**
     * @param {HTMLAttributes} attr
     * @returns {HTMLInputElement}
     */
    #createInput(attr) {
      return Object.assign(document.createElement("input"), attr);
    }
    #createButton(value = "", title = "", onclick = () => {}) {
      const button = document.createElement("button");
      button.innerHTML = value;
      button.title = title;
      button.onclick = onclick;
      this.container.append(button);
      return button;
    }
    #initItems() {
      const spanMy = document.createElement("span");
      const pMy = Object.assign(document.createElement("p"), {
        innerHTML: "--my-clr:",
      });
      const myClr = this.#createInput({
        type: "color",
        value: this.COLORS.myClr[0],
        onchange: (e) => this.#onChangeColor("myClr", e.currentTarget.value),
      });
      const lockMy = this.#createInput({
        type: "checkbox",
        title: "lock my-clr color",
        onchange: ({ currentTarget }) =>
          (this.COLORS.myClr[1] = currentTarget.checked),
      });
      spanMy.append(pMy, myClr, lockMy);
  
      const spanDrop = document.createElement("span");
      const pDrop = Object.assign(document.createElement("p"), {
        innerHTML: "--dropdown:",
      });
      const dropdown = this.#createInput({
        type: "color",
        value: this.COLORS.dropdown[0],
        onchange: (e) => this.#onChangeColor("dropdown", e.currentTarget.value),
      });
      const lockDrop = this.#createInput({
        type: "checkbox",
        title: "lock dropdown color",
        onchange: ({ currentTarget }) =>
          (this.COLORS.dropdown[1] = currentTarget.checked),
      });
      spanDrop.append(pDrop, dropdown, lockDrop);
      this.container.append(spanMy, spanDrop);
  
      //--------------  buttons  ------------------
      const buttonContainer = document.createElement("div");
  
      //function to change value of input:color
      const changeInputsColor = () => {
        myClr.value = this.COLORS.myClr[0];
        dropdown.value = this.COLORS.dropdown[0];
      };
      const copy = this.#createButton(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`,
        "Copy colors that can just paste",
        () => {
          navigator.clipboard.writeText(
            `--dropdown:${this.COLORS.dropdown[0]};\n--my-clr:${this.COLORS.myClr[0]};`
          );
          copy.style.background = "#5f5";
          setTimeout(() => copy.removeAttribute("style"), 500);
        }
      );
  
      const swap = this.#createButton(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>`,
        "Swap colors between each other",
        () => {
          this.log("SWAP");
          this.log("before:", this.COLORS.myClr[0], this.COLORS.dropdown[0]);
          const temp = this.COLORS.dropdown[0];
          this.COLORS.dropdown[0] = this.COLORS.myClr[0];
          this.COLORS.myClr[0] = temp;
          changeInputsColor();
          this.#setColors();
          this.COLORS_VARIANCE = [this.COLORS.myClr[0], this.COLORS.dropdown[0]];
          this.log("after:", this.COLORS.myClr[0], this.COLORS.dropdown[0]);
        }
      );
      swap.style.background = `linear-gradient(0,var(--my-clr),var(--dropdown))`;
  
      const random = this.#createButton(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>`,
        "Set random color (when blocked: not set)",
        () => {
          const randomColor = () =>
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0");
          const { myClr, dropdown } = this.COLORS;
          this.log("Random:");
          this.log("before:", myClr[0], dropdown[0]);
          myClr[0] = myClr[1] ? myClr[0] : randomColor();
          dropdown[0] = dropdown[1] ? dropdown[0] : randomColor();
          changeInputsColor();
          this.#setColors();
          this.log("after:", myClr[0], dropdown[0]);
          this.COLORS_VARIANCE = [myClr[0], dropdown[0]];
        }
      );
      random.style.background = `linear-gradient(90deg,red,green)`;
      const randomByVariance = this.#createButton(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>`,
        "Set random similar color (when blocked: take first color and don't change it)",
        () => {
          function generateByVariance(color) {
            const baseColor = color.match(/[^#]./g).map((e) => parseInt(e, 16));
            // Function to generate a random integer within a range
            const randomInRange = (min = 0, max = 255) =>
              Math.floor(Math.random() * (max - min + 1)) + min;
            // Set variance of color. 10: similar -> 100: less similar
            let variance = 50;
            // Calculate the ranges for each color component
            const colorMin = baseColor.map((e) => Math.max(0, e - variance));
            const colorMax = baseColor.map((e) => Math.min(255, e + variance));
            // Generate random values within the ranges
            const normalColor = colorMin.map((min, i) =>
              randomInRange(min, [colorMax[i]])
            );
            return (
              "#" +
              normalColor
                .map((e) => {
                  const hex = e.toString(16);
                  return hex.length == 1 ? "0" + hex : hex;
                })
                .join("")
            );
          }
          this.log("Random by variance");
          this.log("before:", this.COLORS.myClr[0], this.COLORS.dropdown[0]);
          let { myClr, dropdown } = this.COLORS;
          this.log("temp COLORS_VARIANCE before check:", ...this.COLORS_VARIANCE);
          if (this.COLORS_VARIANCE.length < 2) {
            this.COLORS_VARIANCE = [myClr[0], dropdown[0]];
          }
          this.log("temp COLORS_VARIANCE before:", ...this.COLORS_VARIANCE);
  
          let [vMy, vDrop] = this.COLORS_VARIANCE;
          this.COLORS_VARIANCE = [
            myClr[1] ? vMy : myClr[0],
            dropdown[1] ? vDrop : dropdown[0],
          ];
          [vMy, vDrop] = this.COLORS_VARIANCE;
          this.log("temp COLORS_VARIANCE after:", vMy, vDrop);
          this.COLORS.myClr[0] = generateByVariance(vMy);
          this.COLORS.dropdown[0] = generateByVariance(vDrop);
          changeInputsColor();
          this.#setColors();
          this.log("after:", this.COLORS.myClr[0], this.COLORS.dropdown[0]);
        }
      );
      randomByVariance.style.background = `linear-gradient(90deg,var(--my-clr),var(--dropdown))`;
      const reset = this.#createButton(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z"/></svg>`,
        "Reset all settings: lockers, colors to your's default",
        () => {
          this.styleChanger.innerHTML = "";
          const [dMy, dDrop] = this.#getDefColors();
          this.COLORS.myClr = [dMy, false];
          this.COLORS.dropdown = [dDrop, false];
          this.COLORS_VARIANCE = [];
          lockMy.checked = false;
          lockDrop.checked = false;
          this.#setColors();
          changeInputsColor();
        }
      );
      reset.style.background = "#9d2d2d";
  
      buttonContainer.append(
        copy,
        swap,
        document.createElement("br"),
        random,
        randomByVariance,
        reset
      );
      this.container.append(buttonContainer);
    }
  }
  let DEBUGMODE = false; // change to "true" to get some log.
  addEventListener("load",()=>(new ColorPicker(DEBUGMODE)))
  addEventListener("turbolinks:load",()=>(new ColorPicker(DEBUGMODE)))
  new ColorPicker(DEBUGMODE);