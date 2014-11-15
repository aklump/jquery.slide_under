/**
 * Underlayer Slide jQuery JavaScript Plugin v0.0.1
 * http://www.intheloftstudios.com/packages/jquery/jquery.underlayer_slide
 *
 * Plugin to register an under layer that slides out from under a container when triggered.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Sat Nov 15 08:57:11 PST 2014
 *
 * Helper css classes applied by this plugin (all are prefixed):
 *
 * On the underlayer element:
 * - underlayer
 * - visible
 * - showing
 * - hiding
 *
 * On the toggle element:
 * - toggle
 * - active
 *
 * On the wrapper element:
 * - wrapper
 * - processed
 *
 * @license
 */
;(function($, window, document, undefined) {
"use strict";

var underlayer = {};
underlayer.css = {};
underlayer.css.hidden = {
  "position": "absolute",
  "bottom": 0,
  "display": "none"
};
underlayer.css.visible = {
  "position": "static",
  "display": "block",
};
underlayer.style = '';

// The actual plugin constructor
function UnderlayerSlide(element, options) {
  this.class      = 'UnderlayerSlide';
  this.element    = element;
  this.$wrapper   = $(element);
  this.$toggle    = $(options.toggle);
  this.$under     = $(options.under);
  this.options    = $.extend( {}, $.fn.underlayerSlide.defaults, options) ;
  this._defaults  = $.fn.underlayerSlide.defaults;
  
  this.init();
}

UnderlayerSlide.prototype.toString = function() {
  return this.class;
};

UnderlayerSlide.prototype.init = function () {
  // Place initialization logic here
  // You already have access to the DOM element and
  // the options via the instance, e.g. this.element 
  // and this.options
  var obj = this;
  var p   = this.options.cssPrefix;

  $(obj.element)
  .addClass(p + 'wrapper ' + p + 'processed');

  this.$toggle
  .addClass(p + 'toggle')
  .removeClass(p + 'active')
  .click(function () {
    obj.toggle();
  });

  // Capture the original style attribute value destroy method.
  underlayer.style = this.$under.attr('style');

  this.$under
  .addClass(p + 'underlayer')
  .removeClass(p + 'visible')
  .css(underlayer.css.hidden);
};

UnderlayerSlide.prototype.destroy = function () {
  var p = this.options.cssPrefix;
  this.$wrapper
  .removeClass(p + 'wrapper')
  .removeClass(p + 'processed')
  .removeData('plugin_underlayerSlide');

  this.$toggle
  .removeClass(p + 'toggle ' + p + 'active')
  .unbind('click');

  this.$under
  .removeData(p + 'style')
  .removeClass(p + 'underlayer ' + p + 'visible');

  if (typeof underlayer.style === 'undefined') {
    this.$under.removeAttr('style');
  }
  else {
    this.$under.attr('style', underlayer.style);  
  }
};

UnderlayerSlide.prototype.toggle = function() {
  var p         = this.options.cssPrefix;
  var visible   = this.$under.hasClass(p + 'visible');
  return visible ? this.hide() : this.show();
};

UnderlayerSlide.prototype.show = function() {
  var self      = this;
  var p         = this.options.cssPrefix;

  self.options.beforeShow(self);
  self.$toggle.addClass(p + 'active');
  self.$under.addClass(p + 'showing');

  /**
   * A function that should be called when showing has completed.
   *
   * @var function
   */
  var callback = function () {
    self.$under
    .addClass(p + 'visible')
    .removeClass(p + 'showing');
    self.options.afterShow(self);
  }

  // Custom show function.
  if (typeof self.options.show === "function") {
    return self.options.show(self, callback);
  }

  // The default showing.
  else {
    self.$under.css(underlayer.css.visible);
    callback();
  }

  return self;
};

UnderlayerSlide.prototype.hide = function() {
  var self      = this;
  var p         = self.options.cssPrefix;

  self.options.beforeHide(self);
  self.$toggle.removeClass(p + 'active');
  self.$under.addClass(p + 'hiding');

  /**
   * A function that should be called when showing has completed.
   *
   * @var function
   */
  var callback = function () {
    self.$under
    .removeClass(p + 'visible')
    .removeClass(p + 'hiding');
    self.options.afterHide(self);
  };

  // Custom hide function.
  if (typeof self.options.hide === "function") {
    return self.options.hide(self, callback);
  }

  // The default showing.
  else {
    self.$under.css(underlayer.css.hidden);
    callback();
  }

  return self;
};

$.fn.underlayerSlide = function(options) {
  return this.each(function () {
    if (options === 'destroy') {
      var obj = $.data(this, 'plugin_underlayerSlide');
      if (obj && typeof obj.destroy !== 'undefined') {
        obj.destroy();
      }
    }
    else {
      $.data(this, 'plugin_underlayerSlide', new UnderlayerSlide(this, options));  
    }
  });
};

$.fn.underlayerSlide.defaults = {
  
  /**
   * Defines the selector for the toggle element.
   *
   * @var string
   */
  "toggle"            : null,

  /**
   * Defines the selector for the underlayer element.
   *
   * @var string
   */
  "under"             : null,
  
  /**
   * Defines the direction the underlayer will travel when exposed.
   *
   * Valid options are: down. 
   *
   * @var type
   */
  "direction"         : "down",

  /**
   * A function to call before the showing begins.
   *
   * @var function
   */
  "beforeShow"        : function(instance) {},

  /**
   * A function to call AFTER the showing has completed.
   *
   * @var function
   */
  "afterShow"         : function(instance) {},

  /**
   * Defines a custom function to be used instead of the default for EXPOSING
   * the underlayer.
   *
   * Receives the UnderlayerSlide object and a function to apply after the
   * exposition has completed.  You MUST call that second function at some
   * point when using this feature.
   *
   * @var function
   */
  "show"              : null,

  /**
   * A function to call before the hiding begins.
   *
   * @var function
   */
  "beforeHide"        : function(instance) {},

  /**
   * A function to call AFTER the hiding has completed.
   *
   * @var function
   */  
  "afterHide"         : function(instance) {},

  /**
   * Defines a custom function to be used instead of the default for HIDING
   * the underlayer.
   *
   * @var function
   */  
  "hide"              : null,
  
  /**
   * Defines the css prefix to use for all classes applied by plugin.
   *
   * @var string
   */
  "cssPrefix"         : 'uls-'  
};

/**
 * Returns the version of this plugin.
 *
 * @return {string}
 */
$.fn.underlayerSlide.version = function() { return '0.0.1'; };

})(jQuery, window, document);