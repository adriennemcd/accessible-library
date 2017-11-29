var accordion = (function(){
  function setAttributes(el, options) {
    // enable setting of multiple attributes at once on an element
    Object.keys(options).forEach(function(attr) {
      el.setAttribute(attr, options[attr]);
    })
  }

  function getIndex(el) {
    // get accordion's children of type 'DT', the tab containers.
    // return index of current tab, array of children
    var c = el.parentNode.children, nodeArr = [];
    for(i = 0; i < c.length; i++) {
      if (c[i].nodeName == 'DT') nodeArr.push(c[i]);
    }
    for(i = 0; i < nodeArr.length; i++ ) {
        if( nodeArr[i] == el ) return [i, nodeArr];
    }
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
        $tab[i].addEventListener('click', function(e){
          var $clickedTab = e.currentTarget.parentNode; // a tab is nested within tab container
          e.preventDefault();
          _.openSlide($clickedTab,$panel,'.accordion__icon');
        });

        $tab[i].addEventListener('keydown', function(e){
          var $clickedTab = e.currentTarget.parentNode;

          // enter or spacebar
          // open/close the accordion tabs
          if ( e.code == 'Space' || e.code == 'Enter' ) {
            e.preventDefault();
            _.openSlide($clickedTab,$panel,'.accordion__icon');
          } 
          // left or up arrow keys
          // move focus to previous accordion tab
          else if ( e.code == 'ArrowUp' || e.code == 'ArrowLeft' ) {
            e.preventDefault();
            _.goPrev($clickedTab);
          }
          // down or right arrow keys
          // move focus to next accordion tab
          else if ( e.code == 'ArrowDown' || e.code == 'ArrowRight' ) {
            e.preventDefault();
            _.goNext($clickedTab);
          }
          // HOME key || HOME NUMPAD key
          // move focus to first accordion tab
          else if ( e.code == 'Home' || e.code == 'Numpad7' ) {
            e.preventDefault();
            _.goFirst($clickedTab);
          }
          // END key || END NUMPAD key
          // move focus to last accordion tab
          else if ( e.code == 'End' || e.code == 'Numpad1' ) {
            e.preventDefault();
            _.goLast($clickedTab);
          }
        });   
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

    goPrev: function(tab) {
      var indexInfo = getIndex(tab);
      if (indexInfo[0] == 0) index = indexInfo[1].length - 1;
      else index = indexInfo[0] - 1;
      var prevTab = indexInfo[1][index];
      prevTab.children[0].focus();
    },

    goNext: function(tab) {
      var indexInfo = getIndex(tab);
      if (indexInfo[0] == indexInfo[1].length - 1) index = 0;
      else index = indexInfo[0] + 1;
      var nextTab = indexInfo[1][index];
      nextTab.children[0].focus();
    },

    goFirst: function(tab) {
      var parent = tab.parentNode.getAttribute('id');
      var firstTab = document.querySelector("#" + parent + " ." + tab.getAttribute('class') + ":first-of-type > a");
      firstTab.focus();
    },

    goLast: function(tab) {
      var parent = tab.parentNode.getAttribute('id');
      var lastTab = document.querySelector("#" + parent + " ." + tab.getAttribute('class') + ":last-of-type > a");
      lastTab.focus();
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
      var _ = this,
          $headings = $accordion.getElementsByClassName(_.settings.$heading),
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
