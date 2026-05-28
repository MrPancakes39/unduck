import bingIcon from "../assets/engines/bing.svg";
import braveIcon from "../assets/engines/brave.svg";
import duckduckgoIcon from "../assets/engines/duckduckgo.svg";
import ecosiaIcon from "../assets/engines/ecosia.webp";
import googleIcon from "../assets/engines/google.svg";
import kagiIcon from "../assets/engines/kagi.png";
import mojeekIcon from "../assets/engines/mojeek.png";
import qwantIcon from "../assets/engines/qwant.png";
import startpageIcon from "../assets/engines/startpage.png";
import yahooIcon from "../assets/engines/yahoo.png";
import yandexIcon from "../assets/engines/yandex.png";
import { Component } from "../component";

const ENGINE_OPTIONS = [
  { name: "Google", bang: "g", icon: googleIcon },
  { name: "Bing", bang: "b", icon: bingIcon },
  { name: "DuckDuckGo", bang: "ddg", icon: duckduckgoIcon },
  {
    name: "Ecosia",
    bang: "ecosia",
    icon: ecosiaIcon,
    iconClass: "engine-select-icon-circle",
  },
  { name: "Yahoo", bang: "y", icon: yahooIcon },
  {
    name: "Yandex",
    bang: "yandex",
    icon: yandexIcon,
    iconClass: "engine-select-icon-rounded",
  },
  { name: "Brave", bang: "brave", icon: braveIcon },
  { name: "Kagi", bang: "kagi", icon: kagiIcon },
  {
    name: "Startpage",
    bang: "sp",
    icon: startpageIcon,
    iconClass: "engine-select-icon-rounded",
  },
  {
    name: "Qwant",
    bang: "qwant",
    icon: qwantIcon,
    iconClass: "engine-select-icon-rounded",
  },
  {
    name: "Mojeek",
    bang: "mojeek",
    icon: mojeekIcon,
    iconClass: "engine-select-icon-rounded",
  },
];

const isGoogleBang = (bang: string) => bang === "g" || bang === "gweb";

const isDuckDuckGoBang = (bang: string) => bang === "ddg" || bang === "html";

export class DefaultEngineSelector extends Component {
  readonly selector = "#default-engine-selector-slot";

  template() {
    return `
      <div class="setting-group">
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
        <label class="setting-engine-toggle" id="google-ai-setting" hidden>
          <input type="checkbox" id="google-ai-checkbox" />
          <span>Show Google AI search results</span>
        </label>
        <label class="setting-engine-toggle" id="ddg-ai-setting" hidden>
          <input type="checkbox" id="ddg-ai-checkbox" />
          <span>Show DuckDuckGo AI search results</span>
        </label>
      </div>
    `;
  }

  protected setup(root: HTMLElement) {
    const container = this.$<HTMLDivElement>("#default-browser-select", root);
    const googleAiSetting = this.$<HTMLLabelElement>(
      "#google-ai-setting",
      root
    );
    const googleAiCheckbox = this.$<HTMLInputElement>(
      "#google-ai-checkbox",
      root
    );
    const ddgAiSetting = this.$<HTMLLabelElement>("#ddg-ai-setting", root);
    const ddgAiCheckbox = this.$<HTMLInputElement>("#ddg-ai-checkbox", root);

    const trigger = this.$<HTMLButtonElement>(
      ".engine-select-trigger",
      container
    );
    const list = this.$<HTMLUListElement>(".engine-select-list", container);

    const googleEngine =
      ENGINE_OPTIONS.find((engine) => engine.bang === "g") ??
      ENGINE_OPTIONS[0]!;

    const duckDuckGoEngine =
      ENGINE_OPTIONS.find((engine) => engine.bang === "ddg") ??
      ENGINE_OPTIONS[0]!;

    const getEngine = (bang: string) => {
      if (isGoogleBang(bang)) return googleEngine;
      if (isDuckDuckGoBang(bang)) return duckDuckGoEngine;
      return (
        ENGINE_OPTIONS.find((engine) => engine.bang === bang) ?? googleEngine
      );
    };

    const iconClass = (engine: (typeof ENGINE_OPTIONS)[number]) =>
      ["engine-select-icon", engine.iconClass].filter(Boolean).join(" ");

    const updateGoogleAiSetting = (bang: string) => {
      const googleSelected = isGoogleBang(bang);
      googleAiSetting.hidden = !googleSelected;
      googleAiSetting.classList.toggle("is-visible", googleSelected);
      if (googleSelected) googleAiCheckbox.checked = bang === "g";
    };

    const updateDuckDuckGoAiSetting = (bang: string) => {
      const ddgSelected = isDuckDuckGoBang(bang);
      ddgAiSetting.hidden = !ddgSelected;
      ddgAiSetting.classList.toggle("is-visible", ddgSelected);
      if (ddgSelected) ddgAiCheckbox.checked = bang === "ddg";
    };

    const updateEngineToggles = (bang: string) => {
      updateGoogleAiSetting(bang);
      updateDuckDuckGoAiSetting(bang);
    };

    const renderTrigger = (engine: (typeof ENGINE_OPTIONS)[number]) => {
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

    const isEngineSelected = (engineBang: string, bang: string) => {
      if (engineBang === "g") return isGoogleBang(bang);
      if (engineBang === "ddg") return isDuckDuckGoBang(bang);
      return engineBang === bang;
    };

    let selectedBang = localStorage.getItem("default-bang") ?? "g";

    list.innerHTML = ENGINE_OPTIONS.map(
      (engine) => `
      <li>
        <button
          type="button"
          class="engine-select-option${
            isEngineSelected(engine.bang, selectedBang) ? " selected" : ""
          }"
          data-bang="${engine.bang}"
          role="option"
          aria-selected="${isEngineSelected(engine.bang, selectedBang)}"
        >
          <img src="${engine.icon}" alt="" class="${iconClass(engine)}" />
          <span>${engine.name}</span>
        </button>
      </li>
    `
    ).join("");

    renderTrigger(getEngine(selectedBang));
    updateEngineToggles(selectedBang);

    this.on(trigger, "click", () => {
      if (list.hidden) open();
      else close();
    });

    this.on(list, "click", (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        ".engine-select-option"
      );
      if (!button) return;

      const bang = button.dataset.bang!;
      const storedBang = bang === "g" ? "g" : bang === "ddg" ? "ddg" : bang;
      localStorage.setItem("default-bang", storedBang);
      selectedBang = storedBang;

      for (const option of list.querySelectorAll<HTMLButtonElement>(
        ".engine-select-option"
      )) {
        const optionBang = option.dataset.bang!;
        const isSelected = isEngineSelected(optionBang, storedBang);
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-selected", String(isSelected));
      }

      renderTrigger(getEngine(storedBang));
      updateEngineToggles(storedBang);
      close();
    });

    this.on(googleAiCheckbox, "change", () => {
      const bang = googleAiCheckbox.checked ? "g" : "gweb";
      localStorage.setItem("default-bang", bang);
      selectedBang = bang;
      updateEngineToggles(bang);
    });

    this.on(ddgAiCheckbox, "change", () => {
      const bang = ddgAiCheckbox.checked ? "ddg" : "html";
      localStorage.setItem("default-bang", bang);
      selectedBang = bang;
      updateEngineToggles(bang);
    });

    this.on(document, "click", (event) => {
      if (!container.contains(event.target as Node)) close();
    });

    this.on(document, "keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }
}
