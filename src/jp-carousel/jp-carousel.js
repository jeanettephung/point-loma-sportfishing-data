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
          --carousel-right: 0;
          display: block;  
        }
        .carousel__arrow { cursor:pointer; font-size:3.5rem; text-align:center; }
        .carousel__arrow:hover { color:#242b54; }
        .carousel__container { display:grid; height:6rem; overflow:hidden; }
        .carousel__container--items { display:flex; justify-content:flex-start; justify-items:center; }
        .carousel__container--main { align-items:center; background-color:#5d9cc3; border-radius:1.5rem; grid-template-columns:7rem auto 7rem;  padding:0.5rem; }
        ::slotted(img) { height:auto; margin:0 2rem; position:relative; opacity:0.75; right:var(--carousel-right); transition:all ease-in-out 0.5s; width:6rem; }
      </style>

      <div class="carousel__container  carousel__container--main">
        <div class="carousel__arrow  carousel__arrow--left">⥼</div>
        <slot class="carousel__container  carousel__container--items"></slot>
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
    
    // stored variables
    this.$arrowLeft = this.shadowRoot.querySelector('.carousel__arrow--left');
    this.$arrowRight = this.shadowRoot.querySelector('.carousel__arrow--right');
    this.curPosition = 0;
    this.shiftAmount = 10;

    console.log(this.children);
    
    // initiations
    this._initArrows();
    this._initResize();
  }

  //  /**
  //  * @description Calculates the shift amount for carousel items
  //  * @private
  //  * TODO
  //  */
  // _calcMoveVar() {
  //   const style = window.getComputedStyle(this.children[0]);
  //   setTimeout(function() {
  //     this.shiftAmount = (2 * style.marginLeft.replace('px', '')) + style.width.replace('px', '');
  //     console.log("shift: ", this.shiftAmount);
  //   });
  // }

  /**
   * @description Add event listeners to arrow to navigate carousel
   * @private
   */
  _initArrows() {
    this.$arrowLeft.addEventListener('click', () => this._navigateCarousel('left'));
    this.$arrowRight.addEventListener('click', () => this._navigateCarousel('right'));
  }

  /**
   * @description Add resize event listeners
   * @private
   */
  _initResize() {
    // this._calcMoveVar();
  }

  /**
   * @description Calculates position to shift image based on direction.
   *   On edges, moves image from opposite end to give impression that carousel wraps.
   * @argument {String} direction - left | right
   * @private
   */
  _navigateCarousel(direction) {
    var shift = (this.curPosition);
    
    var curPosition = direction==='left' ? this.curPosition+this.shiftAmount : this.curPosition-this.shiftAmount;
    this.style.setProperty('--carousel-right', (this.curPosition) + 'rem');

    setTimeout(function() {
      const $app = document.querySelector('point-loma-sportfishing-data-app');
      const $carousel = $app.shadowRoot.querySelector('jp-carousel');
      if (direction === 'left') {
        const removeItem =  $carousel.removeChild( $carousel.children[0]);
        $carousel.append(removeItem);
        shift = '-10rem';
      } else {
        const removeItem =  $carousel.removeChild( $carousel.children[ $carousel.children.length-1]);
        $carousel.prepend(removeItem);
        shift = '10rem'
      }
      $carousel.style.setProperty('--carousel-right', -(curPosition) + 'rem');
    }, 500);
    // setTimeout(function() {
    //   console.log(shift);
    //   const $app = document.querySelector('point-loma-sportfishing-data-app');
    //   const $carousel = $app.shadowRoot.querySelector('jp-carousel');
      // this.style.setProperty('--carousel-right', shift + '10rem');
    // }, 100)
  }


}

window.customElements.define('jp-carousel', JpCarousel);
