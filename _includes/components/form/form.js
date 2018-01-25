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
      !checkInputValidity(this) ? addError(this, false) : removeError(this);
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
        !checkInputValidity(group) ? addError(this, false) : removeError(this); 
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

    // listen for when screen reader error summary link is clicked
    $errorSummaryLink.addEventListener('click', function(e){
      e.preventDefault();
      $errorList.classList.add('active');
      $errorList.querySelector('.js-form__error-item.active a').focus();
    });

    // listen for when screen reader error description links are clicked
    $errorList.addEventListener('click', function(e){
      e.preventDefault();
      $form.querySelector("[name='"+e.target.dataset.input+"']").focus();
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
        var inputHTML = '<li class="form__error-item js-form__error-item"><a href="#" data-input="';
            inputHTML += input['name'];
            inputHTML += '"></a></li>';
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
        addError(inputEl, true);
      }
    }
    $errorSummaryLink.innerHTML = ("There are "+count+" errors in the form you submitted.");
    $errorSummaryLink.classList.add('active');
    $errorSummaryLink.focus();
  }

  // Handle errors in the DOM
  function addError(input, formSubmit){
    var inputParent = input.closest('.js-form__item'),
        capitalizedInput = input.name.charAt(0).toUpperCase() + input.name.slice(1),
        inputErrorMsg = inputParent.querySelector('.js-form__error-message'),
        srErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]');
    
    switch (formSubmit) {
      case true:
        // we are adding errors after the form has been submitted. Ascertain whether this is a 'required' or 'invalid' error
        if (input.validity.valueMissing || input['type'].indexOf('select') >= 0 || input['type'] == 'checkbox') {
          inputErrorMsg.innerHTML = capitalizedInput+' is required';
          if (srErrorMsg) srErrorMsg.innerHTML = capitalizedInput+' is required.';
        } else {
          inputErrorMsg.innerHTML = capitalizedInput+' format is invalid';
          if (srErrorMsg) srErrorMsg.innerHTML = capitalizedInput+' format is invalid.';
        }
        if (srErrorMsg) srErrorMsg.parentElement.classList.add('active'); // if form hasn't been submitted, these links won't have been created yet
        inputParent.classList.add('error');
        break;
      case false:
        // we are adding just-in-time 'invalid' errors only as the user types. 'Required' errors are ignored until form submit
        if (!input.validity.valueMissing && (input.type == 'text' || input.type == 'tel') ||
            input.checked && input['type'].indexOf('select') >= 0 ||
            input.checked && input['type'] == 'checkbox') {
          inputErrorMsg.innerHTML = capitalizedInput+' format is invalid';
          if (srErrorMsg) {
            srErrorMsg.innerHTML = capitalizedInput+' format is invalid.';
            srErrorMsg.parentElement.classList.add('active');
          } 
          inputParent.classList.add('error');
        }
        break;
    }
  }

  function removeError(input){
    var inputParent = input.closest('.js-form__item'),
        srErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]'),
        initErrorCount = $errorList.querySelectorAll('.active').length,
        newErrorCount;
    inputParent.classList.remove('error');

    // if form hasn't been submitted (removing an inline invalid error), these links won't have been created yet
    if (srErrorMsg) srErrorMsg.parentElement.classList.remove('active');

    // update error count. Hide the summary message if all errors are fixed
    newErrorCount = $errorList.querySelectorAll('.active').length;
    switch (newErrorCount) {
      case 0:
        $errorSummaryLink.classList.remove('active');
        $errorList.classList.remove('active');
        break;
      case 1: 
        $errorSummaryLink.innerHTML = ("There is "+newErrorCount+" error in the form you submitted.");
        break;
      default:
        $errorSummaryLink.innerHTML = ("There are "+newErrorCount+" errors in the form you submitted.");
    }
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

