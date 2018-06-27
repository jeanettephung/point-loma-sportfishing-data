import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement Carousel to display items
 * @polymer
 */
class JpCarousel extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host { 
          --carousel-height: 6rem;
          --carousel-start: 4rem;
          --carousel--move: 8rem;
          display: block;  
        }
        .carousel__arrow { cursor:pointer; font-size:3.5rem; text-align:center; }
        .carousel__arrow:hover { color:#242b54; }
        .carousel__container { display:grid; height:var(--carousel-height); overflow:hidden; }
        .carousel__container--items { display:flex; flex-direction:row; justify-content:space-evenly; justify-items:center; }
        .carousel__container--main { align-items:center; background-color:#5d9cc3; border-radius:1.5rem; grid-gap:1.5rem; grid-template-columns:1fr 10fr 1fr;  padding:0.5rem; }
        ::slotted(img) { height:var(--carousel-height); margin:0 1rem; position:relative; opacity:0.75; right:-40rem; width:auto; }
      </style>

      <div class="carousel__container  carousel__container--main">
        <div class="carousel__arrow  carousel__arrow--left">⥼</div>
        <div class="carousel__container  carousel__container--items"><slot></slot></div>
        <div class="carousel__arrow  carousel__arrow--right">⥽</div>
      </div>
    `;
  }
  static get properties() {
    return {

    };
  }

  ready() {
    super.ready();
    
    console.log("children: ", this.children)
    this.carouselItems = this.children;

    // INIT arrow to calc right left --carousel-move
  }
}

window.customElements.define('jp-carousel', JpCarousel);
