QUnit.test("Speed calculates correctly", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(top).height(100);
  $(bottom).height(200);
  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle,
    "speed": 100,
  });
  var obj = $(bottom).data('plugin_underlayerSlide');

  assert.deepEqual(obj.speed, 200);
  $(bottom).underlayerSlide('destroy');
  $(top).add($(bottom)).removeAttr('style');
});

QUnit.test("A second call using a different under element places second under inside .uls-container.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });
  $('.bottom-layer-b').underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($('.bottom-layer-b').parent('.uls-container').length, 1);
});

QUnit.test(".uls-container has the correct dimensions.", function(assert) {
  var top         = '.top-layer';
  var bottom      = '.bottom-layer';
  var toggle      = '.toggle';
  var dimensions  = [$(top).outerWidth(), $(top).outerHeight() + $(bottom).outerHeight()];

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  var $c  = $('.uls-container');
  assert.deepEqual($c.outerWidth(), dimensions[0]);
  assert.deepEqual($c.outerHeight(), dimensions[1]);
});

QUnit.test("Defaults hide underlayer on init.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';
  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });
  assert.ok(!$(bottom).is(':visible'));
});

QUnit.test("Custom preset fires all callbacks", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';
  var result   = {};

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle,
    "preset": {
      "afterInit": function (instance) {
        result.afterInit = instance;
      },
      "show": function (instance, callback) {
        result.show = [instance, callback];
      },
      "hide": function (instance, callback) {
        result.hide = [instance, callback];
      }
    }
  });
  var obj = $(bottom).data('plugin_underlayerSlide');

  assert.deepEqual(result.afterInit.class, 'UnderlayerSlide');
  
  obj.show();
  assert.deepEqual(result.show[0].class, 'UnderlayerSlide');
  assert.deepEqual(typeof result.show[1], 'function');

  obj.hide();
  assert.deepEqual(result.hide[0].class, 'UnderlayerSlide');
  assert.deepEqual(typeof result.hide[1], 'function');
});

QUnit.test("A second call using a different under element doesn't double wrap.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });
  $('.bottom-layer-b').underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($('.uls-container').length, 1);
  assert.deepEqual($('.uls-shim').length, 1);
});

QUnit.test("Destroy removes helper classes.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });
  $(bottom).underlayerSlide('destroy');

  assert.ok(!$(toggle).hasClass('uls-toggle'));
  assert.ok(!$(toggle).hasClass('uls-active'));
  assert.ok(!$(top).hasClass('uls-over'));
  assert.ok(!$(top).hasClass('uls-processed'));
  assert.ok(!$(bottom).hasClass('uls-under'));
  assert.ok(!$(bottom).hasClass('uls-visible'));
  
});


QUnit.test("Destroy removes .uls-shim and .uls-container", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });
  $(bottom).underlayerSlide('destroy');

  assert.deepEqual($('.uls-shim').length, 0);
  assert.deepEqual($('.uls-container').length, 0);
});

QUnit.test(".uls-shim is added with correct dimensions.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  var dimensions = [$(top).outerWidth(), $(top).outerHeight()];

  assert.deepEqual($('.uls-shim').length, 0);

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  var $shim    = $('.uls-shim');
  assert.deepEqual($shim.length, 1);
  assert.deepEqual($shim.width(), dimensions[0]);
  assert.deepEqual($shim.height(), dimensions[1]);
});

QUnit.test("Top and bottom are wrapped with .uls-container", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($(top).parent('.uls-container').length, 1);
});

QUnit.test("Style tags are restored on underlayer on destroy.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  $(bottom).underlayerSlide('destroy');
  assert.deepEqual($(bottom).attr('style'), undefined);
  assert.deepEqual($(top).attr('style'), undefined);
});

QUnit.test("Css classes are applied on init.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).underlayerSlide({
    "over": top,
    "toggle": toggle
  });

  assert.ok($(top).hasClass('uls-over'));
  assert.ok($(bottom).hasClass('uls-under'));
  assert.ok($(bottom).hasClass('uls-processed'));
  assert.ok($(toggle).hasClass('uls-toggle'));
});

QUnit.testDone(function (details) {
  $('.uls-processed').underlayerSlide('destroy');
});
