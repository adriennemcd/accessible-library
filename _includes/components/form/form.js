'use strict';

function form(formObj, i){
  var $form = formObj,
      $indx = i,
      $txtInputs = $form.querySelectorAll('.form__text'),
      $messages = $form.querySelector('.error__list'),
      $screenReaderErrors = $form.querySelector('.error__link'),
      $formValidation = {};

  function init() {
    handleEvents();
  }

  function handleEvents() {
    $txtInputs.forEach(function(input) {
      input.addEventListener('keyup', function(e){
        checkInputValidity(input);
        if (checkInputValidity(input)) {
          removeError(input);
          addSuccess(input);
        } else {
          removeSuccess(input);
        }
      });

      input.addEventListener('blur', function(e) {
        if (!checkInputValidity(input)) {
          addError(input);
        } else {
          removeError(input);
        }
      });
    });

    $form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Each time the user tries to send the data, we check if the form is valid.
      if ( checkFormValidity(this) ) {
        console.log('valid');
        //screenReaderErrors.removeClass("active");
        //messages.removeClass("active");
        //success.fadeIn("fast");
        //success.on("click", function(){ $(this).hide(); });
      } else {
        console.log('not valid');
        //handleFormErrors();
      }
    });
  }

  // Check validity
  function checkInputValidity(input){
    var valid = input.validity.valid;
    $formValidation[input.name] = valid;
    return valid;
  }

  function checkFormValidity(form){
    var formValid;
    
    // add input state to formValidation object
    // $(form).find("input[type='text']").each(function(i){
    //   checkInputValidity(this) ? formValidation[this.name] = true : formValidation[this.name] = false;
    // });

    // //check if any inputs are invalid
    // for ( var i in formValidation) {
    //   if ( formValidation[i] === false ) {
    //     formValid = false;
    //     break;
    //   } else {
    //     formValid = true;
    //   }
    // }
    // return formValid;
  }

  // Handle errors in the DOM
  function addError(input){
    var inputErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]');
    inputErrorMsg.classList.add('active');
    input.parentElement.classList.add('error');
    
    if (input.validity.valueMissing) {
      input.nextElementSibling.innerHTML = input.name+' is required';
      inputErrorMsg.innerHTML = input.name+' is required';
    } else {
      input.nextElementSibling.innerHTML = input.name+' format is invalid';
      inputErrorMsg.innerHTML = input.name+' format is invalid';
    }
  }

  function removeError(input){
    input.parentElement.classList.remove('error');
    $form.querySelector('a[data-input="'+input.name+'"]').classList.remove('active');
  }

  function addSuccess(input) {
    input.parentElement.classList.add('success');
  }

  function removeSuccess(input) {
    input.parentElement.classList.remove('success');
  }

  return {
    init: init
  }
};

//call the form module for each .form on the page
var forms = document.querySelectorAll('.form');
forms.forEach(function(formObj, i){
  var newForm = form(formObj, i);
  newForm.init();
});

