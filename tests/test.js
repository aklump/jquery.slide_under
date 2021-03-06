QUnit.test("Options 'initial' = visible makes the underlayer visible on init and sized the masque.", function(assert) {
  var top      = '#top-animation';
  var bottom   = '#bottom-animation';
  $(bottom).slideUnder({
    over: top,
    initial: "visible"
  });
  
  assert.ok($(bottom).is(':visible'));
  var obj = $(bottom).data('slideUnder');
  assert.deepEqual(obj.$masque.height(), obj.dimensions[1] + obj.dimensions[3]);
});

QUnit.test("methods makeVisible & makeHidden work as expected.", function(assert) {
  var top      = '#top-animation';
  var bottom   = '#bottom-animation';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');
  obj.makeVisible();
  assert.ok(obj.isVisible());

  obj.makeHidden();
  assert.ok(!obj.isVisible());
});



QUnit.test("Classes hiding are applied during transitions.", function(assert) {
  var top      = '#top-animation';
  var bottom   = '#bottom-animation';
  $(bottom).slideUnder({
    over: top,
    speed: 'absolute',
    rate: 0
  });
  var obj = $(bottom).data('slideUnder');

  obj.show();
  obj.options.rate = 6;

  $(bottom).slideUnder('hide');
  stop();
  setTimeout(function() {
    assert.ok(obj.$container.hasClass('slide-under-hiding'));
    assert.ok(obj.$masque.hasClass('slide-under-hiding'));
    start();
  }, 3);
});

QUnit.test("Classes showing are applied during transitions.", function(assert) {
  var top      = '#top-animation';
  var bottom   = '#bottom-animation';
  $(bottom).slideUnder({
    over: top,
    speed: 'absolute',
    rate: 6
  });
  var obj = $(bottom).data('slideUnder');

  $(bottom).slideUnder('show');
  stop();
  setTimeout(function() {
    assert.ok(obj.$container.hasClass('slide-under-showing'));
    assert.ok(obj.$masque.hasClass('slide-under-showing'));
    start();
  }, 3);
});

QUnit.test("Before hide under is visible, after hide under is hidden.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);

  $(bottom).slideUnder('show');
  assert.ok($(bottom).is(':visible'));
  $(bottom).slideUnder('hide');
  assert.ok($(bottom).is(':hidden'));
});

QUnit.test("Before show under is hidden, afterShow under is visible.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);

  assert.ok($(bottom).is(':hidden'));
  $(bottom).slideUnder('show');
  assert.ok($(bottom).is(':visible'));
});

QUnit.test(".slide-under-masque has derivitive id of under when under has id.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom)
  .attr('id', 'ready-for-breakfast')
  .slideUnder(top);
  var obj = $(bottom).data('slideUnder');
  assert.deepEqual(obj.$masque.attr('id'), 'slide-under-masque-ready-for-breakfast');

  $(bottom).attr('id', '');
});

QUnit.test(".slide-under-masque has default id.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');
  assert.deepEqual(obj.$masque.attr('id'), 'slide-under-masque-0');
});

QUnit.test("Preset class 'down' appears on underlayer.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');

  assert.ok(obj.$masque.hasClass('slide-under-direction-down'));
});

QUnit.test("Preset class 'up' appears on underlayer.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    over: top,
    direction: 'up'
  });
  var obj = $(bottom).data('slideUnder');

  assert.ok(obj.$masque.hasClass('slide-under-direction-up'));
});

QUnit.test(".slide-under-masque is wrapped around the underlayer.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  assert.deepEqual($(bottom).parent('.slide-under-masque').length, 1);
});

QUnit.test("With two instances, two shims are created.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  $('#bottom-2').slideUnder('#top-2');

  assert.deepEqual($('.slide-under-shim').length, 2);
});

QUnit.test("Passing shim = false prevents the dom object from being created and does not make the above absolute positioned.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    shim: false,
    over: top
  });
  assert.deepEqual($('.slide-under-shim').length, 0);
  assert.deepEqual($(top).css('position'), 'static');

  var obj = $(bottom).data('slideUnder');
  assert.deepEqual(obj.$container.css('position'), 'static');
});

QUnit.test("Passing a jQuery selector as options converts it to the over option.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder(top);
  var obj = $(bottom).data('slideUnder');

  assert.ok($(top).hasClass('slide-under-over'));

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
  
  assert.ok(!$(bottom).parent().hasClass('slide-under-visible'));
  assert.ok(!obj.isVisible());
  $(bottom).slideUnder('show');
  assert.ok($(bottom).parent().hasClass('slide-under-visible'));
  assert.ok(obj.isVisible());

  $(bottom).slideUnder('hide');
  assert.ok(!$(bottom).parent().hasClass('slide-under-visible'));
  assert.ok(!obj.isVisible());
});

QUnit.test("Speed calculates correctly when set to constant.", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  var toggle   = '.toggle';

  $(top).height(100);
  $(bottom).height(200);
  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle,
    "speed": 'constant',
    "rate": 100
  });
  var obj = $(bottom).data('slideUnder');

  assert.deepEqual(obj.speed(), 50);
  $(bottom).slideUnder('destroy');
  $(top).add($(bottom)).removeAttr('style');
});

QUnit.test("Rate is returned when speed is set to absolute", function(assert) {
  var top      = '.top-layer';
  var bottom   = '.bottom-layer';
  $(bottom).slideUnder({
    over: top,
    speed: 'absolute',
    rate: 333
  });
  var obj = $(bottom).data('slideUnder');

  assert.deepEqual(obj.speed(), 333);
});

QUnit.test("A second call using a different under element places second .masque inside .slide-under-container.", function(assert) {
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

  assert.deepEqual($('.bottom-layer-b').parent('.slide-under-masque').parent('.slide-under-container').length, 1);
});

QUnit.test("container and masque have the correct dimensions.", function(assert) {
  var top         = '.top-layer';
  var bottom      = '.bottom-layer';
  var toggle      = '.toggle';
  // var dimensions  = [$(top).outerWidth(), $(top).outerHeight() + $(bottom).outerHeight()];
  var dimensions  = [$(top).outerWidth(), $(top).outerHeight(), $(bottom).outerWidth(), $(bottom).outerHeight()];

  $(bottom).slideUnder({
    "over": top,
    "toggle": toggle
  });

  var $c  = $('.slide-under-container');
  assert.deepEqual($c.outerWidth(), dimensions[0]);
  assert.deepEqual($c.outerHeight(), dimensions[1]);

  var $m  = $('.slide-under-masque');
  assert.deepEqual($m.outerWidth(), dimensions[0]);
  assert.deepEqual($m.outerHeight(), dimensions[1]);

  $(toggle).click();
  assert.deepEqual($m.outerHeight(), dimensions[1] + dimensions[3]);
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
    "direction": {
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
  assert.ok(!$(bottom).parent().hasClass('slide-under-visible'));
  
});


QUnit.test("Destroy removes shim, container, masque", function(assert) {
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
  assert.deepEqual($('.slide-under-masque').length, 0);
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
