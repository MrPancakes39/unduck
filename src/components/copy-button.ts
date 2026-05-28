import { Component } from "../component";
import clipboardIcon from "../assets/clipboard.svg";
import clipboardCheckIcon from "../assets/clipboard-check.svg";

export class CopyButton extends Component {
  readonly selector = "#copy-button-slot";

  template() {
    return `
      <div class="url-container">
        <input
          type="text"
          class="url-input"
          value="https://research.mrpancakes39.xyz/?q=%s"
          readonly
        />
        <button class="copy-button">
          <img src="${clipboardIcon}" alt="Copy" />
        </button>
      </div>
    `;
  }

  protected setup(root: HTMLElement) {
    const copyButton = this.$<HTMLButtonElement>(".copy-button", root);
    const copyIcon = this.$<HTMLImageElement>("img", copyButton);
    const urlInput = this.$<HTMLInputElement>(".url-input", root);

    this.on(copyButton, "click", async () => {
      await navigator.clipboard.writeText(urlInput.value);
      copyIcon.src = clipboardCheckIcon;

      setTimeout(() => {
        copyIcon.src = clipboardIcon;
      }, 2000);
    });
  }
}
