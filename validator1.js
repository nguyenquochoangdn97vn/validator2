        function Validator(options){
         var selectorRules = {};
         //message lỗi
         // tìm cha
         function getParent(element, selector){
          while(element.parentElement){
               if(element.parentElement.matches(selector)){
                return element.parentElement;
               }
               element = element.parentElement;
          }
         }
         function Validate(inputElement, rule){
           var errorElement = getParent(inputElement , options.formGroupselector).querySelector(options.errorSelector);
           var errorMessage;
           var rules = selectorRules[rule.selector];
           for(var i = 0; i < rules.length; ++i) { // chạy lần lượt isrequired hoặc isemail
              switch(inputElement.type){
                 case 'radio':
                 case 'checkbox':
                  errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default :
                errorMessage = rules[i](inputElement.value);
              }
              if(errorMessage) break;
           }
           if(errorMessage){
              errorElement.innerText = errorMessage;
             getParent(inputElement , options.formGroupselector).classList.add('invalid');
           }
           else{
            errorElement.innerText = '';
             getParent(inputElement , options.formGroupselector).classList.remove('invalid');
           }
           return !errorMessage;
         }
         var formElement = document.querySelector(options.form);
         if(formElement){
            // submit 
           formElement.onsubmit = function(e){
               e.preventDefault();
               var isFormvalid = true;
               options.rules.forEach(function(rule){
               var inputElement = formElement.querySelector(rule.selector);
               var isValid = Validate(inputElement, rule);
               if(!isValid){
                  isFormvalid = false;
               }
               });
               if(isFormvalid){
                  if(typeof options.onSubmit === 'function') { 
                  var enableInput = formElement.querySelectorAll('[name]');
                  var formValues = Array.from(enableInput).reduce(function(values, input){
                     switch(input.type){
                     case 'radio':
                     case 'checkbox':                                                               
                         values[input.name] = formElement.querySelector('input[name ="' + input.name +'" ]:checked').value;
                       break; 
                         default:
                         values[input.name] = input.value;
                     }
                     return values;
                  },{});
                  options.onSubmit(formValues);
                  }
                  else{ formElement.onsubmit();
                  }
               }
               
            }
            options.rules.forEach(function(rule){
              var inputElements = formElement.querySelectorAll(rule.selector);
              // lưu các rules
              if(Array.isArray(selectorRules[rule.selector])){
               selectorRules[rule.selector].push(rule.test);
              }
              else{
               selectorRules[rule.selector] = [rule.test];
              }
              // 
              Array.from(inputElements).forEach(function(inputElement){
                    //on blur
                inputElement.onblur = function(){
                  Validate(inputElement, rule);
                }
              
         // oninput 
                inputElement.oninput = function(){
                  errorElement = getParent(inputElement , options.formGroupselector).querySelector(options.errorSelector);
                  errorElement.innerText = '';
                  getParent(inputElement , options.formGroupselector).classList.remove('invalid');
               } 
              })
            });
         }
         }
        
      
   //
   Validator.isRequired = function(selector){
      return {
         selector: selector,
         test: function(value){
           return value ? undefined : 'vui lòng nhập trường này';
         }
      }
   }
   Validator.isEmail = function(selector, message){
      return {
         selector: selector,
         test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'giá trị không chính xác';
         }
      }
   }
   Validator.mingLength = function(selector, min){
      return {
         selector:selector,
         test: function(value){ 
        return value.length >= min ? undefined : `vui lòng nhập tối thiểu ${min} ký tự`;
         }
      }
   }
   Validator.isConfirmed = function(selector, getConfirmed, message){
      return {
         selector: selector,
         test: function(value){
           return value === getConfirmed() ? undefined : message || 'giá trị không chính xác';
         }
      }
   }