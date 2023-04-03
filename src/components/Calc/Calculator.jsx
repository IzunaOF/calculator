import React from "react";
import "./calculator.css";
import Calculus from "./calc/math.js";

const ButtonValues = ["C", "X", "(", ")", "%", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", 0, ".", "="];
function Screen(status) {
  const str = status.showOnScreen;
  const keyboard = status.onKeyboard;
  return (
    <input
      type={"text"}
      className="screen"
      id="screen"
      onChange={keyboard}
      value={str}
      autoFocus={true}
    />
  );
}

const Buttons = (params) => {
  const v = params.value;
  const event = params.onclick;
  const spanTwice = v === "C" || v === "X" || v === "=";
  return (
    <option
      style={{
        gridColumn: spanTwice ? "span 2" : "span 1",
        color: "var(--c-black)",
        backgroundColor:
          v === "X" || v === "="
            ? v === "="
              ? "var(--c-equals)"
              : "var(--c-remove)"
            : isNaN(v)
            ? "var(--c-NaNs)"
            : "var(--c-isNumbers)",
        outline: `1px solid var(--c-black)`,
        boxShadow: "0 0 5px 0 var(--c-black)",
      }}
      key={v}
      value={v}
      onClick={event}
    >
      {v}
    </option>
  );
};

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ values: 0, result: 0 }],
      options: [],
      result: [],
    };
  }
  /**
   * Go through every state from Calculator processing the key method,
   * relating if it is a number or not and returning a mathematic calculate
   * as well setting Calculator status according to the changes
   * @param {String} key expect to be a calculator option:
   * [0-9] or [ = | + | - | / | * | () ]
   */
  setCalc(key) {
    const equals = key === "=" || key === "Enter";
    const remove = key === "X" || key === "Backspace";
    const blank = key === "C";
    const digit = key === "," ? "." : key;
    const operations = this.state.options;

    this.setState({
      options:
        equals || blank ? [] : remove ? operations.slice(0, operations.length - 1) : operations.concat(digit),
    });
    if (equals) {
      this.setState((currency) => {
        currency.result = new Calculus(operations.join("")).innerCalc(); //mathCalc.innerCalc.from(mathCalc.model(operations.join("")));
        if (!isNaN(currency.result) && currency.result[0] !== undefined) {
          const history = this.state.history;
          const calcToHistory = [{ values: operations.join(''), result: currency.result }];
          history.length > 5
            ? (currency.history = history.slice(1, history.length).concat(calcToHistory))
            : (currency.history = history.concat(calcToHistory));
        }
      });
    }
  }
  keyboardInput() {
    const value = document.querySelector(".calcBox");
    value.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (
        (event.keyCode >= 96 && event.keyCode <= 111) ||
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        event.keyCode === 13 ||
        event.keyCode === 8
      ) {
        this.setCalc(event.key);
      }
      event.stopPropagation();
    });
  }

  addOperation() {
    console.log("added");
  }
  render() {
    const uptdScreen = this.state.options.join("");

    const history = this.state.history.map((calc, i) => {
      if (i !== 0) {
        const list = (text, index, leftSide = false) => {
          return (
            <li
              key={index}
              className="history-btn"
            >
              <button
                style={{
                  cursor: "pointer",
                  font: "400 20px var(--f-Fasthand)",
                  backgroundColor: "transparent",
                }}
              >
                {leftSide ? `${text} = ${index}'º'` : `${index}'º' = ${text}`}
              </button>
            </li>
          );
        };
        const operations = list(calc.values, i);
        const results = list(calc.result, i, true);

        return { operations: operations, results: results };
      } else {
        const titlesList = (title) => {
          return (
            <li
              key={title}
              className="history-title"
              style={{
                font: "600 32px var(--f-Fasthand)",
              }}
            >
              {title}
            </li>
          );
        };
        return {
          operations: titlesList("Operations"),
          results: titlesList("Results"),
        };
      }
    });

    return (
      <div className="calcBox">
        <div className="history">
          <ol className="history-list-Result">
            {history.map((res) => {
              return res.results;
            })}
          </ol>
        </div>
        <div className="calculadora">
          <Screen
            showOnScreen={uptdScreen}
            onKeyboard={() => this.keyboardInput()}
          ></Screen>
          <div className="group">
            {ButtonValues.map((i) => {
              return (
                <Buttons
                  key={i}
                  value={i}
                  onclick={() => this.setCalc(i)}
                />
              );
            })}
          </div>
        </div>
        <div className="history">
          <ol className="history-list">
            {history.map((op) => {
              return op.operations;
            })}
          </ol>
        </div>
      </div>
    );
  }
}

export default Calculator;
