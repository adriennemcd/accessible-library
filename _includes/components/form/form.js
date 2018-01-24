'use strict';

function form(formObj){
  // validation pattern based off of the example in this article: https://cantina.co/form-errors-screen-readers-can-access/
  var $form = formObj,
      $allInputs = $form.querySelectorAll('.js-form__input'),
      $txtInputs = $form.querySelectorAll('[type^="te"].js-form__input, textarea.js-form__input'),
      $collectionInputs = $form.querySelectorAll('.js-form__fieldset'),
      $selectInputs = $form.querySelectorAll('select.js-form__input'),
      $errorSummaryLink = $form.querySelector('.js-form__error-link'),
      $errorList = $form.querySelector('.js-form__error-list'),
      $formValidation = {};

  function init() {
    polyfillsES6();
    handleEvents();
  }

  // INITIALIZE ALL EVENT LISTENERS ====================================

  function handleEvents() {
    function updateItemValidityState(e){ 
      // don't check for an error when the user first tabs into an input field
      if (e.key !== 'Tab' && !checkInputValidity(this)) {
        addError(this);
      } else if (e.key !== 'Tab') {
        removeError(this);
      } 
    }

    $txtInputs.forEach(function(input) {
      // check validity when typing in text/tel inputs and when focus leaves text/tel inputs
      input.addEventListener('keyup', updateItemValidityState);
      input.addEventListener('blur', updateItemValidityState);

      if (input.classList.contains('js-form__date')) input.addEventListener('keyup', formatDate);
    });

    // check validity when radio buttons and checkboxes are selected or when focus leaves them
    $collectionInputs.forEach(function(group){
      var groupItems = group.querySelectorAll('.js-form__input');
      function updateGroupValidityState(){
        !checkInputValidity(group) ? addError(this) : removeError(this); 
      }
      groupItems.forEach(function(input){
        input.addEventListener('click', updateGroupValidityState);
        input.addEventListener('blur', updateGroupValidityState);
      });
    });

    // check validity when select option is changed and when focus leaves select
    $selectInputs.forEach(function(select){
      select.addEventListener('change', updateItemValidityState);
      select.addEventListener('blur', updateItemValidityState);
    });

    // check validity when form is submitted
    $form.addEventListener('submit', function(e) {
      e.preventDefault();
      if ( checkFormValidity() ) {
        alert('Form is valid!'); // CHANGE TO SEND DATA TO SERVER
        $errorSummaryLink.classList.remove("active");
        $errorList.classList.remove("active");
        cleanPhone();
      } else {
        console.log('not valid');
        handleFormErrors();
      }
    });

    // listen for when hidden screen reader error summary link is clicked
    $errorSummaryLink.addEventListener('click', function(e){
      e.preventDefault();
      $errorList.classList.add('active');
      $errorList.querySelector('.js-form__error-item.active').focus();
    });

    // listen for when hidden screen reader error description links are clicked
    $errorList.addEventListener('click', function(e){
      e.preventDefault();
      var input = e.target.dataset.input;
      $form.querySelector("[name='"+input+"']").focus();
    })
  }

  // CHECK INPUT AND FORM VALIDITY =====================================

  function checkInputValidity(input){
    var valid,
        groupItems;
    if(input['type'] === 'fieldset') {
      // radio buttons and checkboxes
      var groupItemCount = 0;
      groupItems = input.querySelectorAll('.js-form__input');
      groupItems.forEach(function(item) {
        item.checked ? groupItemCount++ : groupItemCount;
      });
      valid = groupItemCount > 0 ? true : false;
      $formValidation[input.dataset.name] = valid;
      return valid;
    } 
    else if (input['type'].indexOf('select') >= 0) {
      // select-one or select-many form items
      valid = input.selectedIndex !== 0 ? true : false;
      $formValidation[input.name] = valid;
      return valid;
    } 
    else {
      // all other form items
      valid = input.validity.valid;
      $formValidation[input.name] = valid;
      return valid;
    }  
  }

  function checkFormValidity(){
    var formValid;

    // build the screen reader error messages
    function buildErrorMessages(){
      var errorMessageHTML = [];
      $allInputs.forEach(function(input){
        var inputHTML = '<a href="#" class="js-form__error-item" data-input="';
            inputHTML += input['name'];
            inputHTML += '"></a>';
        if (errorMessageHTML.indexOf(inputHTML) == -1) errorMessageHTML.push(inputHTML);
      });
      $errorList.innerHTML = errorMessageHTML.join('');
    }
    
    // add input state to formValidation object
    $txtInputs.forEach(function(input){
      $formValidation[input.name] = checkInputValidity(input) ? true : false;
    });
    $collectionInputs.forEach(function(input){
      $formValidation[input.dataset.name] = checkInputValidity(input) ? true : false;
    });
    $selectInputs.forEach(function(input){
      $formValidation[input.name] = checkInputValidity(input) ? true : false;
    });

    //check if any inputs are invalid
    for ( var i in $formValidation) {
      if ( $formValidation[i] === false ) {
        formValid = false;
        buildErrorMessages();
        break;
      } else {
        formValid = true;
      }
    }
    return formValid;
  }

  // HANDLE ERRORS =====================================================

  function handleFormErrors() {
    var count = 0;
    for ( var i in $formValidation) {
      if ( $formValidation[i] === false ) {
        count++;
        var inputEl = $form.querySelector('[name="'+i+'"]');
        addError(inputEl);
      }
    }
    $errorSummaryLink.innerHTML = ("There are "+count+" errors in the form you submitted. Press enter to review Errors.");
    $errorSummaryLink.classList.add('active');
    $errorSummaryLink.focus();
  }

  // Handle errors in the DOM
  function addError(input){
    var srErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]'),
        capitalInput = input.name.charAt(0).toUpperCase() + input.name.slice(1),
        wrapper = input.closest('.js-form__item'),
        inputErrorMsg = wrapper.querySelector('.js-form__error-message');

    if (srErrorMsg) srErrorMsg.classList.add('active'); // if form hasn't been submitted, these links won't have been created yet
    wrapper.classList.add('error');
    
    if (input.validity.valueMissing || input['type'].indexOf('select') >= 0 || input['type'] == 'checkbox') {
      inputErrorMsg.innerHTML = capitalInput+' is required';
      if (srErrorMsg) srErrorMsg.innerHTML = capitalInput+' is required. Press enter to edit.';
    } else {
      inputErrorMsg.innerHTML = capitalInput+' format is invalid';
      if (srErrorMsg) srErrorMsg.innerHTML = capitalInput+' format is invalid. Press enter to edit.';
    }
  }

  function removeError(input){
    var wrapper = input.closest('.js-form__item'),
        srErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]');
    wrapper.classList.remove('error');
    // if form hasn't been submitted, these links won't have been created yet
    if (srErrorMsg) srErrorMsg.classList.remove('active');
  }

  // UTILITY FUNCTIONS =================================================

  function cleanPhone(){
    // remove all non-digit characters from phone input before submission
    var phoneInputs = $form.querySelectorAll('.js-form__phone');
    phoneInputs.forEach(function(input){
      input.value = input.value.replace(/\D/g,'');
    });
  }

  function formatDate(e){
    // add date formatting as the user types
    if (e.key !== 'Tab') {
      switch (e.target.value.length) {
        case 2:
        case 5:
          if (e.key !== 'Delete' && e.key !== 'Backspace') {
            e.target.value = e.target.value + '/';
          } else {
            e.target.value = e.target.value.slice(0,e.target.value.length-1);
          }
          break;
      }
    }
  }

  function polyfillsES6(){
    // MDN polyfill: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                  Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1); 
        return null;
      };
    }
  }

  return {
    init: init
  }
};

//call the form module for each .form on the page
document.querySelectorAll('.js-form').forEach(function(formObj){
  form(formObj).init();
});

