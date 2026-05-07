const styles = new CSSStyleSheet();
styles.replaceSync(`
  *, *::before, *::after { box-sizing: border-box; }

  :host {
    position: fixed;
    inset-inline-end: 1rem;
    inset-block-end: 1rem;
    z-index: 999;
  }

  #panel {
    display: none;
    align-items: flex-end;
    gap: 2rem;
    padding: 1.5rem;
    padding-block-start: 2.5rem;
    background: light-dark(rgba(255, 255, 255, 0.95), rgba(31, 31, 31, 0.85));
    border: var(--border-width, 1px) solid var(--color-border-subtle, #c7c7c7);
    border-radius: calc(var(--border-radius, 3px) * 2);
    box-shadow: var(--box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  }

  :host([open]) #panel {
    display: flex;
  }

  #toggle {
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: var(--border-width, 1px) solid var(--color-border-subtle, #c7c7c7);
    border-radius: calc(var(--border-radius, 3px) * 2);
    background: light-dark(rgba(255, 255, 255, 0.95), rgba(31, 31, 31, 0.85));
    box-shadow: var(--box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
    color: var(--color-text, #151515);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  :host([open]) #toggle {
    inset-block-start: 0.5rem;
    inset-inline-end: 0.5rem;
    inset-block-end: auto;
    width: 1.75rem;
    height: 1.75rem;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  #toggle:hover {
    opacity: 0.7;
  }

  #toggle:focus-visible {
    outline-color: var(--color-link-focus-ring, #0066cc);
    outline-offset: 3px;
    outline-style: solid;
    outline-width: 3px;
  }

  #toggle svg {
    width: 1rem;
    height: 1rem;
  }

  :host([open]) #toggle svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  @media print {
    :host {
      display: none;
    }
  }
`);

const template = document.createElement('template');
template.innerHTML = `
  <button id="toggle" aria-label="Toggle toolbar" aria-expanded="false">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" aria-hidden="true" id="icon-open">
      <path fill="currentColor" d="m1050 549.98h-159.42c-20.859-59.859-77.297-99.984-140.68-99.984-63.422 0-119.86 40.125-140.68 99.984h-459.24c-27.609 0-50.016 22.406-50.016 50.016s22.406 50.016 50.016 50.016h459.24c20.812 59.859 77.25 99.984 140.68 99.984 63.375 0 119.86-40.125 140.68-99.984h159.42c27.609 0 50.016-22.406 50.016-50.016s-22.406-50.016-50.016-50.016zm-300 99.984v0.046875c-20.203 0-38.438-12.188-46.172-30.891-7.7812-18.656-3.4688-40.172 10.828-54.469s35.812-18.609 54.469-10.828c18.703 7.7344 30.891 25.969 30.891 46.172-0.046875 27.609-22.406 49.969-50.016 50.016z"/>
      <path fill="currentColor" d="m150 300h150c2.9531-0.32812 5.8594-0.89062 8.6719-1.7344 20.25 60.422 76.688 101.34 140.44 101.72 63.75 0.42188 120.71-39.797 141.66-99.984h459.24c27.609 0 50.016-22.406 50.016-50.016s-22.406-49.969-50.016-49.969h-459.24c-20.953-60.234-77.906-100.41-141.66-100.03-63.75 0.42188-120.19 41.297-140.44 101.77-2.8125-0.84375-5.7188-1.4531-8.6719-1.7344h-150c-27.609 0-50.016 22.359-50.016 49.969s22.406 50.016 50.016 50.016zm300-99.984c20.203 0 38.438 12.188 46.172 30.844 7.7812 18.703 3.4688 40.219-10.828 54.516s-35.812 18.562-54.469 10.828c-18.703-7.7344-30.891-25.969-30.891-46.219 0.046875-27.609 22.406-49.969 50.016-49.969z"/>
      <path fill="currentColor" d="m150 999.98h150c2.9531-0.28125 5.8594-0.89062 8.6719-1.7344 20.25 60.469 76.688 101.34 140.44 101.77 63.75 0.375 120.71-39.797 141.66-100.03h459.24c27.609 0 50.016-22.359 50.016-49.969s-22.406-50.016-50.016-50.016h-459.24c-20.953-60.188-77.906-100.41-141.66-99.984-63.75 0.375-120.19 41.297-140.44 101.72-2.8125-0.84375-5.7188-1.4062-8.6719-1.7344h-150c-27.609 0-50.016 22.406-50.016 50.016s22.406 49.969 50.016 49.969zm300-99.984c20.203 0 38.438 12.188 46.172 30.844 7.7812 18.703 3.4688 40.219-10.828 54.516s-35.812 18.562-54.469 10.828c-18.703-7.7344-30.891-25.969-30.891-46.172 0.046875-27.609 22.406-49.969 50.016-50.016z"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" aria-hidden="true" id="icon-close" style="display:none">
      <path fill="currentColor" d="m909.5 372-309.5 309.38-309.5-309.38c-19.145-17.836-46.199-24.41-71.391-17.34-25.191 7.0703-44.879 26.758-51.949 51.949-7.0703 25.191-0.49609 52.246 17.34 71.391l362.5 362.5c14.062 14.047 33.125 21.934 53 21.934s38.938-7.8867 53-21.934l362.5-362.5c17.836-19.145 24.41-46.199 17.34-71.391-7.0703-25.191-26.758-44.879-51.949-51.949-25.191-7.0703-52.246 0.49609-71.391 17.34z"/>
    </svg>
  </button>
  <div id="panel">
    <slot></slot>
  </div>
`;

export default class McToolbar extends HTMLElement {
  #abortController;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.adoptedStyleSheets = [styles];
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#abortController = new AbortController();
    const toggle = this.shadowRoot.querySelector('#toggle');
    const iconOpen = this.shadowRoot.querySelector('#icon-open');
    const iconClose = this.shadowRoot.querySelector('#icon-close');

    try {
      const saved = localStorage.getItem('toolbar-open');
      if (saved === 'true') {
        this.setAttribute('open', '');
      }
    } catch { /* localStorage unavailable */ }

    this.#updateIcons(iconOpen, iconClose);

    toggle.addEventListener('click', () => {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      } else {
        this.setAttribute('open', '');
      }
      this.#updateIcons(iconOpen, iconClose);
      toggle.setAttribute('aria-expanded', this.hasAttribute('open'));
      try {
        localStorage.setItem('toolbar-open', this.hasAttribute('open'));
      } catch { /* storage full or unavailable */ }
    }, { signal: this.#abortController.signal });
  }

  disconnectedCallback() {
    this.#abortController.abort();
  }

  #updateIcons(openIcon, closeIcon) {
    const isOpen = this.hasAttribute('open');
    openIcon.style.display = isOpen ? 'none' : '';
    closeIcon.style.display = isOpen ? '' : 'none';
  }
}

customElements.define('mc-toolbar', McToolbar);
