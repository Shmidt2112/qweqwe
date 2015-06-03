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
        $("span#error").text(mes).slideDown("slow").delay(3000).slideUp("slow");
    }

    //Проверка на пустоту в input
    function isNotEmpty(input) {
        return !!input.val() || inputDo(input);
    }

    function validate (elem) {

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