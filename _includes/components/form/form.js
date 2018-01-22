'use strict';

function form(formObj){
  var $form = formObj,
      $txtInputs = $form.querySelectorAll('.form__text'),
      $collectionInputs = $form.querySelectorAll('.form__fieldset'),
      $selectInputs = $form.querySelectorAll('.form__select'),
      $screenReaderErrors = $form.querySelector('.error__link'),
      $errorList = $form.querySelector('.error__list'),
      $errorItem = $form.querySelectorAll('.error__item'),
      $formValidation = {};

  function init() {
    handleEvents();
  }

  // INITIALIZE ALL EVENT LISTENERS ====================================

  function handleEvents() {
    function checkItemValidity(){ !checkInputValidity(this) ? addError(this) : removeError(this); }

    $txtInputs.forEach(function(input) {
      // check validity when typing in text inputs
      input.addEventListener('keyup', function(e){
        checkInputValidity(this);
        if (checkInputValidity(this)) {
          removeError(this);
          addSuccess(this);
        } else {
          removeSuccess(this);
        }
      });

      // check validity when focus leaves text inputs
      input.addEventListener('blur', checkItemValidity);
    });

    // check validity when focus leaves radio buttons and checkboxes
    $collectionInputs.forEach(function(group){
      var groupItems = group.querySelectorAll('.form__input');
      groupItems.forEach(function(input){
        input.addEventListener('click', function(){
          !checkInputValidity(group) ? addError(this) : removeError(this);
        });
        input.addEventListener('blur', function(){
          !checkInputValidity(group) ? addError(this) : removeError(this);
        });
      });
    });

    // check validity when focus leaves select
    $selectInputs.forEach(function(select){
      select.addEventListener('change', checkItemValidity);
      select.addEventListener('blur', checkItemValidity);
    });

    // check validity when form is submitted
    $form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Each time the user tries to send the data, we check if the form is valid.
      if ( checkFormValidity() ) {
        console.log('valid');
        $screenReaderErrors.classList.remove("active");
        $errorList.classList.remove("active");
        //success.fadeIn("fast");
        //success.on("click", function(){ $(this).hide(); });
      } else {
        console.log('not valid');
        handleFormErrors();
      }
    });

    // listen for when hidden screen reader error link is clicked
    $screenReaderErrors.addEventListener('click', function(e){
      e.preventDefault();
      $errorList.classList.add('active');
      $errorList.querySelector('.error__item.active').focus();
    });

    // listen for when hidden screen reader error descriptions are clicked
    $errorItem.forEach(function(error) {
      error.addEventListener("click", function(e){
        e.preventDefault();
        var input = e.currentTarget.dataset.input;
        $form.querySelector("[name='"+input+"']").focus();
      });
    })
  }

  // CHECK INPUT AND FORM VALIDITY =====================================

  function checkInputValidity(input){
    var valid,
        groupItems;
    if(input['type'] === 'fieldset') {
      // radio buttons and checkboxes
      var groupItemCount = 0;
      groupItems = input.querySelectorAll('.form__input');
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
        break;
      } else {
        formValid = true;
      }
    }
    return formValid;
  }

  // HANDLE ERRORS =====================================================

  function handleFormErrors() {
    console.log($formValidation);
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

  // Handle errors in the DOM
  function addError(input){
    console.log(input);
    var srErrorMsg = $form.querySelector('a[data-input="'+input.name+'"]');
    var capitalInput = input.name.charAt(0).toUpperCase() + input.name.slice(1);
    var wrapper = input.closest('.form__item'); // NEED .CLOSEST POLYFILL FOR IE10, IE11
    var inputErrorMsg = wrapper.querySelector('.form__error-message');

    srErrorMsg.classList.add('active');
    wrapper.classList.add('error');
    
    if (input.validity.valueMissing) {
      inputErrorMsg.innerHTML = capitalInput+' is required';
      srErrorMsg.innerHTML = capitalInput+' is required';
    } else {
      inputErrorMsg.innerHTML = capitalInput+' format is invalid';
      srErrorMsg.innerHTML = capitalInput+' format is invalid';
    }
  }

  function removeError(input){
    var wrapper = input.closest('.form__item');
    wrapper.classList.remove('error');
    $form.querySelector('a[data-input="'+input.name+'"]').classList.remove('active');
  }

  function addSuccess(input) {
    var wrapper = input.closest('.form__item');
    wrapper.classList.add('success');
  }

  function removeSuccess(input) {
    var wrapper = input.closest('.form__item');
    wrapper.classList.remove('success');
  }

  return {
    init: init
  }
};

//call the form module for each .form on the page
var forms = document.querySelectorAll('.js-form');
forms.forEach(function(formObj){
  var newForm = form(formObj);
  newForm.init();
});

