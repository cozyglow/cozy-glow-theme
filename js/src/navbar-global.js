import { defineJQueryPlugin } from 'bootstrap/js/src/util';
import { getBreakpointWidth } from '@epickris/bootstrap-kit/js/src/util';
import Data from 'bootstrap/js/src/dom/data';
import EventHandler from 'bootstrap/js/src/dom/event-handler';
import SelectorEngine from 'bootstrap/js/src/dom/selector-engine';
import BaseComponent from 'bootstrap/js/src/base-component';
import Navbar from '@epickris/bootstrap-kit/js/src/navbar';
import _ from 'lodash';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'navbarGlobal';
const DATA_KEY = 'cg.navbar.global';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';

const NAVBAR_DATA_KEY = Navbar.DATA_KEY;
const NAVBAR_EVENT_KEY = `.${NAVBAR_DATA_KEY}`;

const EVENT_INPUT = `input${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;

const NAVBAR_EVENT_OPEN = `open${NAVBAR_EVENT_KEY}${EVENT_KEY}`;
const NAVBAR_EVENT_OPENED = `opened${NAVBAR_EVENT_KEY}${EVENT_KEY}`;
const NAVBAR_EVENT_CLOSE = `close${NAVBAR_EVENT_KEY}${EVENT_KEY}`;
const NAVBAR_EVENT_CLOSED = `closed${NAVBAR_EVENT_KEY}${EVENT_KEY}`;

const CLASS_NAME_NO_SCROLL = 'no-scroll';

const SELECTOR_NAVBAR_GLOBAL = '[data-navbar-global]';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_PREDICTIVE_SEARCH_DRAWER = '[data-predictive-search-drawer]';

const DATA_EXPAND_BREAKPOINT = 'expand-breakpoint';
const DATA_SEARCH_SUGGESTIONS_API = 'search-suggestions-api';

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class NavbarGlobal extends BaseComponent {
  constructor(element) {
    super(element);

    this._window = window;
    this._html = document.documentElement;
    this._body = document.body;
    this._navbarElement = SelectorEngine.find(SELECTOR_NAVBAR, this._element);
    this._predictiveSearchDrawer = SelectorEngine.find(SELECTOR_PREDICTIVE_SEARCH_DRAWER, this._element);
    this._predictiveSearchDrawerInput = SelectorEngine.find('input', this._predictiveSearchDrawer);

    this._addEventListeners();

    console.info('Successfully constructed global navbar.');
    console.debug(this._element);
  }

  // Getters

  static get DATA_KEY() {
    return DATA_KEY;
  }

  // Private

  _addEventListeners() {
    EventHandler.on(this._navbarElement, NAVBAR_EVENT_OPEN, this._onOpenNavbar.bind(this));
    EventHandler.on(this._navbarElement, NAVBAR_EVENT_OPENED, this._onOpenedNavbar.bind(this));
    EventHandler.on(this._navbarElement, NAVBAR_EVENT_CLOSE, this._onCloseNavbar.bind(this));
    EventHandler.on(this._navbarElement, NAVBAR_EVENT_CLOSED, this._onClosedNavbar.bind(this));

    EventHandler.on(this._predictiveSearchDrawerInput, EVENT_INPUT, _.debounce(this._onInputPredictiveSearchDrawer.bind(this), 200, {
      maxWait: 400
    }));
  }

  _expandBreakpoint() {
    return this._navbarElement.dataset.expandBreakpoint;
  }

  _searchSuggestionsApi() {
    return this._element.dataset._searchSuggestionsApi;
  }

  _onResize() {
    const expandBreakpoint = this._expandBreakpoint();

    if (!expandBreakpoint) {
      return;
    }

    const windowWidth = this._$window.scrollWidth;
    const breakpointWidth = getBreakpointWidth(expandBreakpoint);

    if (windowWidth >= breakpointWidth) {
      Navbar.navbarInterface(this._navbarElement, 'close');

      this._html.scrollTop(Math.ceil(this._navbarElement.scrollTop));
    }
  }

  _onOpenNavbar() {
    EventHandler.on(this._window, EVENT_RESIZE, this._onResize.bind(this));

    this._body.classList.add(CLASS_NAME_NO_SCROLL);
  }

  _onOpenedNavbar() {
    //
  }

  _onCloseNavbar() {
    EventHandler.off(this._window, EVENT_RESIZE);

    this._body.classList.remove(CLASS_NAME_NO_SCROLL);
  }

  _onClosedNavbar() {
    //
  }

  _onInputPredictiveSearchDrawer() {
    //
  }

  // Static

  static navbarGlobalInterface(element) {
    let data = Data.get(element, DATA_KEY);

    if (!data) {
      data = new NavbarGlobal(element);
    }
  }

  static _jQueryInterface() {
    return this.each(() => {
      this.navbarGlobalInterface(this);
    });
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  const navbarGlobals = SelectorEngine.find(SELECTOR_NAVBAR_GLOBAL);

  for (let index = 0, { length } = navbarGlobals; index < length; index++) {
    NavbarGlobal.navbarGlobalInterface(navbarGlobals[index], Data.get(navbarGlobals[index], DATA_KEY));
  }
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .NavbarGlobal to jQuery only if jQuery is present
 */

defineJQueryPlugin(NAME, NavbarGlobal);

export default NavbarGlobal;
