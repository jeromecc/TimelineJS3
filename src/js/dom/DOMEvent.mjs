/*	DOMEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
import { Draggable } from "../ui/Draggable.mjs"
import { touch as BROWSER_TOUCH } from "../core/Browser.mjs";
import { stamp } from "../core/Util.mjs"

var DOMEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = stamp(fn),
            key = "_tl_" + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || DOMEvent._getEvent());
		};

		if (BROWSER_TOUCH && type === "dblclick" && this.addDoubleTapListener) {
            this.addDoubleTapListener(obj, handler, id);
        } else if ("addEventListener" in obj) {
            if (type === "mousewheel") {
                obj.addEventListener("DOMMouseScroll", handler, false);
                obj.addEventListener(type, handler, false);
            } else if (type === "mouseenter" || type === "mouseleave") {
                var originalHandler = handler,
                    newType = type === "mouseenter" ? "mouseover" : "mouseout";
                handler = function(e) {
                    if (!DOMEvent._checkMouse(obj, e)) {
                        return;
                    }
                    return originalHandler(e);
                };
                obj.addEventListener(newType, handler, false);
            } else {
                obj.addEventListener(type, handler, false);
            }
        } else if ("attachEvent" in obj) {
            obj.attachEvent("on" + type, handler);
        }

		obj[key] = handler;
	},

	removeListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = stamp(fn),
            key = "_tl_" + type + id,
            handler = obj[key];

		if (!handler) {
			return;
		}

		if (BROWSER_TOUCH && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	},

	/*jshint noarg:false */ // evil magic for IE
	_getEvent: function () {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},
	/*jshint noarg:false */

	stopPropagation: function (/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	
	disableClickPropagation: function (/*HTMLElement*/ el) {
		DOMEvent.addListener(el, Draggable.START, DOMEvent.stopPropagation);
		DOMEvent.addListener(el, "click", DOMEvent.stopPropagation);
		DOMEvent.addListener(el, "dblclick", DOMEvent.stopPropagation);
	},

	preventDefault: function (/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	stop: function (e) {
		DOMEvent.preventDefault(e);
		DOMEvent.stopPropagation(e);
	},


	getWheelDelta: function (e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
};

export { DOMEvent }
