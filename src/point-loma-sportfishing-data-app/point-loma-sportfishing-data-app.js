import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement Homepage
 * @polymer
 */
class PointLomaSportfishingDataApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host { display:block; height:100vh; }
        .bg--ocean { background:linear-gradient(rgb(43, 137, 183) 5%, rgb(29, 74, 119) 35%, rgb(19, 12, 58) 90%); height:85%; }
        .bg--sky { background:linear-gradient(#95ceff, #ccc7c0); height:15%; }
        .container { margin:0 auto; width:1200px; }
        .container--grid { align-items:end; display:grid; grid-template-columns:1fr 2fr; grid-template-rows:15vh; }
        h1 { font-size:1.5rem; margin:0; text-align:center; }
        .img--boat { left:2rem; position:relative; width:7rem; }

        @media (min-width: 1200px){
          .bg--ocean { height:75%; }
          .bg--sky { height:25%; }
          .container--grid { grid-template-rows:25vh; }
        }

        @media (min-width: 768px){
          .container--grid { grid-template-columns:1fr 2fr 1fr; }
          h1 { font-size:2.5rem; }
          .img--boat { width:10rem; }
        }

        @media (max-width: 1200px){
          .container { width:100%; }
        }

        @media (max-width: 768px) and (min-width: 476px) {
          h1 { font-size:2rem; justify-self:start; }
        }

        @media (max-width: 476px) {
          h1 { font-size:1.5rem; }
        }
      </style>

      <div class="bg--sky">
        <div class="container  container--grid">
          <img class="img--boat" src="/assets/img/boat.png" alt="boat">
          <h1>Point Loma <br/> Sportfishing Data</h1>
        </div>
      </div>
      <div class="bg--ocean">
        <div class="container">
          <carousel></carousel>
          <calendar-analysis></calendar-analysis>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {

    };
  }
}

window.customElements.define('point-loma-sportfishing-data-app', PointLomaSportfishingDataApp);
