var app = (function () {

    var dataSource, sum, curId, listviews, timer,
        mobileApp = {},
        purchase = [],
        purchaseHist = [],
        dirName = "Ayamy",
        fileName = "AyamyHistory.txt",
        userFile = "AyamyUser.txt",
        groupedData = [
            {
                id: 0,
                name: "Sashimi Salad",
                description: "Зелень, украшеная свежими сашими, васаби, соевый винегрет.",
                url: "images/sashimi-salad.jpg",
                price: 170,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 1,
                name: "Seaweed Salad",
                description: "Салат из морепродуктов.",
                url: "images/seaweed-salad.jpg",
                price: 290,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 2,
                name: "Edamame",
                description: "Вареные соевые бобы с солью.",
                url: "images/edamame.jpg",
                price: 120,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 3,
                name: "Maguro",
                description: "Кусочки из лосося.",
                url: "images/maguro.jpg",
                price: 150,
                letter: "Суши",
                hash: "sushi"
            },
            {
                id: 4,
                name: "Tekka Maki",
                description: "Тунец-ролл с васаби.",
                url: "images/tekka-maki.jpg",
                price: 240,
                letter: "Суши",
                hash: "sushi"
            },
            {
                id: 5,
                name: "California",
                description: "Крабовые палочки, авокадо и огурец.",
                url: "images/california-rolls.jpg",
                price: 250,
                letter: "Суши",
                hash: "sushi"
            }
    ];

    dataSource = new kendo.data.DataSource({
        data: groupedData,
        group: "letter",
        filter: {
            field: "name",
            operator: "startswith",
            value: ""
        },
        schema: {
            model: {
                id: "id"
            }
        }
    });

    var Item = function (id) {
        this.id = id;
        this.price = dataSource.get(curId).price;
        this.name = dataSource.get(curId).name;
        this.count = 1;
        this.total = dataSource.get(curId).price;
        this.url = dataSource.get(curId).url;
    };

    var ItemHist = function (id, count, price) {
        this.id = id;
        this.price = price;
        this.count = count;
    };

    var User = function (name, tel, street, house, porch, floor, flat) {
        this.name = name;
        this.telephone = tel;
        this.street = street;
        this.house = house;
        this.porch = porch;
        this.floor = floor;
        this.flat = flat;
    }

    function initialize() {
        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });
    }

    function initMain() {
        //Считываем с текстового файла всю историю
        rwd.read(dirName, fileName);
        //Устанавливаем начальный список
        $("#main-list").kendoMobileListView({
            dataSource: dataSource,
            filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "     поиск..."
            },
            template: $("#main-template").html(),
            headerTemplate: "<h4 id='#= data.items[0].hash #' style='color:gray;margin:5px;'>${value}</h4>"
        });
        /*$("#qrCode").kendoQRCode({
            value: "https://bit.ly/1GdCozW",
            size: 240
                // background: "red"
        });*/

    }

    function showMain(e) {
        //Устанавливаем скрол в первоначальную позицию
        e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
        //Сбрасываем фильтр в начальное состояние
        dataSource.filter({
            field: "name",
            operator: "startswith",
            value: "",
            placeholder: "поиск..."
        });
        //Определяем тип параметра либо хэш либо ингредиент
        if (e.view.params.hasOwnProperty("hash")) {
            var el = $("#" + e.view.params.hash);
            //Если элемент существует
            if (el.hasOwnProperty("length")) {
                //Получаем позицию элемента
                var pos = el.offset();
                //Устанавливаем скролл на эту позицию
                e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, -" + (pos.top - 70) + "px, 0px) scale(1)");
            }
        } else if (e.view.params.hasOwnProperty("item")) {
            //Фильтруем существующий список по терму
            dataSource.filter({
                field: "description",
                operator: "contains",
                ignoreCase: true,
                value: e.view.params.item
            });
        }
    }

    function hideMain(e) {
        //Устанавливаем скрол в первоначальную позицию
        e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
        //Сбрасываем фильтр в начальное состояние
        dataSource.filter({
            field: "name",
            operator: "startswith",
            value: "",
            placeholder: "поиск..."
        });
    }

    //Подводим итог
    function agregate() {
        //Суммируем все елементы массива и заносим в корзину
        sum = 0;
        for (var j = 0; j < purchase.length; j++) {
            sum += purchase[j].total;
        }
        $("#basket").text(sum);
    }

    function plus(e) {
        //Получаем текущий объект по id
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).prev().data("id")) {
                //Увеличиваем на кол-во на 1
                purchase[i].count++;
                //Заносим в текущий элемент
                $(e.target).prev().text(purchase[i].count);
                //Устанавливаем новую стоимость
                purchase[i].total = purchase[i].count * purchase[i].price;
                break;
            }
        }
        agregate();
    }

    function animationImg(id) {
        var obj = $("#img" + id);
        var w = $(obj).width();
        var directionAnimate = +$("#img" + id).data("direct");

        if (w > 0 && directionAnimate == 0) { ///если ширина >  0, уменьшаем ширину блока на 5px 
            $(obj).css('width', w - 15 + "px");
            $(obj).css('height', 75 + "px");
        }

        if (w < 75 && directionAnimate == 1) ///если ширина < 75, уменьшаем ширину блока на 5px
        {
            $(obj).css('width', w + 15 + "px");
            $(obj).css('height', 75 + "px");
        }

        if (w == 0 && directionAnimate == 0) { ///если нет, разрушим интервал (перестанем вызывать функцию animation()) 
            directionAnimate = 1;
            $("#img" + id).data("direct", directionAnimate);
            clearInterval(timer);
        }

        if (w == 75 && directionAnimate == 1) { ///если нет, разрушим интервал (перестанем вызывать функцию animation())  
            directionAnimate = 0;
            $("#img" + id).data("direct", directionAnimate);
            clearInterval(timer);
        }

    }

    function minus(e) {
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).next().data("id")) {
                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    break;
                } else {
                    var button = $(e.target).closest('li').find('a.prices');
                    //$("#" + $(e.target).next().data("id")).slideToggle("normal");
                    //var a = $(e.target).data("on");
                    //Ищем полное кол-во по текущему итему
                    for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        if ($(e.target).next().data("id") === purchase[i].id) {
                            //Удаляем итем из общего массива
                            purchase.splice(i, 1);
                            $("span[data-id='" + $(e.target).next().data("id") + "']").text(1);
                        }
                    }
                    //agregate();
                    $(button).data("on", false);
                    var directionAnimate = parseInt($("#" + $(e.target).next().data("direct")));
                    if (directionAnimate == 0) {
                        $("#" + $(e.target).next().data("id")).fadeToggle("fast");
                        //setTimeout(function(){ $("#" + $(e.target).next().data("id")).fadeToggle("fast");}, 300);
                        //$(button).css("display", "block");
                        //setTimeout(function(){ $(button).fadeToggle("fast");}, 300);
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 400);
                    } else {

                        $("#" + $(e.target).next().data("id")).fadeToggle("fast");
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 400);
                        //$(button).fadeToggle("fast");
                        //$(button).css("display", "block");
                    }
                    timer = setInterval(animationImg, 20, $(e.target).next().data("id"));
                }
            }
        }
        agregate();
    }

    function doPrice(e) {
        curId = $(e.target).data("id");
        //Если цена выделена
        if (!$(e.target).data("on")) {
            // var a = $(e.target).data("on");
            var item = new Item(curId);
            purchase.push(item);
            //price += item.price;
            //Добавляем сразу в корзину
            agregate();
            $(e.target).data("on", true);
        }
        //else 
        //{
        //    var a = $(e.target).data("on");
        //Ищем полное кол-во по текущему итему
        //    for (var i = 0; i < purchase.length; i++) {
        //        if (curId === purchase[i].id) {
        //            //Удаляем итем из общего массива
        //            purchase.splice(i, 1);
        //            $("span[data-id='" + curId + "']").text(1);
        //        }
        //    }
        //    agregate();
        //   $(e.target).data("on", false);
        //}

        //Применяем эффекты
        //$(e.target).toggleClass("prices-clicked");
        $(e.target).hide();
        //$(e.target).slideToggle("normal"); 
        //$("#" + curId).slideToggle("normal");
        $("#" + curId).show();
        //$("#img" + curId).fadeToggle("normal");   
        timer = setInterval(animationImg, 20, curId);
    }

    function toMain() {
        mobileApp.navigate("#main-view#rools", "slide");
    }

    function toBasket() {
        mobileApp.navigate("#basket", "slide");
    }

    function toFilter() {
        mobileApp.navigate("#filterView", "slide");
    }

    function filterViewInit() {
        listviews = this.element.find("ul.km-listview");
        //Инициализируем список с фильтрами
        $("#select-filter").kendoMobileButtonGroup({
            select: function (e) {
                listviews.hide()
                    .eq(e.index)
                    .show();
            },
            index: 0
        });
    }

    function mClose() {
        $("#submModal").kendoMobileModalView("close");
    }

    function mSubm() {
        // mobileApp.navigate("views/ready.html", "fade");
        
        //Записываем данные пользователя в файл
        var name = this.name ? this.name : "",
            tel = this.tel ? this.tel : "",
            street = this.street ? this.street : "",
            house = this.house ? this.house : "",
            porch = this.porch ? this.porch : "",
            floor = this.floor ? this.floor : "",
            flat = this.flat ? this.flat : "";

        //Припилить валидацию

        //var us = new User(this.name, this.tel, this.street, this.house, this.porch, this.floor, this.flat);

        var user = name + "|" + tel + "|" + street + "|" + house + "|" + porch + "|" + floor + "|" + flat;
        rwd.write(dirName, userFile, user);

        $("#submModal").kendoMobileModalView("close");
    }

    function sumBasket() {
        var sum = 0;
        for (var i = 0; i < purchase.length; i++) {
            sum += purchase[i].total;
        }
        purchase.length > 0 ? $("#hready").text("Ваш заказ") : $("#hready").text("Корзина пуста");
        $("#finish").text(sum);
    }

    function initBasket() {
        $("#basket-list").kendoMobileListView({
            dataSource: purchase,
            template: $("#basket-template").html(),
            headerTemplate: "<h4 style='color:gray;margin:5px;'>${value}</h4>"
        });
        sumBasket();
    }

    function doPriceBasket(e) {
        curId = $(e.target).data("id");
        $(e.target).hide();
        $("#b" + curId).show();
    }

    function back() {
        //Очищаем список покупок
        purchase.length = 0;
        $("#basket").text(0);
    }

    function ready() {
        mobileApp.navigate("#ready");

        //Считываем с файла пользователя
         $("input[name='name']").val("user[0]");
        //Заполняем поля
        
        if (purchase.length > 0) {
            var delivery = "";
            for (var i = 0; i < purchase.length; i++) {
                delivery += purchase[i].id + "|" + purchase[i].count + "|" + purchase[i].price + ";";
            }
            //Удаляем последний знак ';'
            delivery = delivery.slice(0, -1);
            //Записываем в текстовый файл совершённый заказ
            rwd.write(dirName, fileName, delivery);
        }
    }

    function mB(e) {
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).next().data("id")) {
                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    break;
                } else {
                    for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        if ($(e.target).next().data("id") === purchase[i].id) {
                            //Удаляем итем из общего массива
                            purchase.splice(i, 1);
                            //curId = $(e.target).next().data("id");
                            //$("#b" + curId).hide();
                            $(e.target).closest('li').fadeToggle('fast');
                        }
                    }
                }
            }

        }
        agregate();
        sumBasket();
    }

    function pB(e) {
        //Получаем текущий объект по id
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).prev().data("id")) {
                //Увеличиваем на кол-во на 1
                purchase[i].count++;
                //Заносим в текущий элемент
                $(e.target).prev().text(purchase[i].count);
                //Устанавливаем новую стоимость
                purchase[i].total = purchase[i].count * purchase[i].price;
                break;
            }
        }
        agregate();
        sumBasket();
    }

    function renderWithHistory() {

    }

    function getPurchaseHistory (history) {
        //Сначало считываем все строки, разделённые ';'
        var vals = history.split(";");
        //Формируем массив объектов истории покупок
        for (var i = 0; i < vals.length; i++) {
            var t = vals[i].split("|");
            //Формируем новый объект из строки
            var item = new ItemHist(t[0], t[1], t[2]);
            purchaseHist.push(item);
        }
        //Вызваем функцию отрисовки контента
        renderWithHistory();
    }
    
    function getUserFromFile (content) {
        var user = content.split("|");
        //Заполняем поля в форме
        //$("input[name='name']").val(user[0]);
    }

    window.submView = kendo.observable({
        subm: mSubm,
        close: mClose
    });

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        show: showMain,
        hide: hideMain,
        doPrice: doPrice,
        p: plus,
        m: minus,
        goMain: toMain,
        goBasket: toBasket,
        goFilter: toFilter,
        filterViewInit: filterViewInit,
        // mClose: mClose,
        //  mSubm: mSubm,
        initBasketView: initBasket,
        doPriceBasket: doPriceBasket,
        back: back,
        ready: ready,
        mB: mB,
        pB: pB,
        getPurchaseHistory: getPurchaseHistory,
        getUserFromFile: getUserFromFile
    }

}());