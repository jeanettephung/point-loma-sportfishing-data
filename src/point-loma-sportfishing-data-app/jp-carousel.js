import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';

/**
 * `jp-carousel`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class JpCarousel extends PolymerElement {
  static get template() {
    return html`
      <style>
      :host {       
        cursor: pointer;
        display: block;
        margin: 2rem 0;
        position: relative;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      }
      ::slotted(img) {
        border: 1px solid #5f5e5e;
        box-shadow: 0 8px 6px -6px #000000c9;
        height: inherit;
        width: 100%; 
      }
      ::slotted(*) {
        display: none;
        margin: 0 -2.5% 0 0;
        transition-duration: 0.15s;
        transition-property: display, height, opacity, width, z-index;
      }
      ::slotted(.active) {
        display: inline;
        height: 150px;
        opacity: var(--opacity-act, var(--opacity-gen-act, 1));
        order: 3;
        width: 53%;
        z-index: 15;
      }
      ::slotted(.prev-adj), ::slotted(.next-adj) {
        display: inline;
        height: 125px;
        opacity: var(--opacity-left-adj, var(--opacity-adj, var(--opacity-gen-left-adj, 0.9)));
        order: 2;
        width: 25%;
        z-index: 10;
      }
      ::slotted(.next-adj) {
        opacity: var(--opacity-right-adj, var(--opacity-adj, var(--opacity-gen-right-adj, 0.9)));
        order: 4;
      } 
      ::slotted(.prev-end), ::slotted(.next-end) {
        opacity: 0;
        width: 0;
      }
      slot {
        z-index: 10;
      }
      .button__container {
        align-items: center;
        display: flex;
        height: 10rem;
        position: relative;
        z-index: 15;
      }
      .button__container *:not(slot) {
        height: 10rem;
        position: absolute;
        width: 36%;
        z-index: 30;
      }
      .button--preview {
        width: 55%;
        left: 23%;
      }
      .caption__text {
        color: var(--caption-color, #464646);
        font-family: var(--caption-font-family, sans-serif);
        font-size: var(--caption-font-size, 1.4em);
        font-weight: var(--caption-font-weight, 400);
        text-align: center;
      }
      .indicator__container {
        display: flex;
        font-size: 0.624rem;
        justify-content: center;
        margin: 1rem auto;
      }
      .indicator:before {
        color: var(--indicator-color, black);
        content: '◯';
        margin: 0 0.15rem;
      }
      .indicator.active:before {
        bottom: 0.0625rem;
        color: var(--indicator-active, var(--indicator-color, black));
        content: '⬤';
        position: relative;
      }
      .preview__modal {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
        position: absolute;
        width: 100%;
      }
      .preview__img {
        border: 2px outset whitesmoke;
        max-height: 150%;
        max-width: 80%;
        opacity: 0;
        position: absolute;
        pointer-events: none;
        transition-duration: 0.5s;
        transition-property: opacity;
        z-index: 35;
      }
      .preview__img.active {
        opacity: 1;
        pointer-events: inherit;
      }
      .button--right {
        left: 78%;
      }
      @media only screen and (min-width: 480px) {
        ::slotted(*) {
          margin: 0 -5% 0 0;
          transition-duration: 0.5s;
        }
        ::slotted(.active) {
          width: 28%;
        }
        ::slotted(.prev-adj), ::slotted(.next-adj) {
          width: 25%;
        }
        ::slotted(.prev-end), ::slotted(.next-end) {
          display: inline;
          height: 100px;
          opacity: var(--opacity-left-end, var(--opacity-end, var(--opacity-gen-left-end, 0.75)));
          order: 1;
          width: 20%;
          z-index: 5;
        }
        ::slotted(.next-end) {
          opacity: var(--opacity-right-end, var(--opacity-end, var(--opacity-gen-right-end, 0.75)));
          order: 5;
        }
        .button--preview {
          width: 28%;
          left: 36%;
        }
        .button--right {
          left: 64%;
        }
      }
    </style>

    <div class="preview__modal">
      <img class="preview__img" src="" on-click="closePreview">
    </div>
    <div class="button__container">
      <div class="button--left" on-click="leftClick"></div>
      <div class="button--preview" on-click="activatePreview"></div>
      <div class="button--right" on-click="rightClick"></div>
      <slot></slot>
    </div>
    <div class="indicator__container"></div>
    <div class="caption">
      <p class="caption__text"></p>
    </div>
    `;
  }
  static get properties() {
    return {
      actPreview: Boolean,
      autoplay: Number,
      caption: Boolean,
      cur: {
        type: Number,
        value: 0
      },
      data: {
        type: Object,
        observer: 'init_data'
      },
      indicator: Boolean,
      pause: Number,
      preview: Boolean
    };
  }
  /**
   * Triggered when preview set to true of user clicks on current image.
   * Opens preview of current image.
   */
  activatePreview() {
    if (this.preview || this.actPreview) this.shadowRoot.querySelector('.preview__modal .preview__img').classList.add('active');
  }
  /**
   * Checks if autoplay is active.
   * If is active, autoplay is paused to not interfere with user interaction with carousel.
   */
  check_autoplay() {
    if (this.getAttribute('autoplay') !== null) {
      const _this = this;
      this.pause_autoplay(_this);
    }
  }
  /**
   * Triggered when user clicks on preview image.
   * Closes preview image.
   */
  closePreview(){
    this.shadowRoot.querySelector('.preview__modal .preview__img').classList.remove('active');
  }
  /**
   * Navigates through carousel in specified direction.
   * @param {string} direction: takes in value 'left' or 'right' to determine which
   *    direction to navigate carousel
   */
  directionClick(direction) {
    const items = this.children;
    if (items[this.cur]) {
      var active = items[this.cur];
      //Remove class indicating active, adjacent and end
      active.classList.remove('active');
      items[active.getAttribute('next')].classList.remove('next-adj');
      items[active.getAttribute('prev')].classList.remove('prev-adj');
      items[items[active.getAttribute('next')].getAttribute('next')].classList.remove('next-end');
      items[items[active.getAttribute('prev')].getAttribute('prev')].classList.remove('prev-end');
      //Set active based on direction
      if (direction == 'left') {
        this.cur = active.getAttribute('prev');
      }
      else if (direction == 'right') {
        this.cur = active.getAttribute('next');
      }
      //Add class indicating active, adjacent and end
      active = items[this.cur];
      active.classList.add('active');
      items[active.getAttribute('next')].classList.add('next-adj');
      items[active.getAttribute('prev')].classList.add('prev-adj');
      items[items[active.getAttribute('next')].getAttribute('next')].classList.add('next-end');
      items[items[active.getAttribute('prev')].getAttribute('prev')].classList.add('prev-end');
    }
    if (this.preview || this.activatePreview) {
      this.preview_click();
    }
    if (this.caption) this.update_caption();
  }
  /**
   * Creates custom shorthand css rules for --opacity (similiar to border, margin, etc.).
   * Ex. --opacity: 0.1 0.5 1 sets active=0.1, adjacent=0.5, and end=1.
   */
  css_opacity() {
    const opacity = getComputedStyle(this).getPropertyValue('--opacity');
    
    function setOpacity(_this, ov, o0, o1, o2, o3, o4) {
      const opacityGen = ['--opacity-gen-left-end', '--opacity-gen-left-adj', '--opacity-gen-act', '--opacity-gen-right-adj', '--opacity-gen-right-end'];
      for (var i = 0; i < opacityGen.length; i++)
        _this.style.setProperty(opacityGen[i], ov[arguments[2+i]]);
    }
    
    if (opacity) {
      const opacity_val = opacity.split(' ').filter(v=>v!='');
      if (opacity_val.length === 5) {
        setOpacity(this, opacity_val, 0, 1, 2, 3, 4);
      } else if (opacity_val.length === 3) {
        setOpacity(this, opacity_val, 2, 1, 0, 1, 2);
      } else if (opacity_val.length === 2) {
        setOpacity(this, opacity_val, 1, 1, 0, 1, 1);
      } else {
        setOpacity(this, opacity_val, 0, 0, 0, 0, 0);
      }
    }
  }
  /**
   * Initializes polymer element by 
   * - setting attributes for navigating carousel items (next, prev)
   * - inidicating which carousel items are active, adjacent, and end (used for css)
   * - applying custom css rules
   * - starting autoplay (if autoplay set to true)
   * - setting up preview and display preview (if preview set to true)
   * - displaying caption (if caption set to true)
   * - setup indicators (if indicator set to true)
   * @param {jp-carousel} _this
   */
  init(_this) {
    const items = this.children;
    const total = items.length;
    //Set attributes next and prev for each carousel item
    for (var i = 0; i < total; i++) {
      if (i==0) items[i].setAttribute('prev', total-1);
      else items[i].setAttribute('prev', i-1);
      if (i==total-1) items[i].setAttribute('next', 0);
      else items[i].setAttribute('next', i+1);
    }
    //Add classes indicating active, adjacent and end
    if (items[total-2]) items[total-2].classList.add('prev-end');
    if (items[total-1]) items[total-1].classList.add('prev-adj');
    if (items[0]) items[0].classList.add('active');
    if (items[1]) items[1].classList.add('next-adj');
    if (items[2]) items[2].classList.add('next-end');
    
    this.init_custom_css(_this);
    this.init_autoplay(_this);
    this.preview_click();
    
    if (this.actPreview) this.activatePreview();
    if (this.caption) this.update_caption();
    if (this.indicator) this.init_indicator();
  }
  /**
   * Initializes autoplay if set to true.
   * Creates a timer to automatically navigate through carousel.
   * @param {jp-carousel} _this 
   */
  init_autoplay(_this) {
    if (_this.getAttribute('autoplay') != null){
      var timer;
      if (this.autoplay === 0) timer = 1500;
      else timer = this.autoplay;
      if(!window.autoplay_interval){
        window.autoplay_interval = setInterval(function () {
          _this.directionClick('right');
        }, timer);
      }
    }
  }
  /**
   * Applies custom css to carousel.
   */
  init_custom_css() {
    this.css_opacity();
  }
  /**
   * Initilizes data (if given through data attribute) and creates carousel items.
   * Also sets caption (if set to true and provided).
   */
  init_data() {
    // Check null or if populated
    if (!this.data || this.children.length != 0)
      return;
    
    const data = this.data;
    const _this = this;
    for (var i = 0; i < data.length; i++) {
      var image_data = document.createElement('img');
      image_data.setAttribute('src', data[i].src);
      if (data[i].caption)
        image_data.setAttribute('caption', data[i].caption);
      _this.appendChild(image_data);
    }
    this.init(_this);
  }
  /**
   * Initializes indicator by creating an indicator per carousel item and
   * setting first carousel item as active.
   */
  init_indicator() {
    const items = this.children;
    var indicators = '';
    for (var i = 0; i < items.length; i++) {
      if (i === 0) indicators += '<span class="indicator active"></span>'
      else indicators += '<span class="indicator"></span>';
    }
    const indicatorRef = this.shadowRoot.querySelector('.indicator__container');
    indicatorRef.innerHTML = indicators;
  }
  /**
   * Triggered by user to navigate carousel to the left.
   */
  leftClick() {
    this.directionClick('left');
    this.check_autoplay();
    if (this.indicator) this.update_indicator('left');
  }
  /**
   * Temparily pauses carousel until no user interaction for default (5 sec) or pause_time (set by user).
   * @param {jp-carousel} _this 
   */
  pause_autoplay(_this) {
    clearInterval(window.autoplay_interval);
    window.autoplay_interval = undefined;
    var pause_time;
    if (this.pause) pause_time = this.pause;
    else pause_time = 5000;

    // Debounce function to prevent carousel from trying to start autoplay more than once
    this._debounce = Debouncer.debounce(this._debounce, timeOut.after(pause_time), () => {
      this.init_autoplay(_this);
    });
  }
  /**
   * Opens preview of active carousel item, or closes preview if open.
   */
  preview_click() {
    const items = this.children;
    if (items[this.cur])
      var curImage = items[this.cur].getAttribute('src');
    if (curImage)
      this.shadowRoot.querySelector('.preview__modal .preview__img').setAttribute('src', curImage)
  }
  /**
   * Updates caption to associated active carousel item's carousel.
   */
  update_caption() {
    const captionBox = this.shadowRoot.querySelector('.caption');
    const caption = captionBox.getElementsByTagName('p')[0];
    const items = this.children;
    if (items[this.cur]) 
      var active = items[this.cur];
    if (active) {
      var captionText = active.getAttribute('caption');
      caption.textContent = captionText;
    }
  }
  /** 
   * Updates the indicator to represent which carousel item is currently active.
   * @param {string} direction: direction in which user navigates carousel
   */
  update_indicator(direction) {
    const indicators = this.shadowRoot.querySelectorAll('.indicator__container .indicator');
    var removeIndex;
    // removes active class based on direction
    if (direction === 'left') {
      if (indicators[parseInt(this.cur)+1]) removeIndex = parseInt(this.cur)+1;
      else removeIndex = 0;
    } else {  // 'right'
      if (indicators[parseInt(this.cur)-1]) removeIndex = parseInt(this.cur)-1;
      else removeIndex = indicators.length-1;
    }
    indicators[removeIndex].classList.remove('active');
    
    // adds active class to active carousel item's associated indicator
    indicators[this.cur].classList.add('active');
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();
    
    const _this = this;
    if (this.data) this.init_data();
    else this.init(_this);
    
    var Observer = new MutationObserver(function(mutations) {
      mutations.forEach((mutation) => {
        if (mutation.oldValue != mutation.target.style.cssText) {
          _this.css_opacity();
        }
      });
    });
    
    Observer.observe(this, {attributes: true, attributeFilter: ['style'], attributeOldValue: true  });

  }
  /**
   * Navigate carousel to the left.
   */
  rightClick() {
    this.directionClick('right');
    this.check_autoplay();
    if (this.indicator) this.update_indicator('right');
  }
}

customElements.define('jp-carousel', JpCarousel);