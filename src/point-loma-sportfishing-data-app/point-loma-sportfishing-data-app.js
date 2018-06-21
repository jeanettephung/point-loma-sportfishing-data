import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement Homepage
 * @polymer
 */
class PointLomaSportfishingDataApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="bg__sky">
        <img src="boat">
      </div>
      <div class="bg__ocean>
        <jp-carousel></jp-carousel>
        <calendar-analysis></calendar-analysis>
      </div>
    `;
  }
  static get properties() {
    return {

    };
  }
}

window.customElements.define('point-loma-sportfishing-data-app', PointLomaSportfishingDataApp);
