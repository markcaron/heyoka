/* Making the most basic toggle Web Component possible */
/* Leaning on a simple input:checkbox switch UI */
export default class McRhythmToggle extends HTMLElement {
  constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      shadowRoot.innerHTML = `
          <style>
            *, *::before, *::after { box-sizing: border-box; }

            #container {
              display: inline-flex;
              align-items: center;
            }

            #switch {
              display: none; /* for smaller screens, where it's a single column anyway */

              @media (min-width: 48rem) {
                display: var(--mc-rhythm-toggle-display, inline-flex);
                flex-direction: var(--mc-rhythm-toggle-display-direction, row);
                gap: var(--mc-rhythm-toggle-display-gap, 0.25rem);
                align-items: var(--mc-rhythm-toggle-display-align, center);
                color: var(--color-text);
                font-size: var(--mc-rhythm-button-font-size, var(--font-size, 1rem));
                line-height: var(--mc-rhythm-button-light-height, var(--line-height, 1rem));
              }

              #label {
                font-size: var(--mc-rhythm-toggle-label-size, var(--font-size, 1rem));
                margin-inline-end: 1rem;
              }

              #slide-container {
                user-select: none;
                position: relative;
                display: flex;
                background: var(--color-background, #ffffff);
                color: var(--color-text, #151515);
                border: var(--border-width, 1px) solid var(--color-border, #4d4d4d);
                border-radius: var(--ui-border-radius, 3px);
                box-shadow: inset 0 0 2px rgba(0,0,0,.3);
                font-size: var(--mc-scheme-select-font-size, var(--font-size, 1rem));
                line-height: var(--mc-scheme-select-light-height, var(--line-height, 1rem)); 
                transition: background 0.1s ease-out;

                & > .option {
                  width: 50%;
                  padding: var(--ui-spacing-block, 0.4rem) calc(var(--ui-spacing-inline, 0.5rem) * 1.5);
                  text-align: center;
                  z-index: 2;
                }

                & > #slide {
                  position: absolute;
                  inset-inline-start: 0;
                  z-index: 1;
                  height: 100%;
                  width: 50%;
                  background: var(--color-tile-bg-hover, #d93f0f);
                  box-shadow: inset 0 1px 1px rgba(255,255,255,.4), 1px 0 1px rgba(0,0,0,.2);
                  border-inline-end: var(--border-width, 1px) solid var(--color-border, #4d4d4d);
                  border-inline-start: 0;
                  border-start-start-radius: calc(var(--ui-border-radius, 3px) - var(--border-width, 1px));
                  border-end-start-radius: calc(var(--ui-border-radius, 3px) - var(--border-width, 1px));
                  border-start-end-radius: 0;
                  border-end-end-radius: 0;
                  transition: all 0.1s ease-out;
                }

                & > #off {
                  color: var(--color-tile-text-hover, #ffffff);
                }
              }

              input {
                position: absolute;
                width: 1px;
                height: 1px;
                margin: -1px;
                padding: 0;
                overflow: hidden;
                clip: rect(0,0,0,0);
                border: 0;

                &:focus-visible ~ #slide-container {
                  outline-color: var(--color-link-focus-ring, #06c);
                  outline-offset: 3px;
                  outline-style: solid;
                  outline-width: 3px;
                  transition: none;
                }

                &:focus:not(:focus-visible) ~ #slide-container {
                  outline: none;
                }

                &:checked + #slide-container {
                  & > #slide {
                    inset-inline-start: 50%;
                    background: var(--color-link, #0066cc);
                    box-shadow: inset 0 1px 1px rgba(255,255,255,.4), -1px 0 1px rgba(0,0,0,.2);
                    border-inline-end: 0;
                    border-inline-start: var(--border-width, 1px) solid var(--color-border, #4d4d4d);
                    border-start-start-radius: 0;
                    border-end-start-radius: 0;
                    border-start-end-radius: calc(var(--ui-border-radius, 3px) - var(--border-width, 1px));
                    border-end-end-radius: calc(var(--ui-border-radius, 3px) - var(--border-width, 1px));
                  }

                  & > #on {
                    color: var(--color-cta-text-hover, #ffffff);
                  }

                  & > #off {
                    color: var(--color-text, #151515);
                  }
                }
              }
            }
          </style>
          <div id="container">
            <label id="switch">
              <span id="label" aria-label="Show/hide vertical rhythm">Rhythm</span>
              <input type="checkbox" name="rhythm">
              <span id="slide-container" aria-hidden="true">
                <span id="off" class="option">Off</span>
                <span id="on" class="option">On</span>
                <span id="slide"></span>
              </span>
            </label>
          </div>
      `;
  }

  connectedCallback() {
      this.updateToggle();
  }

  attributeChangedCallback(name, oldValue, newValue) {
      this.updateToggle();
  }

  updateToggle() {
    const rhythmButton = this.shadowRoot.querySelector('#switch > input');

    rhythmButton.addEventListener('click', function() {
      document.body.classList.toggle('horiz-rhythm');
    });
  }
}

customElements.define('mc-rhythm-toggle', McRhythmToggle);
