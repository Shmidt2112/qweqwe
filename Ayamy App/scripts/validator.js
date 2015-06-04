var validator = (function () {

    var v, element, validateAll = [];

    //Действия при невалидности
    function inputDo(input) {
        input.addClass("border-validate").hide().fadeIn("slow");
        setTimeout(function () {
            input.removeClass("border-validate");
        }, 3000);
    }

    //Действия при невалидности 2
    function inputDo2(mes) {
        $("span.tooltip").text(mes).slideDown("normal").delay(3000).slideUp("normal");
    }

    //Проверка на пустоту в input
    function isNotEmpty(input) {
        return !!input.val() || inputDo(input);
    }
    
    //Проверка времени, время доставки должно быть больше 22:46
    function checkTime (input) {
        var time = input.val().split(":");
        //Проверяем часы
        if (time.length > 1 && (+time[0] > 22 || +time[0] === 0)) {
            //alert("Время заказа не должно превышать 22:46");
            inputDo2("Время заказа не должно превышать 22:46");
            return false;
        } else if (+time[0] === 22) {
            //Проверяем минуты
            if (+time[1] > 45) {
                //alert("Время заказа не должно превышать 22:46");
                inputDo2("Время заказа не должно превышать 22:46");
            	return false;
            }
		}
        return true;
    }

    function validate(elem) {

        validateAll.length = 0;

        $(elem).find("input").each(function (index, elem) {

            element = $(elem);

            switch (element.attr("name")) {
                case "name":
                case "tel":
                case "street":
                case "house":
                case "porch":
                case "floor":
                case "flat":
                case "person":
                    {
                        if (isNotEmpty(element)) {
                            validateAll.push(true);
                        } else validateAll.push(false);
                        break; //Если поля заполнены хотя бы одним символом
                    }
                case "time":
                    {
                        if (checkTime(element)) {
                            validateAll.push(true);
                        } else validateAll.push(false);
                        
                    }
                    //В перспективе
                case "login":
                    {
                        // if (IsCorrectEmail(element)) { раскоментить!
                        /*  if (isNotEmpty(element)) {
                              validateAll.push(true);
                          } else validateAll.push(false);
                          break;*/
                    }
                case "password":
                    {
                        /*if (isCorrectPassword(element)) {
                             validateAll.push(true);
                             passwVal = element.val();
                         } else validateAll.push(false);
                         break;*/
                    }
                case "confirmPassword":
                    {
                        /*
                        if (passwVal) {
                            if (isNotEmpty(element)) {
                                if (element.val() === passwVal) {
                                    validateAll.push(true);
                                } else {
                                    inputDo(element, "* Пароли не совпадают. Повторите попытку");
                                    validateAll.push(false);
                                }
                            } else validateAll.push(false);
                        }
                        break;*/
                    }
            }
        });

        //Если все поля валидны, то отправляем форму на сервер
        for (v = 0; v < validateAll.length; v++) {
            if (!validateAll[v])
                return false;
        }
        return true;
    }

    return {
        validate: validate
    }

}());