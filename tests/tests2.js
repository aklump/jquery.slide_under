QUnit.test("Passing shim = false prevents the dom object from being created.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    shim: false,
    over: top
  });
  assert.deepEqual($('.uls-shim').length, 0);
});

QUnit.test("Passing a jQuery selector as options converts it to the over option.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');

  assert.ok($(top).hasClass('uls-over'));

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
  
  assert.ok(!$(bottom).hasClass('uls-visible'));
  assert.ok(!obj.isVisible());
  $(bottom).slideUnder('show');
  assert.ok($(bottom).hasClass('uls-visible'));
  assert.ok(obj.isVisible());

  $(bottom).slideUnder('hide');
  assert.ok(!$(bottom).hasClass('uls-visible'));
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

QUnit.test("A second call using a different under element places second under inside .uls-container.", function(assert) {
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

  assert.deepEqual($('.bottom-layer-b').parent('.uls-container').length, 1);
});

QUnit.test(".uls-container has the correct dimensions.", function(assert) {
  var top         = '.top-layer';
  var bottom      = '.bottom-layer';
  var toggle      = '.toggle';
  var dimensions  = [$(top).outerWidth(), $(top).outerHeight() + $(bottom).outerHeight()];

  $(bottom).slideUnder({
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

  assert.deepEqual($('.uls-container').length, 1);
  assert.deepEqual($('.uls-shim').length, 1);
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

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });
  $(bottom).slideUnder('destroy');

  assert.deepEqual($('.uls-shim').length, 0);
  assert.deepEqual($('.uls-container').length, 0);
});

QUnit.test(".uls-shim is added with correct dimensions.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  var dimensions = [$(top).outerWidth(), $(top).outerHeight()];

  assert.deepEqual($('.uls-shim').length, 0);

  $(bottom).slideUnder({
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

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  assert.deepEqual($(top).parent('.uls-container').length, 1);
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

  assert.ok($(top).hasClass('uls-over'));
  assert.ok($(bottom).hasClass('uls-under'));
  assert.ok($(bottom).hasClass('uls-processed'));
  assert.ok($(toggle).hasClass('uls-toggle'));
});

QUnit.testDone(function (details) {
  $('.uls-processed').slideUnder('destroy');
});
