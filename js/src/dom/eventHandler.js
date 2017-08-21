/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/eventHandler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const TransitionEndEvent = {
  WebkitTransition : 'webkitTransitionEnd',
  MozTransition    : 'transitionend',
  OTransition      : 'oTransitionEnd otransitionend',
  transition       : 'transitionend'
}

// CustomEvent polyfill for IE (see: https://mzl.la/2v76Zvn)
if (typeof window.CustomEvent !== 'function') {
  const CustomEvent = (event, params) => {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
}

const EventHandler = {
  on(element, event, handler) {
    if (typeof event !== 'string' || typeof element === 'undefined') {
      return
    }
    element.addEventListener(event, handler, false)
  },

  one(element, event, handler) {
    const complete = () => {
      /* eslint func-style: off */
      handler()
      element.removeEventListener(event, complete, false)
    }
    EventHandler.on(element, event, complete)
  },

  trigger(element, event) {
    if (typeof event !== 'string' || typeof element === 'undefined') {
      return null
    }

    const eventToDispatch = new CustomEvent(event, {
      bubbles: true,
      cancelable: true
    })
    element.dispatchEvent(eventToDispatch)
    return eventToDispatch
  },

  getBrowserTransitionEnd() {
    if (window.QUnit) {
      return false
    }

    const el = document.createElement('bootstrap')
    for (const name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return {
          end: TransitionEndEvent[name]
        }
      }
    }
    return false
  }
}

export default EventHandler
