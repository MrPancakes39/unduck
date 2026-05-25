import { bangs } from "./bang";
import "./global.css";
import bingIcon from "./assets/bing.svg";
import braveIcon from "./assets/brave.svg";
import duckduckgoIcon from "./assets/duckduckgo.svg";
import ecosiaIcon from "./assets/ecosia.webp";
import googleIcon from "./assets/google.svg";
import kagiIcon from "./assets/kagi.png";
import yahooIcon from "./assets/yahoo.png";

const ENGINE_OPTIONS = [
  { name: "Google", bang: "g", icon: googleIcon },
  { name: "DuckDuckGo", bang: "ddg", icon: duckduckgoIcon },
  { name: "Bing", bang: "b", icon: bingIcon },
  { name: "Brave", bang: "brave", icon: braveIcon },
  { name: "Yahoo", bang: "y", icon: yahooIcon },
  {
    name: "Ecosia",
    bang: "ecosia",
    icon: ecosiaIcon,
    iconClass: "engine-select-icon-circle",
  },
  { name: "Kagi", bang: "kagi", icon: kagiIcon },
];

const DEFAULT_ENGINES = ENGINE_OPTIONS.map((engine) => ({
  ...engine,
  rank: bangs.find((bang) => bang.t === engine.bang)?.r ?? 0,
})).sort((a, b) => b.rank - a.rank);

function setupEngineSelect(container: HTMLElement, selectedBang: string) {
  const trigger = container.querySelector<HTMLButtonElement>(
    ".engine-select-trigger",
  )!;
  const list = container.querySelector<HTMLUListElement>(".engine-select-list")!;

  const getEngine = (bang: string) =>
    DEFAULT_ENGINES.find((engine) => engine.bang === bang) ?? DEFAULT_ENGINES[0]!;

  const iconClass = (engine: (typeof DEFAULT_ENGINES)[number]) =>
    ["engine-select-icon", engine.iconClass].filter(Boolean).join(" ");

  const renderTrigger = (engine: (typeof DEFAULT_ENGINES)[number]) => {
    trigger.innerHTML = `
      <img src="${engine.icon}" alt="" class="${iconClass(engine)}" />
      <span>${engine.name}</span>
      <span class="engine-select-chevron" aria-hidden="true">▾</span>
    `;
    trigger.setAttribute("aria-expanded", list.hidden ? "false" : "true");
  };

  const close = () => {
    list.hidden = true;
    container.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    list.hidden = false;
    container.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  };

  list.innerHTML = DEFAULT_ENGINES.map(
    (engine) => `
      <li>
        <button
          type="button"
          class="engine-select-option${engine.bang === selectedBang ? " selected" : ""}"
          data-bang="${engine.bang}"
          role="option"
          aria-selected="${engine.bang === selectedBang}"
        >
          <img src="${engine.icon}" alt="" class="${iconClass(engine)}" />
          <span>${engine.name}</span>
        </button>
      </li>
    `,
  ).join("");

  renderTrigger(getEngine(selectedBang));

  trigger.addEventListener("click", () => {
    if (list.hidden) open();
    else close();
  });

  list.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      ".engine-select-option",
    );
    if (!button) return;

    const bang = button.dataset.bang!;
    localStorage.setItem("default-bang", bang);

    for (const option of list.querySelectorAll<HTMLButtonElement>(
      ".engine-select-option",
    )) {
      const isSelected = option.dataset.bang === bang;
      option.classList.toggle("selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    }

    renderTrigger(getEngine(bang));
    close();
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target as Node)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Und*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://unduck.link?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <div class="setting">
          <span>Default Search Engine:</span>
          <div class="engine-select" id="default-browser-select">
            <button
              type="button"
              class="engine-select-trigger"
              aria-haspopup="listbox"
              aria-expanded="false"
            ></button>
            <ul class="engine-select-list" role="listbox" hidden></ul>
          </div>
        </div>
      </div>
      <footer class="footer">
        <a href="https://t3.chat" target="_blank">t3.chat</a>
        •
        <a href="https://x.com/theo" target="_blank">theo</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

  const engineSelect = app.querySelector<HTMLDivElement>(
    "#default-browser-select",
  )!;
  setupEngineSelect(engineSelect, LS_DEFAULT_BANG);
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
