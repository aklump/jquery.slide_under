QUnit.test("underlayer is wrapped by uls-underlayer", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
  });
  assert.ok($layer.parent().hasClass('uls-underlayer'));
});

QUnit.test("The custom show function is respected", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');
  
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "show": function (underlayer, callback, obj) {
      show = [underlayer, callback, obj];
    },
  });
  var obj = $wrap.data('plugin_slideUnder');

  var show  = false;

  assert.ok(!show);
  assert.ok(!$layer.parent().hasClass('uls-visible'));
  obj.show();
  // Because our custom function doesn't apply the callback, the layer
  // will not have received the visible class.
  assert.ok(!$layer.parent().hasClass('uls-visible'));
  assert.ok(show[0].children().hasClass('example-underlayer'));
  assert.deepEqual(typeof show[1], 'function');
  assert.deepEqual(show[2].class, 'SlideUnder');
});

QUnit.test("beforeHide and afterHide callbacks are triggered.", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');
  
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "beforeHide": function (layer, obj) {
      beforeHide = [layer, obj];
    },
    "afterHide": function (layer, obj) {
      afterHide = [layer, obj];
    }
  });
  var obj = $wrap.data('plugin_slideUnder');

  var beforeHide  = false;
  var afterHide   = false;
  assert.ok(!beforeHide);
  assert.ok(!afterHide);
  obj.hide();
  assert.ok(beforeHide[0].hasClass('uls-underlayer'));
  assert.deepEqual(beforeHide[1].class, 'SlideUnder');
  assert.ok(afterHide[0].hasClass('uls-underlayer'));
  assert.deepEqual(afterHide[1].class, 'SlideUnder');
});

QUnit.test("beforeShow and afterShow callbacks are triggered.", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');

  var beforeShow  = false;
  var afterShow   = false;
  
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "beforeShow": function (layer, obj) {
      beforeShow = [layer, obj];
    },
    "afterShow": function (layer, obj) {
      afterShow = [layer, obj];
    }
  });
  var obj = $wrap.data('plugin_slideUnder');

  assert.ok(!beforeShow);
  assert.ok(!afterShow);
  obj.show();
  assert.ok(beforeShow[0].hasClass('uls-underlayer'));
  assert.deepEqual(beforeShow[1].class, 'SlideUnder');
  assert.ok(afterShow[0].hasClass('uls-underlayer'));
  assert.deepEqual(afterShow[1].class, 'SlideUnder');
});

QUnit.test("Passing custom show/hide functions trigger them instead of defaults.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "show": function (underlayer, callback, obj) {
      shown = obj;
    },
    "hide": function (underlayer, callback, obj) {
      hidden = obj;
    }
  });

  var obj = $wrap.data('plugin_slideUnder');

  var shown   = false;
  var hidden  = false;
  
  assert.ok(!shown);
  obj.show();
  assert.deepEqual(shown.class, 'SlideUnder');
  
  assert.ok(!hidden);
  obj.hide();
  assert.deepEqual(hidden.class, 'SlideUnder');
});

QUnit.test("Clicking toggle exposes the underlayer, setting classes", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
  });
  $toggle.click();
  assert.ok($layer.parent().hasClass('uls-visible'));
  assert.ok($toggle.hasClass('uls-active'));

  $toggle.click();
  assert.ok(!$layer.parent().hasClass('uls-visible'));
  assert.ok(!$toggle.hasClass('uls-active'));  
});

QUnit.test("Init positions the underlayer correctly.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });
  assert.deepEqual($layer.parent().css('position'), 'absolute');
  assert.ok(!$layer.parent().hasClass('uls-visible'));
});

QUnit.test("Destroy functions removes classes and plugin css.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });

  $layer.addClass('uls-visible');
  $toggle.addClass('uls-active');
  $wrap.slideUnder('destroy');
  
  assert.ok(!$wrap.hasClass('uls-processed'));
  assert.ok(!$wrap.hasClass('uls-wrapper'));
  
  assert.ok(!$toggle.hasClass('uls-toggle'));
  assert.ok(!$toggle.hasClass('uls-active'));

  assert.ok(!$layer.parent().hasClass('uls-underlayer'));
  assert.ok(!$layer.parent().hasClass('uls-visible'));
  assert.strictEqual(typeof $layer.attr('style'), 'undefined');
});

// QUnit.test("Destroy functions returns style tag to pre-plugin state.", function(assert) {
//   var $wrap   = $('.example-wrapper');
//   var $toggle = $('.example-toggle');
//   var $layer  = $('.example-underlayer');
//   $layer.parent().css('border', '1px solid red');
//   $wrap.slideUnder({
//     "toggle": '.example-toggle',
//     "under": '.example-underlayer'
//   });
//   $wrap.slideUnder('destroy');
//   assert.strictEqual($layer.attr('style'), 'border: 1px solid red;');
//   $layer.removeAttr('style');
// });

QUnit.test( "afterInit callback is called.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  var afterInit    = null;
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "afterInit": function (instance) {
      afterInit = instance;
    }
  });
  assert.deepEqual(afterInit.class, 'SlideUnder');
});

QUnit.test( "Init applies correct classes.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $layer.addClass('uls-visible');
  $toggle.addClass('uls-active');
  $wrap.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });
  
  // Get the object and test it's type
  var uls = $wrap.data('plugin_slideUnder');
  assert.deepEqual(typeof uls, 'object');
  assert.deepEqual(uls.class, 'SlideUnder');

  assert.ok($wrap.hasClass('uls-wrapper'));
  assert.ok($toggle.hasClass('uls-toggle'));
  assert.ok(!$toggle.hasClass('uls-active'));
  assert.ok($layer.parent().hasClass('uls-underlayer'));
  assert.ok(!$layer.parent().hasClass('uls-visible'));
});

QUnit.test("Able to retrieve object after instantiation.", function(assert) {
  var $element   = $('.example-wrapper');
  $element.slideUnder({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });

  // Get it and test it's and object and our type of object.
  var slideUnder = $element.data('plugin_slideUnder');
  assert.ok(typeof slideUnder === 'object');
  assert.deepEqual(slideUnder.toString(), 'SlideUnder');
  assert.deepEqual(slideUnder.class, 'SlideUnder');
  
  // destroy it and make sure that it's no longer there.
  $element.slideUnder('destroy');
  assert.deepEqual(typeof $element.data('plugin_slideUnder'), 'undefined');
});

QUnit.testDone(function (details) {
  $('.example-wrapper').slideUnder('destroy');
});