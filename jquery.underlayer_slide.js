/**
 * Underlayer Slide jQuery JavaScript Plugin v1.0 version }}
 * http://www.intheloftstudios.com/packages/jquery/jquery.underlayer_slide
 *
 * Plugin to register an under layer that slides out from under a container when triggered.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Sat Nov 15 08:49:58 PST 2014
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
  "display": "block"
};
underlayer.style = '';

// The actual plugin constructor
function UnderlayerSlide(element, options) {
  this.class      = 'UnderlayerSlide';
  this.version    = '0.0.1';
  this.element    = element;
  this.$wrapper   = $(element);
  this.$toggle    = $(options.toggle);
  this.$under     = $(options.under);

  // jQuery has an extend method that merges the 
  // contents of two or more objects, storing the 
  // result in the first object. The first object 
  // is generally empty because we don't want to alter 
  // the default options for future instances of the plugin
  this.options = $.extend( {}, $.fn.underlayerSlide.defaults, options) ;
  
  this._defaults = $.fn.underlayerSlide.defaults;
  // this._name = 'underlayerSlide';
  
  this.init();
}

UnderlayerSlide.prototype.toString = function() {
  return this.class;
}

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
  this.$under.toggleClass(p + 'visible');
  this.$toggle.toggleClass(p + 'active');

  return visible ? this.hide() : this.show();
};

UnderlayerSlide.prototype.show = function() {
  if (typeof this.options.show === "function") {
    return this.options.show(this);
  }

  // The default showing.
  this.$under.css(underlayer.css.visible);

  return this;
};

UnderlayerSlide.prototype.hide = function() {
  if (typeof this.options.hide === "function") {
    return this.options.hide(this);
  }
  
  // The default hiding.
  this.$under.css(underlayer.css.hidden);

  return this;
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
   * Defines a custom function to be used instead of the default for EXPOSING
   * the underlayer.
   *
   * @var function
   */
  "show"              : null,

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

$.fn.underlayerSlide.global = {};

$.fn.underlayerSlide.somePublicMethod  = function () {

};

$.fn.underlayerSlide.version = function() { return '1.0'; };

})(jQuery, window, document);