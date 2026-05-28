export abstract class Component {
  abstract readonly selector: string;

  private cleanup = new AbortController();

  template() {
    return "";
  }

  mount(parent: ParentNode = document) {
    let root = parent.querySelector<HTMLElement>(this.selector);
    if (!root && parent instanceof HTMLElement && parent.matches(this.selector)) {
      root = parent;
    }
    if (!root) throw new Error(`Missing element: ${this.selector}`);

    const html = this.template();
    if (html) root.innerHTML = html;
    this.setup(root);
  }

  protected setup(_root: HTMLElement) {}

  protected on<K extends keyof HTMLElementEventMap>(
    target: EventTarget,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: Omit<AddEventListenerOptions, "signal">
  ) {
    target.addEventListener(type, handler as EventListener, {
      ...options,
      signal: this.cleanup.signal,
    });
  }

  protected $<T extends Element>(selector: string, root: ParentNode) {
    const el = root.querySelector<T>(selector);
    if (!el) throw new Error(`Missing element: ${selector}`);
    return el;
  }
}
