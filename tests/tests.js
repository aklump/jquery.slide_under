QUnit.test("beforeHide and afterHide callbacks are triggered.", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');

  var beforeHide  = false;
  var afterHide   = false;
  
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "beforeHide": function (obj) {
      beforeHide = obj;
    },
    "afterHide": function (obj) {
      afterHide = obj;
    }
  });
  var obj = $wrap.data('plugin_underlayerSlide');

  assert.ok(!beforeHide);
  assert.ok(!afterHide);
  obj.hide();
  assert.deepEqual(beforeHide.class, 'UnderlayerSlide');
  assert.deepEqual(afterHide.class, 'UnderlayerSlide');
});

QUnit.test("beforeShow and afterShow callbacks are triggered.", function(assert) {
  var $wrap       = $('.example-wrapper');
  var $toggle     = $('.example-toggle');
  var $layer      = $('.example-underlayer');

  var beforeShow  = false;
  var afterShow   = false;
  
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "beforeShow": function (obj) {
      beforeShow = obj;
    },
    "afterShow": function (obj) {
      afterShow = obj;
    }
  });
  var obj = $wrap.data('plugin_underlayerSlide');

  assert.ok(!beforeShow);
  assert.ok(!afterShow);
  obj.show();
  assert.deepEqual(beforeShow.class, 'UnderlayerSlide');
  assert.deepEqual(afterShow.class, 'UnderlayerSlide');
});

QUnit.test("Passing custom show/hide functions trigger them instead of defaults.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');

  var shown   = false;
  var hidden  = false;
  
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
    "show": function (obj) {
      shown = obj;
    },
    "hide": function (obj) {
      hidden = obj;
    }
  });

  var obj = $wrap.data('plugin_underlayerSlide');
  
  assert.ok(!shown);
  obj.show();
  assert.deepEqual(shown.class, 'UnderlayerSlide');
  
  assert.ok(!hidden);
  obj.hide();
  assert.deepEqual(hidden.class, 'UnderlayerSlide');
});

QUnit.test("Clicking toggle exposes the underlayer, setting classes", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer',
  });
  $toggle.click();
  assert.ok($layer.hasClass('uls-visible'));
  assert.ok($toggle.hasClass('uls-active'));

  $toggle.click();
  assert.ok(!$layer.hasClass('uls-visible'));
  assert.ok(!$toggle.hasClass('uls-active'));  
});

QUnit.test("Init positions the underlayer correctly.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });
  assert.deepEqual($layer.css('position'), 'absolute');
  assert.ok(!$layer.is(':visible'));
});

QUnit.test("Destroy functions removes classes and plugin css.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });

  $layer.addClass('uls-visible');
  $toggle.addClass('uls-active');
  $wrap.underlayerSlide('destroy');
  
  assert.ok(!$wrap.hasClass('uls-processed'));
  assert.ok(!$wrap.hasClass('uls-wrapper'));
  
  assert.ok(!$toggle.hasClass('uls-toggle'));
  assert.ok(!$toggle.hasClass('uls-active'));

  assert.ok(!$layer.hasClass('uls-underlayer'));
  assert.ok(!$layer.hasClass('uls-visible'));
  assert.strictEqual(typeof $layer.attr('style'), 'undefined');
});

QUnit.test("Destroy functions returns style tag to pre-plugin state.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $layer.css('border', '1px solid red');
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });
  $wrap.underlayerSlide('destroy');
  assert.strictEqual($layer.attr('style'), 'border: 1px solid red;');
  $layer.removeAttr('style');
});

QUnit.test( "Init applies correct classes.", function(assert) {
  var $wrap   = $('.example-wrapper');
  var $toggle = $('.example-toggle');
  var $layer  = $('.example-underlayer');
  $layer.addClass('uls-visible');
  $toggle.addClass('uls-active');
  $wrap.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });
  
  // Get the object and test it's type
  var uls = $wrap.data('plugin_underlayerSlide');
  assert.deepEqual(typeof uls, 'object');
  assert.deepEqual(uls.class, 'UnderlayerSlide');

  assert.ok($wrap.hasClass('uls-wrapper'));
  assert.ok($toggle.hasClass('uls-toggle'));
  assert.ok(!$toggle.hasClass('uls-active'));
  assert.ok($layer.hasClass('uls-underlayer'));
  assert.ok(!$layer.hasClass('uls-visible'));
});

QUnit.test("Able to retrieve object after instantiation.", function(assert) {
  var $element   = $('.example-wrapper');
  $element.underlayerSlide({
    "toggle": '.example-toggle',
    "under": '.example-underlayer'
  });

  // Get it and test it's and object and our type of object.
  var underlayerSlide = $element.data('plugin_underlayerSlide');
  assert.ok(typeof underlayerSlide === 'object');
  assert.deepEqual(underlayerSlide.toString(), 'UnderlayerSlide');
  assert.deepEqual(underlayerSlide.class, 'UnderlayerSlide');
  
  // destroy it and make sure that it's no longer there.
  $element.underlayerSlide('destroy');
  assert.deepEqual(typeof $element.data('plugin_underlayerSlide'), 'undefined');
});

QUnit.testDone(function (details) {
  $('.example-wrapper').underlayerSlide('destroy');
});