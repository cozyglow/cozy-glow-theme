import $ from 'jquery';
import Util from '@epickris/bootstrap-kit/js/util';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'navbarGlobal';
const VERSION = '0.0.1';
const DATA_KEY = 'cg.navbar.global';
const DATA_KEY_NAVBAR = 'bs.navbar';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_KEY_NAVBAR = `.${DATA_KEY_NAVBAR}`;
const DATA_API_KEY = '.data-api';
const JQUERY_NO_CONFLICT = $.fn[NAME];

const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_OPEN_NAVBAR = `open${EVENT_KEY_NAVBAR}${EVENT_KEY}`;
const EVENT_OPEN_NAVBAR_DATA_API = `${EVENT_OPEN_NAVBAR}${DATA_API_KEY}`;
const EVENT_OPENED_NAVBAR = `opened${EVENT_KEY_NAVBAR}${EVENT_KEY}`;
const EVENT_OPENED_NAVBAR_DATA_API = `${EVENT_OPENED_NAVBAR}${DATA_API_KEY}`;
const EVENT_CLOSE_NAVBAR = `close${EVENT_KEY_NAVBAR}${EVENT_KEY}`;
const EVENT_CLOSE_NAVBAR_DATA_API = `${EVENT_CLOSE_NAVBAR}${DATA_API_KEY}`;
const EVENT_CLOSED_NAVBAR = `closed${EVENT_KEY_NAVBAR}${EVENT_KEY}`;
const EVENT_CLOSED_NAVBAR_DATA_API = `${EVENT_CLOSED_NAVBAR}${DATA_API_KEY}`;

const CLASS_NAME_NO_SCROLL = 'no-scroll';

const SELECTOR_DATA_NAVBAR = '[data-navbar-global]';
const SELECTOR_NAVBAR = '.navbar';

const DATA_EXPAND_BREAKPOINT = 'expand-breakpoint';
const DATA_SEARCH_SUGGESTIONS_API = 'search-suggestions-api';

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class NavbarGlobal {
  constructor(element) {
    this._$window = $(window);
    this._$html = $(document.documentElement);
    this._$body = $(document.body);
    this._$element = $(element);
    this._$navbarElement = this._$element.find(SELECTOR_NAVBAR);

    this._$navbarElement.on(EVENT_OPEN_NAVBAR_DATA_API, this._onOpenNavbar.bind(this));
    this._$navbarElement.on(EVENT_OPENED_NAVBAR_DATA_API, this._onOpenedNavbar.bind(this));
    this._$navbarElement.on(EVENT_CLOSE_NAVBAR_DATA_API, this._onCloseNavbar.bind(this));
    this._$navbarElement.on(EVENT_CLOSED_NAVBAR_DATA_API, this._onClosedNavbar.bind(this));

    console.info('Successfully constructed global navbar.');
  }

  // Getters

  static get VERSION() {
    return VERSION;
  }

  // Private

  _expandBreakpoint() {
    return this._$navbarElement.data(DATA_EXPAND_BREAKPOINT);
  }

  _searchSuggestionsApi() {
    return this._$element.data(DATA_SEARCH_SUGGESTIONS_API);
  }

  _onResize() {
    const expandBreakpoint = this._expandBreakpoint();

    if (!expandBreakpoint) {
      return;
    }

    const windowWidth = this._$window.width();
    const breakpointWidth = Util.getBreakpointWidth(expandBreakpoint);

    if (windowWidth >= breakpointWidth) {
      this._$navbarElement.navbar('close');

      this._$html.animate({
        scrollTop: Math.ceil($(this._$navbarElement).position().top)
      });
    }
  }

  _onOpenNavbar() {
    this._$window.on(EVENT_RESIZE, this._onResize.bind(this));

    this._$body.addClass(CLASS_NAME_NO_SCROLL);
  }

  _onOpenedNavbar() {
    //
  }

  _onCloseNavbar() {
    this._$window.off(EVENT_RESIZE);

    this._$body.removeClass(CLASS_NAME_NO_SCROLL);
  }

  _onClosedNavbar() {
    //
  }

  // Static

  static _jQueryInterface() {
    return this.each(() => {
      const $element = $(this);
      let data = $element.data(DATA_KEY);

      if (!data) {
        data = new NavbarGlobal(this);
        $element.data(DATA_KEY, data);
      }
    });
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(() => {
  $(SELECTOR_DATA_NAVBAR).navbarGlobal();
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = NavbarGlobal._jQueryInterface;
$.fn[NAME].Constructor = NavbarGlobal;
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return NavbarGlobal._jQueryInterface;
};

export default NavbarGlobal;
