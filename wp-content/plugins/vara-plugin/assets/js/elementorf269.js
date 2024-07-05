jQuery(document).ready(function($) {
  var themeBordersHeight;

  // Theme Borders Height
  function gradaThemeBordersHeight() {
    if ($('.gs-page-boundary').length) {
      themeBordersHeight = $('.gs-border-top').outerHeight();
    }
  }

  /**
   * Justified Gallery
   */
  function grada_justified_gallery() {
    var justified_gallery = $('.justified');

    if (justified_gallery) {
      justified_gallery.each(function() {
        var options = $(this)
          .parents('.elementor-element.elementor-widget')
          .data('settings');

        var rowHeight = options['justified_height'],
          margins = options['justified_margins'],
          lastRowOption = options['justified_last_row'];

        $(this).justifiedGallery({
            rowHeight: rowHeight ? rowHeight : 200,
            margins: 0,
            selector: '.iso-item',
            imgSelector: '.entry-image-ratio img',
            captions: false,
            waitThumnbailsLoad: false,
            lastRow: lastRowOption ? lastRowOption : 'justify'
        });
      });
    }
  }

  // Perfect Scrollbar
  if ($('.elementor-section').hasClass('gs-locked-section-on')) {
    new PerfectScrollbar('.gs-locked-section-on');
  }

  /**
   * Mega Menu Calculation
   */
  function gradaCalculateMegaMenu() {
    $('.elementor-widget-grada-nav-menu').each(function() {
      var $menu = $(this);

      var $navHolder = $menu.find('.widget-navigation-menu-wrapper');

      if (!$navHolder.hasClass('menu-navigation-regular')) {
        return;
      }

      var $subMenu = $navHolder.find('.menu-mega-dropdown > .sub-menu');
      var $elementorContainer = $menu.parents('.elementor-container');

      var columnPadding = parseInt(
        $menu.parents('.elementor-widget-wrap').css('paddingLeft')
      );

      var containerOffset = $elementorContainer.offset().left;
      var subMenuOffset = $navHolder.offset().left;

      var width = $elementorContainer.outerWidth() - columnPadding * 2;
      var offset = containerOffset - subMenuOffset + columnPadding;

      $subMenu.css({
        width: width,
        left: offset
      });
    });
  }

  /**
   * Mobile Menu Calculation
   */
  function gradaCalculateMobileMenu() {
    $('.navigation-menu-full-width.elementor-widget-grada-nav-menu').each(function() {
      var $menu = $(this);

      var $navHolder = $menu.find('.widget-mobile-nav-menu-wrapper');
      var $mobileMenu = $navHolder.find('.mobile-nav-menu');
      var $elementorContainer = $menu.parents('.elementor-container');

      var columnPadding = parseInt(
        $menu.parents('.elementor-widget-wrap').css('paddingLeft')
      );

      var columnLeftMargin = parseInt(
        $menu.find('.elementor-widget-container').css('marginLeft')
      );

      columnLeftMargin = columnLeftMargin ? columnLeftMargin : 0;

      var containerOffset = $elementorContainer.offset().left;
      var mobileMenuOffset = $navHolder.offset().left;

      var width = $elementorContainer.outerWidth() - columnPadding * 2;
      var offset =
        containerOffset - mobileMenuOffset + columnPadding + columnLeftMargin;

      $mobileMenu.css({
        width: width,
        left: offset
      });
    });
  }

  /**
   * Hamburger Menu
   */
  function gradaHamburgerMenu() {
    $('.elementor-widget-grada-nav-menu').each(function() {
      var $menu = $(this);

      $menu
        .find('.widget-mobile-nav-menu-wrapper .widget-mobile-nav-btn')
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();

          $menu
            .find('.widget-mobile-nav-menu-wrapper .mobile-nav-menu')
            .toggleClass('active');

          $menu
            .find(
              '.widget-mobile-nav-menu-wrapper .mobile-nav-menu .menu-item-has-children > .submenu-icon'
            )
            .removeClass('active');

          $menu
            .find('.widget-mobile-nav-menu-wrapper .mobile-nav-menu')
            .find('.sub-menu')
            .slideUp('fast');
        });
    });
  }

  function gradaLockedHiddenSections() {
    var $hidden_section = $('.gs-locked-section-on');
    if (
      $hidden_section.is('.elementor-hidden-tablet') &&
      $(window).width() > 730 &&
      $(window).width() < 1025
    ) {
      $hidden_section.hide();
    } else if (
      $hidden_section.is('.elementor-hidden-phone') &&
      $(window).width() < 730
    ) {
      $hidden_section.hide();
    } else {
      $hidden_section.show();
    }
  }

  function gradaMenuActiveOnScroll(event) {
    var scrollPosition = $(document).scrollTop();
    $('.menu-navigation-vertical ul li a').each(function() {
      var currentLink = $(this);
      var $parent = $(this).parents('.elementor-widget-grada-nav-menu');

      if (
        $parent.hasClass('navigation-menu-active-yes') &&
        currentLink.attr('href') !== '#' &&
        currentLink.attr('href').indexOf('#') !== -1
      ) {
        var ref = currentLink.attr('href').split('#');
        ref = typeof ref[1] !== 'undefined' ? ref[1] : ref[0];
        var refElement = $('#' + ref);
        if (refElement.length !== 0) {
          if (
            refElement.position().top <= scrollPosition &&
            refElement.position().top + refElement.height() > scrollPosition
          ) {
            currentLink.parents('li').addClass('active');
          } else {
            currentLink.parents('li').removeClass('active');
          }
        }
      }
    });
  }

    /**
     * Text Showcase
     */
    function textShowcaseHover() {
        var posts = $('.gs-text-showcase-holder');

        if ( posts.length ) {
            var element = $(".text-showcase-item");
            if (element.length) {
                $('body').append(
                    '<div id="text-showcase" class="text-showcase-img"></div>'
                );

                var image = $('.text-showcase-item img'),
                  textShowcase = $('#text-showcase'),
                  header = $('.gs-site-header-default');


                // Active
                if (posts.data('first-show') === 'yes') {
                    var first_post = posts.find(element[0]);

                    textShowcase.css(
                        'background-image',
                        'url(' + first_post.find(image).attr('src') + ')'
                    );

                    first_post.addClass('active');

                    header.css('background-color', 'transparent');

                    setTimeout(function() {
                        textShowcase
                            .addClass('active')
                            .attr('data-selector', posts.data('selector'));
                    }, 1);
                }

                posts
                    .find(element)
                    .on('mouseover', function(e) {
                        var $parent = $(this);

                        element.each(function() {
                            if ($(this).data('selector') === $parent.data('selector')) {
                                $parent.addClass('active');
                            } else {
                                $(this).removeClass('active');
                            }
                        });

                        textShowcase.css(
                            'background-image',
                            'url(' +
                            $(this)
                                .find(image)
                                .attr('src') +
                            ')'
                        );

                        header.css('background-color', 'transparent');

                        setTimeout(function() {
                            textShowcase
                                .addClass('active')
                                .attr('data-selector', posts.data('selector'));
                        }, 1);
                    });

            }
        }
    }

    /**
     * Text Follow
     */
    function portfolioTextFollow() {
        var textFollowHolder = $('.gs-entries-style-text-follow');

        if ( textFollowHolder.length ) {
            $('body').append(
                '<div id="text-follow" class="text-follow-holder"><div class="text-follow-inner"><svg width="42" height="42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 1v40M1 21h40" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="text-follow-subtitle"></span><h4 class="text-follow-title"></h4></div></div>'
            );

            var textFollow = $('#text-follow'),
                textFollowTitle = textFollow.find(
                    '.text-follow-title'
                ),
                textFollowSubtitle = textFollow.find(
                    '.text-follow-subtitle'
                ),
                titleSelector = '.portfolio-info .entry-details-title',
                subtitleSelector = '.portfolio-info .entry-details-meta';

            textFollowHolder.on('mousemove', function(e) {
                textFollow.css({
                    top: e.clientY,
                    left: e.clientX
                });
            });

            textFollowHolder.find('article .portfolio-item-holder')
                .on('mouseover', function(e) {
                    textFollowTitle.text(
                        $(this)
                            .find(titleSelector)
                            .text()
                    );
                    textFollowSubtitle.text(
                        $(this)
                            .find(subtitleSelector)
                            .text()
                    );

                    if (textFollowSubtitle.text().length <= 0) {
                        textFollowSubtitle.hide();
                    } else {
                        textFollowSubtitle.show();
                    }

                    setTimeout(function() {
                        textFollow
                            .addClass('visible')
                            .attr('data-entries-id', textFollowHolder.data('entries-id'));
                    }, 1);
                })
                .on('mouseout', function(e) {
                    textFollow.removeClass('visible');
                });
        }
    }

    gradaLockedHiddenSections();
  gradaCalculateMegaMenu();
  gradaCalculateMobileMenu();
  gradaHamburgerMenu();
  grada_justified_gallery();
  gradaMenuActiveOnScroll();
  textShowcaseHover();
  portfolioTextFollow();

  $(window).on('resize', function() {
    gradaLockedHiddenSections();
    gradaCalculateMegaMenu();
    gradaCalculateMobileMenu();
  });

  // Init Theme Borders Height
  gradaThemeBordersHeight();

  $('.gs-locked-section-invisible .gs-close-btn').css(
    'margin',
    themeBordersHeight
  );

  // Events
  $(window).on('resize', function() {
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      return;
    }

    gradaThemeBordersHeight();
  });

  $(document).on('scroll', gradaMenuActiveOnScroll);

});
