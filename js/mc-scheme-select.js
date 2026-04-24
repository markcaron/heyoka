/* Making the most basic Web Component possible by harnessing the native Customizable Select API */
/* Someday Firefox and Safari will catch up */

const styles = new CSSStyleSheet();
styles.replaceSync(`
  *, *::before, *::after { box-sizing: border-box; }

  #container {
    display: var(--mc-scheme-select-display, inline-flex);
    flex-direction: var(--mc-scheme-select-display-direction, row);
    gap: var(--mc-scheme-select-display-gap, 0.25rem);
    align-items: var(--mc-scheme-select-display-align, center);
  }

  label {
    font-size: var(--mc-scheme-select-label-size, var(--font-size, 1rem));
    margin-inline-end: 1rem;
  }

  select,
  ::picker(select) {
    appearance: base-select;
  }

  select {
    display: inline-flex;
    align-items: center;
    min-width: var(--mc-scheme-select-min-width, auto);
    border: var(--border-width, 1px) solid var(--color-border, #4d4d4d);
    border-radius: var(--ui-border-radius, 3px);
    font-size: var(--mc-scheme-select-font-size, var(--font-size, 1rem));
    line-height: var(--mc-scheme-select-light-height, var(--line-height, 1rem));

    &::picker-icon {
      display: none;
    }

    .picker-icon {
      margin-inline-start: auto;
      width: 0.6rem;
      height: 0.6rem;
      transition: 0.2s rotate;
    }

    &:open {
      .picker-icon {
        rotate: 180deg;
      }
    }
  }

  select,
  option {
    padding: var(--ui-spacing-block, 0.4rem) var(--ui-spacing-inline, 0.5rem);

    &:hover {
      background: var(--color-background-subtle, #e0e0e0);
    }

    &:is(*, :hover):focus-visible {
      outline-color: var(--color-link-focus-ring, #0066cc);
      outline-offset: 3px;
      outline-style: solid;
      outline-width: 3px;
      border-radius: 2px;
      transition: none;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  selectedcontent,
  option {
    display: flex;
    align-items: center;
    gap: var(--ui-spacing-inline);
  }

  selectedcontent {
    .checkmark {
      display: none;
    }
  }

  ::picker(select) {
    margin-block: 2px;
    border: 1px solid var(--color-border-subtle, #c7c7c7);
    border-radius: var(--ui-border-radius, 3px);
    background: var(--color-background, #ffffff);
    box-shadow: var(--box-shadow-md, 0 4px 6px 1px rgba(21, 21, 21, 0.25));
    overflow: visible;
  }

  option {
    min-width: 8em;
    transition: 0.4s;

    &::checkmark {
      display: none;
    }

    /* SVG used as a faux ::checkmark in order to handle light-dark more easily */
    .checkmark {
      display: none;
      margin-inline-start: auto;
      order: 3;
      width: 0.8rem;
      height: 0.8rem;
    }

    &:checked {
      .checkmark {
         display: inline-block;
      }
    }
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    border: 0;
  }
`);

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="visually-hidden">
      <symbol id="scheme-system" viewBox="0 0 32 32">
        <path fill="var(--color-text)" d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2Zm0 26C9.383 28 4 22.617 4 16S9.383 4 16 4s12 5.383 12 12-5.383 12-12 12Zm9-12a9 9 0 0 1-8.738 8.996.259.259 0 0 1-.262-.257V7.26c0-.142.12-.261.262-.257A9 9 0 0 1 25 15.999Z"/>
      </symbol>
      <symbol id="scheme-light" viewBox="0 0 32 32">
        <path fill="var(--color-text)" d="M16 7c-4.963 0-9 4.038-9 9s4.037 9 9 9 9-4.038 9-9-4.037-9-9-9Zm0 16c-3.859 0-7-3.14-7-7s3.141-7 7-7 7 3.14 7 7-3.141 7-7 7ZM15 4V1a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0Zm2 24v3a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0Zm15-12a1 1 0 0 1-1 1h-3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1ZM4 17H1a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm3.707 7.293a.999.999 0 0 1 0 1.414l-2 2a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l2-2a.999.999 0 0 1 1.414 0ZM24.293 7.707a.999.999 0 0 1 0-1.414l2-2a.999.999 0 1 1 1.414 1.414l-2 2a.997.997 0 0 1-1.414 0Zm-20-2a.999.999 0 1 1 1.414-1.414l2 2a.999.999 0 1 1-1.414 1.414l-2-2Zm23.414 20.586a.999.999 0 1 1-1.414 1.414l-2-2a.999.999 0 1 1 1.414-1.414l2 2Z"/>
      </symbol>
      <symbol id="scheme-dark" viewBox="0 0 32 32">
        <path fill="var(--color-text)" d="M16 29C8.832 29 3 23.168 3 16a12.98 12.98 0 0 1 8.82-12.307.999.999 0 0 1 1.265 1.275A10.735 10.735 0 0 0 12.5 8.5c0 6.065 4.935 11 11 11 1.226 0 2.414-.197 3.532-.585a1 1 0 0 1 1.275 1.265A12.981 12.981 0 0 1 16 29ZM10.672 6.375A10.985 10.985 0 0 0 5 16c0 6.065 4.935 11 11 11 4.056 0 7.718-2.216 9.625-5.672a13.01 13.01 0 0 1-2.125.172c-7.168 0-13-5.832-13-13 0-.72.058-1.43.172-2.125Z"/>
      </symbol>
      <symbol id="picker-icon" viewBox="0 0 20 20">
        <path fill="var(--color-text)" d="M18.71 5.29a.996.996 0 0 0-1.41 0l-7.29 7.29-7.3-7.29a.987.987 0 0 0-1.41-.02.987.987 0 0 0-.02 1.41l.02.02 7.65 7.65c.29.29.68.44 1.06.44s.77-.15 1.06-.44l7.65-7.65a.996.996 0 0 0 0-1.41Z"/>
      </symbol>
      <symbol id="checkmark" viewBox="0 0 20 20">
        <path fill="var(--color-text)" d="M18.71 4.27c-.4-.38-1.03-.37-1.41.02L7 14.59 2.71 10.3l-.02-.02c-.4-.38-1.03-.37-1.41.02-.38.4-.37 1.03.02 1.41l4.65 4.65a1.499 1.499 0 0 0 2.12 0L18.72 5.71l.02-.02c.38-.4.37-1.03-.02-1.41Z"/>
      </symbol>
    </svg>
    <label for="scheme-select">Color scheme</label>
    <select id="scheme-select">
        <button>
          <selectedcontent></selectedcontent>
          <svg class="picker-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#picker-icon"></use>
          </svg>
        </button>
        <option value="">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
            <use href="#scheme-system"></use>
          </svg>
          System
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#checkmark"></use>
          </svg>
        </option>
        <option value="light">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
            <use href="#scheme-light"></use>
          </svg>
          Light
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#checkmark"></use>
          </svg>
        </option>
        <option value="dark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
            <use href="#scheme-dark"></use>
          </svg>
          Dark
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#checkmark"></use>
          </svg>
        </option>
    </select>
  </div>
`;

export default class McSchemeSelect extends HTMLElement {
  static formAssociated = true;

  #abortController;
  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.adoptedStyleSheets = [styles];
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#abortController = new AbortController();
    const schemePicker = this.shadowRoot.querySelector('#scheme-select');

    try {
      const saved = localStorage.getItem('color-scheme');
      if (saved !== null) {
        schemePicker.value = saved;
        this.applyScheme(saved);
      }
    } catch { /* localStorage unavailable */ }

    schemePicker.addEventListener('change', () => {
      const value = schemePicker.value;
      this.applyScheme(value);
      this.#internals.setFormValue(value);
      try {
        localStorage.setItem('color-scheme', value);
      } catch { /* storage full or unavailable */ }
    }, { signal: this.#abortController.signal });

    this.#internals.setFormValue(schemePicker.value);
  }

  disconnectedCallback() {
    this.#abortController.abort();
  }

  applyScheme(scheme) {
    if (scheme !== '') {
      document.documentElement.style.colorScheme = 'only ' + scheme;
    } else {
      document.documentElement.style.colorScheme = 'light dark';
    }
  }
}

customElements.define('mc-scheme-select', McSchemeSelect);
