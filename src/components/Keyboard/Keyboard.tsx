import "./keyboard.scss";

const firstRowKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRowKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRowKeys = ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"];

export const Keyboard = () => {
  return (
    <div id="keyboard">
      <div className="keyboard-row">
        {firstRowKeys.map((key) => (
          <div className="key">{key}</div>
        ))}
      </div>

      <div className="keyboard-row">
        {secondRowKeys.map((key) => (
          <div className="key">{key}</div>
        ))}
      </div>

      <div className="keyboard-row">
        {thirdRowKeys.map((key) => {
          if (key === "backspace") {
            return (
              <div className="key backspace">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  data-testid="icon-backspace"
                >
                  <path
                    fill="var(--color-tone-1)"
                    d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                  ></path>
                </svg>
              </div>
            );
          }

          if (key === "enter") {
            return <div className="key enter">{key}</div>;
          }

          return <div className="key">{key}</div>;
        })}
      </div>
    </div>
  );
};
