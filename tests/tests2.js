QUnit.test("With two instances, two shims are created.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  $('#bottom-2').slideUnder('#top-2');

  assert.deepEqual($('.slide-under-shim').length, 2);
});

QUnit.test("Passing shim = false prevents the dom object from being created.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    shim: false,
    over: top
  });
  assert.deepEqual($('.slide-under-shim').length, 0);
});

QUnit.test("Passing a jQuery selector as options converts it to the over option.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');

  assert.ok($(top).hasClass('slide-under-over'));

});

QUnit.test("Underlayer is position correctly on init.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(top).height(100);
  $(bottom).height(300);
  $(bottom).slideUnder({
    "over": top,
  });

  assert.deepEqual($(bottom).css('top'), '-200px');

  $(top).height(100);
  $(bottom).height(200);
  $(bottom).slideUnder('destroy');  
});

QUnit.test("Calling with 'hide' or 'show' shows performs the corresponding methods.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    "over": top,

    // Custom preset to avoid the delay from the default animation.
    "preset": {
      "hide": function (instance, callback) {
        callback();
      },
      "show": function (instance, callback) {
        callback();
      }
    }
  });

  var obj = $(bottom).data('slideUnder');
  
  assert.ok(!$(bottom).hasClass('slide-under-visible'));
  assert.ok(!obj.isVisible());
  $(bottom).slideUnder('show');
  assert.ok($(bottom).hasClass('slide-under-visible'));
  assert.ok(obj.isVisible());

  $(bottom).slideUnder('hide');
  assert.ok(!$(bottom).hasClass('slide-under-visible'));
  assert.ok(!obj.isVisible());
});

QUnit.test("Speed calculates correctly", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(top).height(100);
  $(bottom).height(200);
  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle,
    "speed": 100,
  });
  var obj = $(bottom).data('slideUnder');

  assert.deepEqual(obj.speed, 100);
  $(bottom).slideUnder('destroy');
  $(top).add($(bottom)).removeAttr('style');
});

QUnit.test("A second call using a different under element places second under inside .slide-under-container.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });
  $('.bottom-layer-b').slideUnder({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($('.bottom-layer-b').parent('.slide-under-container').length, 1);
});

QUnit.test(".slide-under-container has the correct dimensions.", function(assert) {
  var top         = '.top-layer';
  var bottom      = '.bottom-layer';
  var toggle      = '.toggle';
  var dimensions  = [$(top).outerWidth(), $(top).outerHeight() + $(bottom).outerHeight()];

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  var $c  = $('.slide-under-container');
  assert.deepEqual($c.outerWidth(), dimensions[0]);
  assert.deepEqual($c.outerHeight(), dimensions[1]);
});

QUnit.test("Defaults hide underlayer on init.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';
  $(bottom).slideUnder({
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

  $(bottom).slideUnder({
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
  var obj = $(bottom).data('slideUnder');

  assert.deepEqual(result.afterInit.class, 'SlideUnder');
  
  obj.show();
  assert.deepEqual(result.show[0].class, 'SlideUnder');
  assert.deepEqual(typeof result.show[1], 'function');

  obj.hide();
  assert.deepEqual(result.hide[0].class, 'SlideUnder');
  assert.deepEqual(typeof result.hide[1], 'function');
});

QUnit.test("A second call using a different under element doesn't double wrap.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });
  $('.bottom-layer-b').slideUnder({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($('.slide-under-container').length, 1);
  assert.deepEqual($('.slide-under-shim').length, 1);
});

QUnit.test("Destroy removes helper classes.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });
  $(bottom).slideUnder('destroy');

  assert.ok(!$(toggle).hasClass('slide-under-toggle'));
  assert.ok(!$(toggle).hasClass('slide-under-active'));
  assert.ok(!$(top).hasClass('slide-under-over'));
  assert.ok(!$(top).hasClass('slide-under-processed'));
  assert.ok(!$(bottom).hasClass('slide-under-under'));
  assert.ok(!$(bottom).hasClass('slide-under-visible'));
  
});


QUnit.test("Destroy removes .slide-under-shim and .slide-under-container", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });
  $(bottom).slideUnder('destroy');

  assert.deepEqual($('.slide-under-shim').length, 0);
  assert.deepEqual($('.slide-under-container').length, 0);
});

QUnit.test(".slide-under-shim is added with correct dimensions.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  var dimensions = [$(top).outerWidth(), $(top).outerHeight()];

  assert.deepEqual($('.slide-under-shim').length, 0);

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  var $shim    = $('.slide-under-shim');
  assert.deepEqual($shim.length, 1);
  assert.deepEqual($shim.width(), dimensions[0]);
  assert.deepEqual($shim.height(), dimensions[1]);
});

QUnit.test("Top and bottom are wrapped with .slide-under-container", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($(top).parent('.slide-under-container').length, 1);
});

QUnit.test("Style tags are restored on underlayer on destroy.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  $(bottom).slideUnder('destroy');
  assert.deepEqual($(bottom).attr('style'), undefined);
  assert.deepEqual($(top).attr('style'), undefined);
});

QUnit.test("Css classes are applied on init.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  assert.ok($(top).hasClass('slide-under-over'));
  assert.ok($(bottom).hasClass('slide-under-under'));
  assert.ok($(bottom).hasClass('slide-under-processed'));
  assert.ok($(toggle).hasClass('slide-under-toggle'));
});

QUnit.testDone(function (details) {
  $('.slide-under-processed').slideUnder('destroy');
});
