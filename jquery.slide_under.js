/**
 * Underlayer Slide jQuery JavaScript Plugin v0.0.1
 * http://www.intheloftstudios.com/packages/jquery/jquery.slide_under
 *
 * Plugin to register an under layer that slides out from under a container when triggered.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Sun Nov 16 09:09:24 PST 2014
 *
 * Helper css classes applied by this plugin (all are prefixed):
 *
 * On the under element:
 * - under
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

// The actual plugin constructor
function SlideUnder(element, options) {
  this.class      = 'SlideUnder';
  this.element    = element;
  this.options    = $.extend( {}, $.fn.slideUnder.defaults, options) ;
  this._defaults  = $.fn.slideUnder.defaults;
  
  this.init();
}

SlideUnder.prototype.toString = function() {
  return this.class;
};

SlideUnder.prototype.init = function () {
  var self          = this;
  var p             = self.options.cssPrefix;
  var dimensions    = [];
  
  self.styles       = {};
  
  //
  // Toggle
  self.$toggle      = $(self.options.toggle);
  self.$toggle
  .addClass(p + 'toggle')
  .removeClass(p + 'active')
  .click(function () {
    self.toggle();
  });

  // 
  // Overlayer
  self.$over        = $(self.options.over);
  self.styles.over  = self.$over.attr('style');
  dimensions[0]     = self.$over.outerWidth();
  dimensions[1]     = self.$over.outerHeight();
  self.$over.addClass(p + 'over');

  //
  // Shim element
  var $shim;
  if (self.options.shim) {
    $shim = $('<div>')
    .addClass(p + 'shim')
    .width(dimensions[0])
    .height(dimensions[1]);
  }

  //
  // Underlayer
  self.$under       = $(self.element);
  self.styles.under = self.$under.attr('style');
  dimensions[2]     = self.$under.outerHeight();
  self.$under
  .addClass(p + 'under ' + p + 'processed');

  //
  // Container
  if (self.$over.parent('.' + p + 'container').length === 0) {
    self.$container = $('<div>')
    .addClass(p + 'container')
    .width(dimensions[0])
    .height(dimensions[1] + dimensions[2]);
    self.$over.add(self.$under).wrapAll(self.$container);  
  }
  else {
    self.$over.parent('.' + p + 'container').prepend(self.$under);
  }
  self.$container   = self.$over.parent('.' + p + 'container');

  // This shim will hold the place of options.under when it goes to absolute
  // positioning.
  self.$shim        = $();
  if (self.options.shim && self.$container.next('.' + p + 'shim').length === 0) {
    self.$over.parent().after($shim);
    self.$shim = $shim;
  }

  // The distance needed to travel during expose/hide op.
  self.travelFrom   = dimensions[2] * -1 + dimensions[1];
  self.travelTo     = dimensions[1];
  self.speed        = self.options.speed * Math.abs(self.travelFrom) / 100;
  
  // Callbacks
  if (typeof self.options.preset.afterInit === 'function') {
    self.options.preset.afterInit(self);
  }
  self.options.afterInit(self);

};

SlideUnder.prototype.destroy = function () {
  var self = this;
  var p = self.options.cssPrefix;

  self.$toggle
  .removeClass(p + 'toggle ' + p + 'active')
  .unbind('click');

  // Remove the container and shim elements.
  self.$shim.remove();
  self.$over.unwrap();

  self.$over
  .removeClass(p + 'over')
  .removeData('slideUnder')
  .attr('style', self.styles.over);
  if (self.styles.over) {
    self.$over.attr('style', self.styles.over);
  }
  else {
    self.$over.removeAttr('style');
  }
  
  self.$under
  .removeData(p + 'style')
  .removeClass(p + 'under')
  .removeClass(p + 'visible')
  .removeClass(p + 'processed');
  if (self.styles.under) {
    self.$under.attr('style', self.styles.under);
  }
  else {
    self.$under.removeAttr('style');
  }
  
};

SlideUnder.prototype.isVisible = function() {
  var p         = this.options.cssPrefix;
  return this.$under.hasClass(p + 'showing') || this.$under.hasClass(p + 'visible');
};

SlideUnder.prototype.toggle = function() {
  return this.isVisible() ? this.hide() : this.show();
};

SlideUnder.prototype.show = function() {
  var self      = this;

  if (self.$under.is(':animated') || self.isVisible()) {
    return self;
  }

  var p         = this.options.cssPrefix;

  self.options.beforeShow(self.$under, self);
  self.$toggle.addClass(p + 'active');
  self.$under.addClass(p + 'showing');

  if (typeof self.options.preset.show === 'function') {
    self.options.preset.show(self, function () {
      self.$under
      .addClass(p + 'visible')
      .removeClass(p + 'showing');
      self.options.afterShow(self.$under, self);
    });
  }

  return self;
};

SlideUnder.prototype.hide = function() {
  var self      = this;

  if (self.$under.is(':animated') || !self.isVisible()) {
    return self;
  }

  var p         = self.options.cssPrefix;

  self.options.beforeHide(self.$under, self);
  self.$toggle.removeClass(p + 'active');
  self.$under.addClass(p + 'hiding');

  if (typeof self.options.preset.hide === "function") {
    return self.options.preset.hide(self, function () {
      self.$under
      .removeClass(p + 'visible')
      .removeClass(p + 'hiding');
      self.options.afterHide(self.$under, self);
    });
  }

  return self;
};




/**
 * Defines one or more presets to use for animation.
 *
 * @var object
 */
var presets = {};

/**
 * This preset is used for revealing as if sliding downward.
 *
 * @type {Object}
 */
presets.down = {};

/**
 * Defines the preset callback post initialization.
 *
 * This should be used to hide the underlayer initially.
 *
 * @var function
 */
presets.down.afterInit = function (instance) {
  instance.$under
  .css('top', instance.travelFrom)
  .hide();
};

/**
 * Defines the function to be usedfor EXPOSING the underlayer.
 *
 * You MUST execute the callback at some point when using this feature or bad
 * things will happen (css classes will not be applied correctly).
 *
 * @var function
 */
presets.down.show = function (instance, callback) {
  instance.$under
  .show()
  .animate({
    "top": instance.travelTo,
  }, instance.speed, callback);
};

/**
 * Defines the function to be used for HIDING the underlayer.
 *
 * You MUST execute the callback at some point when using this feature or bad
 * things will happen (css classes will not be applied correctly).
 * 
 * @var function
 */
 presets.down.hide = function (instance, callback) {
  instance.$under.animate({
    "top": instance.travelFrom,
  }, instance.speed, function () {
    instance.$under.hide();
    callback();
  });
};


$.fn.slideUnder = function(options) {
  return this.each(function () {
    var obj = $.data(this, 'slideUnder');

    // Sniff out a string method.
    if (typeof options === 'string' && obj && typeof obj[options] === 'function') {
      obj[options]();
    }
    else {
      // If it's a string and it's not a method, it's a jQuery selector.
      if (typeof options === 'string') {
        options = {"over": options};
      }

      $.data(this, 'slideUnder', new SlideUnder(this, options));    
    }
  });
};

$.fn.slideUnder.defaults = {
  
  /**
   * Defines the selector for the toggle element.
   *
   * @var string
   */
  "toggle"            : null,

  /**
   * Defines the selector for the element under which we'll slide.
   *
   * @var string
   */
  "over"             : null,
  
  /**
   * Defines the preset to use for animation.
   *
   * Valid options are: down. 
   *
   * @var type
   */
  "preset"         : presets.down,

  /**
   * Define how many milliseconds to travel 100px.
   *
   * @var int
   */
  "speed"             : 200,

  /**
   * A callback function to call before initializing.
   *
   * @var function
   */
  "afterInit"        : function (instance) {},

  /**
   * A function to call before the showing begins.
   *
   * @var function
   */
  "beforeShow"        : function(layer, instance) {},

  /**
   * A function to call AFTER the showing has completed.
   *
   * @var function
   */
  "afterShow"         : function(layer, instance) {},

  /**
   * A function to call before the hiding begins.
   *
   * @var function
   */
  "beforeHide"        : function(layer, instance) {},

  /**
   * A function to call AFTER the hiding has completed.
   *
   * @var function
   */  
  "afterHide"         : function(layer, instance) {},

  /**
   * Determines if a shim element is created.
   *
   * @var bool
   */
  "shim"              : true,
  
  /**
   * Defines the css prefix to use for all classes applied by plugin.
   *
   * If you change this you may need to clone any included stylesheets, 
   * replacing the default classnames with your custom.
   *
   * @var string
   */
  "cssPrefix"         : 'slide-under-'  
};

/**
 * Returns the version of this plugin.
 *
 * @return {string}
 */
$.fn.slideUnder.version = function() { return '0.0.1'; };

})(jQuery, window, document);