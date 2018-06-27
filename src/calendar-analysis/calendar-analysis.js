import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement Data displayed in calendar
 * @polymer
 */
class CalendarAnalysis extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host { display: block; }
      </style>
      <div class="calendar__month"></div>
      <div class="calendar__body">
        <div class="calendar__header"></div>
        <div class="calendar__days"></div>
      </div>
    `;
  }
  static get properties() {
    return {

    };
  }
}

window.customElements.define('calendar-analysis', CalendarAnalysis);
