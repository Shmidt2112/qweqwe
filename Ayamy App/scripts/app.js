var app = (function () {

    var dataSource, sum, curId, listviews, timer, version, apiKey = "gR2l3Bi8JjZC4Hhv",
        rootUrl = "http://frontpad.ru/api/index.php",
        mobileApp = {},
        purchase = [],
        purchaseHist = [],
        dirName = "Ayamy",
        fileName = "AyamyHistory.txt",
        userFile = "AyamyUser.txt",
        versionFile = "version.txt",
        el = new Everlive(apiKey),
        dtB = new kendo.data.DataSource({
            type: "everlive",
            transport: {
                typeName: "Settings"
            }
        }),
        groupedData = [
            {
                id: 0,
                name: "Ролл Америка",
                description: "рис,коп.лосось,коп.угорь,лосось терияке,огурец,сливоч.сыр (350гр.)",
                url: "images/15.png",
                price: 250,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 1,
                name: "Казань",
                description: "рис,коп.лосось,креветка,огурец,сливоч.сыр (350гр.)",
                url: "images/16.png",
                price: 260,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 2,
                name: "Хоккайдо",
                description: "рис,коп.угорь,лосось,слив.сыр,кунжут (250гр.)",
                url: "images/2.jpg",
                price: 180,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 3,
                name: "Атлантический",
                description: "рис,лосось,угорь,сливоч.сыр,огурец,тобико (255гр.)",
                url: "images/3.jpg",
                price: 180,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 4,
                name: "Император",
                description: "рис,коп.угорь,маринов.имбирь,огурец,сливоч.сыр (250гр.)",
                url: "images/4.jpg",
                price: 185,
                letter: "Роллы",
                hash: "rolls"
            },
            {
                id: 5,
                name: "Самурай",
                description: "рис,коп.угорь,лосось,авокадо,сливоч.сыр (250гр.)",
                url: "images/5.jpg",
                price: 180,
                letter: "Роллы",
                hash: "rolls"
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
        this.price = dataSource.get(id).price;
        this.name = dataSource.get(id).name;
        this.count = 1;
        this.total = dataSource.get(id).price;
        this.url = dataSource.get(id).url;
    };

    var ItemHist = function (id, count, price) {
        this.id = id;
        this.price = price;
        this.count = count;
    };

    /* var User = function (name, tel, street, house, porch, floor, flat) {
         this.name = name;
         this.telephone = tel;
         this.street = street;
         this.house = house;
         this.porch = porch;
         this.floor = floor;
         this.flat = flat;
     }*/

    //Обновление проекта
    function updateProject() {
        if (window.livesync) {
            window.livesync.sync();
        }
    }

    function initialize() {
        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });
        navigator.splashscreen.hide();

        // $("#title").one("click", updateProject);


        //Считываем с локальной бд и с файла телефона и сравниваем версии
        dtB.fetch(function () {
            var curVers = dtB.at(0).Version;
            // alert(curVers);
            rwd.read(dirName, versionFile, curVers);
        });

    }


    function initMain() {


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

        //Считываем с текстового файла историю покупок
        rwd.read(dirName, fileName, null);
        /*    var item1 = new ItemHist(1,2,290);
           purchaseHist.push(item1);
           var item2 = new ItemHist(2,3,120);
           purchaseHist.push(item2);
           renderWithHistory();*/
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
        //Все изменения записываем в файл
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
            //alert(typeof purchase[i].id + " " + typeof $(e.target).next().data("id"));
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

    function mClose(e) {
        $("input[name='time']").val("");
        var el = $(e.target).data("form");
        var d = $(el).closest("div[data-role='modalview']");
        $(d).kendoMobileModalView("close");
    }

    function mSubm(e) {

        //Если все поля введены, записываем в файл и закрываем окно
        if (validator.validate($(e.target).data("form"))) {
            var user = this.name + "|" + this.tel;
            if (this.street) {
                user += "|" + this.street;
            }
            if (this.house) {
                user += "|" + this.house;
            }
            if (this.porch) {
                user += "|" + this.porch;
            }
            if (this.floor) {
                user += "|" + this.floor;
            }
            if (this.flat) {
                user += "|" + this.flat;
            }
            rwd.write(dirName, userFile, user);
            var el = $(e.target).data("form");
            var d = $(el).closest("div[data-role='modalview']");
            $(d).kendoMobileModalView("close");
            $("input[name='time']").val("");

            var product = [];
            product[0] = 2992;
            var product_kol = [];
            product_kol[0] = 100;
            //Делаем запрос к серверу
            $.ajax({
                url: "http://frontpad.ru/api/index.php",
                type: "POST",
              //  crossdomain: true,
                // content:"text/html; charset=utf-8",
                data: {
                    "product[]": product[0],
                    "product_kol[]": product_kol[0],
                    "secret": "NhyiD2iEFrrrKNHHfszn"
                },
                success: function (data) {
                   // alert(data);
                }
            });

            /* function postResult(elem) {
				var xhr = new XMLHttpRequest();
				var params = 'result_cat=' + elem.value;
				xhr.open('POST', '/test_selected_category.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						alert(this.responseText);
                    }
				}
				xhr.send(params);
				}*/

        }
    }

    function sumBasket() {
        var sum = 0;
        for (var i = 0; i < purchase.length; i++) {
            sum += purchase[i].total;
        }
        if (purchase.length > 0) {
            $("#hready").text("Ваш заказ");
            $("#finish").text(sum);
            $("#finish2").text("Cумма " + sum + " Р");
            $("#fin").show();
            $("#foo").show();
        } else {
            $("#hready").text("Ваша корзина пуста");
            $("#fin").hide();
            $("#foo").hide();
        }
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

        $("input[name='person']").val(1);
        //Считываем с файла пользователя
        rwd.read(dirName, userFile, null);


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

        for (var i = 0; i < purchaseHist.length; i++) {
            var img = $("#img" + purchaseHist[i].id);
            $(img).css('width', 0 + 'px');
            $(img).data('direct', 1);
            $(img).closest('li').css('height', 75 + 'px');
            var div = $(img).closest('li').find('div').css('display', 'block');
            $(div).find('span:nth-child(2)').html(purchaseHist[i].count);
            $(img).closest('li').find('h4').find('a').css('display', 'none');

            var item = new Item(purchaseHist[i].id);
            item.count = purchaseHist[i].count;
            item.price = purchaseHist[i].price;
            item.total = purchaseHist[i].count * purchaseHist[i].price;
            purchase.push(item);

            agregate();

        }
    }

    function getPurchaseHistory(history) {
        //Сначало считываем все строки, разделённые ';'
        var vals = history.split(";");
        //Обнуляем purchaseHist перед чтением с файала истории
        purchaseHist.length = 0;
        //Формируем массив объектов истории покупок
        for (var i = 0; i < vals.length; i++) {
            var t = vals[i].split("|");
            //Формируем новый объект из строки
            var item = new ItemHist(+t[0], +t[1], +t[2]);
            purchaseHist.push(item);
        }
        /*   var item1 = new ItemHist(1,2,290);
         purchaseHist.push(item1);
         var item2 = new ItemHist(2,3,120);
         purchaseHist.push(item2);*/

        setTimeout(renderWithHistory, 300);
    }

    //Автозаполнение полей форм
    function getUserFromFile(content) {
        var user = content.split("|");
        if (user[0]) { //Имя
            $("input[name='name']").val(user[0]);
        }
        if (user[1]) { //Телефон
            $("input[name='tel']").val(user[1]);
        }
        if (user[2]) { //улица
            $("input[name='street']").val(user[2]);
        }
        if (user[3]) { //дом
            $("input[name='house']").val(user[3]);
        }
        if (user[4]) { //подьезд
            $("input[name='porch']").val(user[4]);
        }
        if (user[5]) { //этаж
            $("input[name='floor']").val(user[5]);
        }
        if (user[6]) { //квартира
            $("input[name='flat']").val(user[6]);
        }
    }

    window.submView = kendo.observable({
        subm: mSubm,
        close: mClose
    });

    window.pickupView = kendo.observable({
        subm: mSubm,
        close: mClose
    });

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        update: updateProject,
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