import { Component } from "../component";
import { CopyButton } from "./copy-button";
import { DefaultEngineSelector } from "./default-engine-selector";

export class RootPage extends Component {
  readonly selector = "#app";

  template() {
    return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Re:Search</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div id="copy-button-slot"></div>
        <div id="default-engine-selector-slot"></div>
      </div>
      <footer class="footer">
        <a href="https://mrpancakes39.xyz" target="_blank">sal</a>
        •
        <a href="https://github.com/MrPancakes39/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;
  }

  protected setup(root: HTMLElement) {
    new CopyButton().mount(root);
    new DefaultEngineSelector().mount(root);
  }
}
