/**
 * Underlayer Slide jQuery JavaScript Plugin v0.0.1
 * http://www.intheloftstudios.com/packages/jquery/jquery.slide_under
 *
 * jQuery plugin to simulate one element sliding under another without lose of dimensions.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Mon Nov 17 11:46:18 PST 2014
 *
 * Helper css classes applied by this plugin (all are prefixed):
 *
 * On the under element:
 * - processed
 * - under
 *
 * On the masque element:
 * - direction-{preset}, e.g. direction-up
 * - showing
 * - visible
 * - hiding
 *
 * On the toggle element:
 * - toggle
 * - active
 *
 * On the container element:
 * - container
 * - showing
 * - hiding
 * 
 * 
 *
 * @license
 */
;(function($, window, document, undefined) {
"use strict";

var stackingZ = 1;

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
  self.dimensions   = [];
  self.styles       = {};

  //
  // Preset
  if (typeof self.options.direction === 'string' && typeof directions[self.options.direction] === 'object') {
    self.options.direction = directions[self.options.direction];
  }
  
  //
  // Toggle
  self.$toggle      = $(self.options.toggle);
  self.$toggle
  .addClass(p + 'toggle')
  .removeClass(p + 'active')
  .click(function (e) {
    self.toggle();
    return e.preventDefault();
  });

  // 
  // Overlayer
  self.$over        = $(self.options.over);
  self.styles.over  = self.$over.attr('style');
  self.dimensions[0]     = self.$over.outerWidth();
  self.dimensions[1]     = self.$over.outerHeight();
  self.$over
  .addClass(p + 'over')
  .css('position', 'absolute');

  //
  // Shim element
  var $shim;
  if (self.options.shim) {
    $shim = $('<div>')
    .addClass(p + 'shim')
    .width(self.dimensions[0])
    .height(self.dimensions[1]);
  }

  //
  // Underlayer
  self.$under       = $(self.element);
  self.styles.under = self.$under.attr('style');
  self.dimensions[2]     = self.$under.outerWidth();
  self.dimensions[3]     = self.$under.outerHeight();
  self.$under
  .wrap('<div class="' + p + 'masque"></div>')
  .addClass(p + 'under ' + p + 'processed')
  .css('position', 'absolute')
  // It may seem superfluous to hide this, but we do it so that a call to
  // $().is(':visible') is more intuitive.
  .hide();

  //
  // Masque
  self.$masque = self.$under.parent('.' + p + 'masque');
  self.$masque
  .height('100%')
  .width(self.dimensions[2])
  .addClass(p + 'direction-' + self.options.direction.name)
  .css({
    overflow: 'hidden',
    position: 'absolute'
  });
  self.masqueHeight = self.dimensions[1] + self.dimensions[3];

  //
  // Container
  self.$container   = self.$over.parent('.' + p + 'container');
  if (self.$container.length === 0) {
    var $wrap = $('<div>').addClass(p + 'container');
    // self.$masque.wrapAll($wrap);
    self.$over
    .add(self.$masque)
    .wrapAll($wrap);  
    self.$container = self.$over.parent('.' + p + 'container');
  }
  else {
    self.$container.prepend(self.$masque);
  }

  // Add the correct container dimensions.
  self.$container
  .width(self.dimensions[0])
  .height(self.dimensions[1]);

  // Apply an id to the masque.
  var id = self.$container.find('.' + p + 'masque').length - 1;
  if (self.$under.attr('id')) {
    id = self.$under.attr('id');
  }
  self.$masque.attr('id', p + 'masque-' + id);

  // This shim will hold the place of options.under when it goes to absolute
  // positioning.
  self.$shim        = $();
  if (self.options.shim && self.$container.next('.' + p + 'shim').length === 0) {
    self.$container.css('position', 'absolute');
    self.$over.parent().after($shim);
    self.$shim = $shim;
  }

  // The distance needed to travel during expose/hide op.
  self.travelFrom   = self.dimensions[3] * -1 + self.dimensions[1];
  self.travelTo     = self.dimensions[1];
  
  // Callbacks
  if (typeof self.options.direction.afterInit === 'function') {
    self.options.direction.afterInit(self);
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
  self.$under.unwrap();
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
  .removeClass(p + 'processed');
  if (self.styles.under) {
    self.$under.attr('style', self.styles.under);
  }
  else {
    self.$under.removeAttr('style');
  }
  
};

SlideUnder.prototype.speed = function() {
  var speed = this.options.rate;
  if (typeof this.options.speed === 'function') {
    speed = this.options.speed(this);
  }
  else if (typeof speeds[this.options.speed] === 'function') {
    speed = speeds[this.options.speed](this);
  }

  return speed;
};

SlideUnder.prototype.isVisible = function() {
  var p         = this.options.cssPrefix;
  return this.$masque.hasClass(p + 'showing') || this.$masque.hasClass(p + 'visible');
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

  // Bring this container to the top of all others
  self.$container.css('zIndex', stackingZ++);

  self.$under.show();
  
  self.$masque
  .height(self.masqueHeight)
  .add(self.$container)
  .addClass(p + 'showing');

  if (typeof self.options.direction.show === 'function') {
    self.options.direction.show(self, function () {
      self.$masque
      .addClass(p + 'visible')
      .add(self.$container)
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
  
  self.$masque
  .add(self.$container)
  .addClass(p + 'hiding');

  if (typeof self.options.direction.hide === "function") {
    return self.options.direction.hide(self, function () {
      self.$masque.height('100%');
      
      self.$under.hide();

      self.$masque
      .removeClass(p + 'visible')
      .add(self.$container)
      .removeClass(p + 'hiding');
      
      self.options.afterHide(self.$under, self);
    });
  }

  return self;
};


/**
 * Defines one or more speed calculation functions.
 *
 * @var object
 */
var speeds = {};

/**
 * This preset will insure that no matter the size of underlayer, it will
 * always take options.rate milliseconds to be exposed.
 *
 * @param  {SlideUnder} instance
 *
 * @return {int}
 */
speeds.absolute = function (instance) {
  return instance.options.rate;
};

/**
 * This preset will insure that the underlayer moves at a constant speed, the
 * time it takes to expose will depend on the size of the underlayer.
 *
 * @param  {SlideUnder} instance
 *
 * @return {int}
 */
speeds.constant = function (instance) {
  return instance.options.rate * Math.abs(instance.travelFrom) / 200;
};


/**
 * Defines one or more presets to use for animation.
 *
 * @var object
 */
var directions = {};

/**
 * This preset is used for revealing as if sliding downward.
 *
 * @type {Object}
 */
directions.down = {};

/**
 * This name is used to identify this preset and to generate css classes, etc.
 *
 * @var string
 */
directions.down.name = 'down';

/**
 * Defines the preset callback post initialization.
 *
 * This should be used to hide the underlayer initially.
 *
 * @var function
 */
directions.down.afterInit = function (instance) {
  instance.$under.css('top', instance.travelFrom);
};

/**
 * Defines the function to be usedfor EXPOSING the underlayer.
 *
 * You MUST execute the callback at some point when using this feature or bad
 * things will happen (css classes will not be applied correctly).
 *
 * @var function
 */
directions.down.show = function (instance, callback) {
  instance.$under.animate({
    "top": instance.travelTo,
  }, instance.speed(), callback);
};

/**
 * Defines the function to be used for HIDING the underlayer.
 *
 * You MUST execute the callback at some point when using this feature or bad
 * things will happen (css classes will not be applied correctly).
 * 
 * @var function
 */
 directions.down.hide = function (instance, callback) {
  instance.$under.animate({
    "top": instance.travelFrom,
  }, instance.speed(), function () {
    callback();
  });
};

/**
 * This direction preset is used for revealing as if sliding upward.
 *
 * @type {Object}
 */
directions.up = {};
directions.up.name = 'up';
directions.up.afterInit = function (instance) {
  instance.$masque.css('marginTop', -1 * (instance.dimensions[3]));
  // instance.$container.css('marginTop', -1 * (instance.dimensions[3]));
  instance.$over.css('bottom', 0);
  instance.$under
  .css('top', instance.dimensions[3])
  .hide();
};
directions.up.show = function (instance, callback) {
  instance.$under
  .show()
  .animate({
    "top": 0,
  }, instance.speed(), callback);
};
directions.up.hide = function (instance, callback) {
  instance.$under.animate({
    'top': instance.dimensions[3]
  }, instance.speed(), function () {
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
  "over"              : null,
  
  /**
   * Defines the direction present or custom object.
   *
   * You can define your own preset as an object or use on from the presets
   * objects, e.g. 'down'
   *
   * @var string||object
   */
  "direction"         : 'down',

  /**
   * Defines a speed preset or custom function.
   *
   * To use a preset include 'constant' or 'absolute'
   *
   * If writing your own function, you simply return an integar value, your
   * function will receive instance as an argument.
   *
   * @var int||function
   */
  "speed"             : 'constant',

  /**
   * Intended to be used for controlling the speed function.
   *
   * @var int
   */
  "rate"              : 400,

  /**
   * A callback function to call before initializing.
   *
   * @var function
   */
  "afterInit"         : function (instance) {},

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