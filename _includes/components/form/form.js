'use strict';

function form(formObj, i){
  var $form = formObj,
      $indx = i,
      $txtInputs = $form.querySelectorAll('.form__text'),
      $messages = $form.querySelector('.error__list'),
      $message = $form.querySelectorAll('.error__item'),
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
      if ( checkFormValidity() ) {
        console.log('valid');
        $screenReaderErrors.classList.remove("active");
        $messages.classList.remove("active");
        //success.fadeIn("fast");
        //success.on("click", function(){ $(this).hide(); });
      } else {
        console.log('not valid');
        handleFormErrors();
      }
    });

    $screenReaderErrors.addEventListener('click', function(e){
      e.preventDefault();
      $messages.classList.add('active');
      $messages.querySelector('.error__item.active').focus();
    });

    $message.forEach(function(error) {
      error.addEventListener("click", function(e){
        e.preventDefault();
        var input = e.currentTarget.dataset.input;
        $form.querySelector("[name='"+input+"']").focus();
      });
    })
  }

  function handleFormErrors() {
    var count = 0;
    for ( var i in $formValidation) {
      if ( $formValidation[i] === false ) {
        count++;
        var inputEl = $form.querySelector('[name="'+i+'"]');
        addError(inputEl);
      }
    }
    $screenReaderErrors.innerHTML = ("There are "+count+" errors in the form you submitted. Review Errors.");
    $screenReaderErrors.classList.add('active');
    $screenReaderErrors.focus();
  }

  // Check validity
  function checkInputValidity(input){
    var valid = input.validity.valid;
    $formValidation[input.name] = valid;
    return valid;
  }

  function checkFormValidity(){
    var formValid;
    
    // add input state to formValidation object
    $txtInputs.forEach(function(input){
      checkInputValidity(input) ? $formValidation[input.name] = true : $formValidation[input.name] = false;
    });

    //check if any inputs are invalid
    for ( var i in $formValidation) {
      if ( $formValidation[i] === false ) {
        formValid = false;
        break;
      } else {
        formValid = true;
      }
    }
    return formValid;
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

