import "./dark-mode-toggle.scss";

export const DarkModeToggle = () => {
  return (
    <div id="dark-mode-toggle">
      <input id="toggle" type="checkbox" />
      <label htmlFor="toggle"></label>
    </div>
  );
};
