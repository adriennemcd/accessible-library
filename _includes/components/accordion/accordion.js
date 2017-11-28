var accordion = (function(){
  function setAttributes(el, options) {
    Object.keys(options).forEach(function(attr) {
      el.setAttribute(attr, options[attr]);
    })
  }

  return {
    settings: {
      $accordion: 'accordion',
      $heading: 'accordion__tab-container',
      $tab: 'accordion__tab',
      $panel: 'accordion__panel'
    },

    init: function() {
      var _ = this;

      _.bindAria(document.getElementsByClassName(_.settings.$accordion));
      _.initEvents();
    },

    initEvents: function() {
      var _ = this,
          $tab = document.getElementsByClassName(_.settings.$tab),
          $panel = document.getElementsByClassName(_.settings.$panel);

      for(var i=0; i < $tab.length; i++){
        $tab[i].addEventListener("click", function(e){
          var $clickedTab = e.currentTarget.parentNode; // a tab is nested within tab container, easier to deal with tab-container for events
          
          // click, enter, or spacebar
          // open/close the accordion tabs
          if ( e.type == 'click' || e.keyCode == 13 || e.keyCode == 32 ) {
            e.preventDefault();
            _.openSlide($clickedTab,$panel,'.accordion__icon');
          } 
          // left or up arrow keys
//         // move focus to previous accordion tab
//         else if ( e.keyCode == 37 || e.keyCode == 38 ) {
//           e.preventDefault();
//           events.goPrev($clickedTab);
//         }
//         // down or right arrow keys
//         // move focus to next accordion tab
//         else if ( e.keyCode == 39 || e.keyCode == 40 ) {
//           e.preventDefault();
//           events.goNext($clickedTab);
//         }
//         // HOME key || HOME NUMPAD key
//         // move focus to first accordion tab
//         else if ( e.keyCode == 36 || e.keyCode == 103 ) {
//           e.preventDefault();
//           events.goFirst($clickedTab);
//         }
//         // END key || END NUMPAD key
//         // move focus to last accordion tab
//         else if ( e.keyCode == 35 || e.keyCode == 97 ) {
//           e.preventDefault();
//           events.goLast($clickedTab);
//         }
        }, false);   
      }
    },

    openSlide: function(tab, panel, icon) {
      var _ = this,
          tabLink = tab.querySelector('.accordion__tab');

      // toggle visiblity of tabel panel as well as aria attributes
      // for tab panel and tab container
      if ( tab.querySelector(icon).classList.contains('open') ){
        _.setAriaHidden(tabLink, tab.nextElementSibling);
        tab.nextElementSibling.classList.remove('open');
        tab.querySelector(icon).classList.remove('open');
      } else {
        _.setAriaVisible(tabLink, tab.nextElementSibling);
        tab.nextElementSibling.classList.add('open');
        tab.querySelector(icon).classList.add('open');
      }
    },

    setAriaVisible: function($clickedTab, $clickedPanel) {
      $clickedTab.setAttribute('aria-expanded', 'true');
      $clickedPanel.setAttribute('aria-hidden', 'false');
    },

    setAriaHidden: function($clickedTab, $clickedPanel) {
      $clickedTab.setAttribute('aria-expanded', 'false');
      $clickedPanel.setAttribute('aria-hidden', 'true');
    },

    bindAria: function($accordion) {
      var _ = this;

      for(var i=0; i < $accordion.length; i++){
        $accordion[i].setAttribute('id', 'accordion_' + i);
        _.setAccordionAttributes($accordion[i], i);
      };
    },

    setAccordionAttributes: function($accordion, i) {
      var $headings = $accordion.getElementsByClassName(_.settings.$heading),
          $tabs = $accordion.getElementsByClassName(_.settings.$tab),
          $panels = $accordion.getElementsByClassName(_.settings.$panel);

      for(var j=0; j < $headings.length; j++){
        setAttributes($headings[j], {
          'role': 'heading',
          'aria-level': '3',
        });
      };

      for(var j=0; j < $tabs.length; j++){
        setAttributes($tabs[j], {
          'id': 'a' + i + '_tab' + j,
          'role': 'button',
          'aria-expanded': 'false',
          'aria-controls': 'a' + i + '_panel' + j
        });
      };
        
      for(var j=0; j < $panels.length; j++){
        setAttributes($panels[j], {
          'id': 'a' + i + '_panel' + j,
          'role': 'region',
          'aria-hidden': 'true',
          'aria-labelledby': 'a' + i + '_tab' + j
        });
      };
    }
  }
}())

accordion.init();



//     initEvents: function() {
//       var _ = this;

//       _.settings.$tab.off().on('click keydown', function(e) {
//         let $clickedTab = $(this).parent(); // a tag is nested within tab container, easier to deal with tab-container for events
//         let $panel = _.settings.$panel;

//         // click, enter, or spacebar
//         // open/close the accordion tabs
//         if ( e.type == 'click' || e.keyCode == 13 || e.keyCode == 32 ) {
//           e.preventDefault();
//           events.openSlide($clickedTab,$panel,'.accordion__icon');
//         } 
//         // left or up arrow keys
//         // move focus to previous accordion tab
//         else if ( e.keyCode == 37 || e.keyCode == 38 ) {
//           e.preventDefault();
//           events.goPrev($clickedTab);
//         }
//         // down or right arrow keys
//         // move focus to next accordion tab
//         else if ( e.keyCode == 39 || e.keyCode == 40 ) {
//           e.preventDefault();
//           events.goNext($clickedTab);
//         }
//         // HOME key || HOME NUMPAD key
//         // move focus to first accordion tab
//         else if ( e.keyCode == 36 || e.keyCode == 103 ) {
//           e.preventDefault();
//           events.goFirst($clickedTab);
//         }
//         // END key || END NUMPAD key
//         // move focus to last accordion tab
//         else if ( e.keyCode == 35 || e.keyCode == 97 ) {
//           e.preventDefault();
//           events.goLast($clickedTab);
//         }
//       });
//     },

//     destroy: function() { }
//   };
// });