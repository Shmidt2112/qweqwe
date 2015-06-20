var app = (function () {

    "use strict";

    var dataSource, sum, curId, listviews, timer, apiKey = "gR2l3Bi8JjZC4Hhv",
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
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "scripts/data.js",
                    type: "get",
                    dataType: "json"
                }
            },
            schema: {
                data: "groupedData",
                model: {
                    field: "id"
                }
            },
            filter: {
                field: "name",
                operator: "startswith",
                value: ""
            },
            // batch: true,
            group: {
                field: "order",
                dir: "asc"
            },
            requestStart: function () {
                if (mobileApp.hasOwnProperty("pane")) {
                    //$("span.tooltip").text("Загрузка...").show();
                    mobileApp.pane.loader.show();
                    //  $(mobileApp.pane.loader.element).show();
                }
                //kendo.ui.progress($("#loading"), true);
            },
            requestEnd: function () {
                if (mobileApp.hasOwnProperty("pane")) {
                    // $("span.tooltip").text("Загрузка...").hide();
                    mobileApp.pane.loader.hide();
                    // setTimeout(function () {
                    //      $(mobileApp.pane.loader.element).hide();
                    // }, 3000);
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
            skin: "flat",
            loading: "<h1>...</h1>"
        });

        // mobileApp.loading = "<h1>Loading...</h1>";
        //mobileApp.showLoading();

        setTimeout(function () {
            navigator.splashscreen.hide();
            //Считываем с локальной бд и с файла телефона и сравниваем версии
            dtB.fetch(function () {
                var curVers = dtB.at(0).Version;
                // alert(curVers);
                rwd.read(dirName, versionFile, curVers);
            });
        }, 1000);

        /*$("img").click(function (e) {
            $("#bigImage").kendoMobile
        })*/

    }

    function initMain() {
        //Устанавливаем начальный список
        $("#main-list").kendoMobileListView({
            dataSource: dataSource,
          /*  filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "     поиск..."
            },*/
            template: $("#main-template").html(),
            //endlessScroll: true,
            // scrollTreshold: 30, //treshold in pixels
            //headerTemplate: "<h4 id='#= data.items[0].hash #' style='color:gray;margin:5px;'>${value}</h4>",
            headerTemplate: function (data) {
                return "<h4 id='"+data.items[0].hash+"' style='color:gray;margin:5px;'>"+data.items[0].letter+"</h4>";
            },
            fixedHeaders: true
            //headerTemplate: "<h4 style='color:gray;margin:5px;'>${value}</h4>"
        });

        /*$("#qrCode").kendoQRCode({
            value: "https://bit.ly/1GdCozW",
            size: 240
                // background: "red"
        });*/
    }

    function showMain(e) {

        // $("#main-list").data("kendoMobileListView").refresh();

        e.view.scroller.scrollTo(0,0);
        //Определяем тип параметра либо хэш либо ингредиент
        if (e.view.params.hasOwnProperty("hash")) {
           
            if (e.view.params.hash === "all") {
                //Сбрасываем фильтр
                dataSource.filter([]);
            } else {
                //Фильтруем существующий список по разделу
              /*  dataSource.filter({
                    field: "hash",
                    operator: "eq",
                    ignoreCase: true,
                    value: e.view.params.hash
                });*/
                var el = $("#" + e.view.params.hash);
                 //Если элемент существует
            if (el.hasOwnProperty("length")) {
                 
                //Получаем позицию элемента
                 var pos = el.offset();
                e.view.scroller.animatedScrollTo(0, -(pos.top-55))
				// e.view.scroller.scrollTo(0,-(pos.top-55));
            }
                // e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
                //Устанавливаем скролл на эту позицию
                //    e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, -" + (pos.top - 70) + "px, 0px) scale(1)");

               
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
       // e.view.scroller.scrollTo(0, 0);
        //Считываем с текстового файла историю покупок
        rwd.read(dirName, fileName, null);
    }

    function hideMain(e) {
        //Устанавливаем скрол в первоначальную позицию
        // e.view.element.find(".km-scroll-container").css("-webkit-transform-origin", "left top 0px");
        //  e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
        //  $("#scroller").data("kendoMobileScroller").reset();
        //Сбрасываем фильтр в начальное состояние
        /* dataSource.filter({
             field: "name",
             operator: "startswith",
             value: "",
             placeholder: "поиск..."
         });*/
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
        var delivery = "";
        if (purchase.length > 0) {

            for (var i = 0; i < purchase.length; i++) {
                delivery += purchase[i].id + "|" + purchase[i].count + "|" + purchase[i].price + ";";
            }
            //Удаляем последний знак ';'
            delivery = delivery.slice(0, -1);
        }
        //Записываем в текстовый файл совершённый заказ
        rwd.write(dirName, fileName, delivery);
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
            $(obj).css('width', w - 10 + "px");
            $(obj).css('height', 80 + "px");
        }

        if (w < 75 && directionAnimate == 1) ///если ширина < 75, уменьшаем ширину блока на 5px
        {
            $(obj).css('width', w + 10 + "px");
            $(obj).css('height', 80 + "px");
        }

        if (w == 0 && directionAnimate == 0) { ///если нет, разрушим интервал (перестанем вызывать функцию animation()) 
            directionAnimate = 1;
            $("#img" + id).data("direct", directionAnimate);
            clearInterval(timer);
        }

        if (w == 80 && directionAnimate == 1) { ///если нет, разрушим интервал (перестанем вызывать функцию animation())  
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
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 300);
                        //setTimeout(function(){ $("#" + $(e.target).next().data("id")).fadeToggle("fast");}, 300);
                        //$(button).css("display", "block");
                        //setTimeout(function(){ $(button).fadeToggle("fast");}, 300);

                    } else {

                        $("#" + $(e.target).next().data("id")).fadeToggle("fast");
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 300);
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
        $(e.target).hide();
        $("#" + curId).show();
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
            var user = "";
            if (this.name) {
                user += this.name;
            }
            if (this.tel) {
                user += "|" + this.tel;
            }
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

            if (user) {
                rwd.write(dirName, userFile, user);
            }

            var el = $(e.target).data("form");
            var d = $(el).closest("div[data-role='modalview']");
            $(d).kendoMobileModalView("close");
            $("input[name='time']").val("");

            var product = [];
            var productKol = [];
            
            for (var i=0; i< purchase.length; i++) {
                //заносим артикулы
                product.push(purchase[i].id);
                //заносим кол-во
                productKol.push(purchase[i].count);
            }
            
          //  var data;
            
          //  for(var j=0)
            
              // product[0] = 2992;
             //  product_kol[0] = 100;
               //Делаем запрос к серверу
               $.ajax({
                   url: rootUrl,
                   type: "POST",
                   //  crossdomain: true,
                   // content:"text/html; charset=utf-8",
                   data: {
                       "product[]": product,
                       "product_kol[]": productKol,
                       "secret": "NhyiD2iEFrrrKNHHfszn",
                       "name": this.name,
                       "phone": this.tel,
                       "street": this.street,
                       "home": this.house,
                       "pod": this.porch,
                       "et": this.floor,
                       "apart": this.flat,
                     //  "mail": this.time
                       "pers": this.person,
                       "descr": this.comment
                       
                   },
                   success: function (data) {
                       if (data === "success") {
                           setTimeout(function () {
                               $("div.tooltip").text("Спасибо за заказ, в скором времени наш менеджер свяжеться с вами! :)").slideDown("normal").delay(3000).slideUp("normal");
                           }, 500);
                       } else {
                            setTimeout(function () {
                               $("div.tooltip").text("Что-то пошло не так :( Попробуйте позже.").slideDown("normal").delay(3000).slideUp("normal");
                           }, 500);
                       }
                   }
               });
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
                    // break;
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

        if (purchaseHist.length > 0) {
            for (var i = 0; i < purchaseHist.length; i++) {
                var img = $("#img" + purchaseHist[i].id);
                $(img).css('width', 0 + 'px');
                $(img).data('direct', 1);
                $(img).closest('li').css('height', 80 + 'px');
                var div = $(img).closest('li').find('#' + purchaseHist[i].id).css('display', 'block');
                // $(div).find('span').html(purchaseHist[i].count);

                $(img).closest('li').find('.prices').find('a').css('display', 'none');
                $("span[data-id='" + purchaseHist[i].id + "']").text(purchaseHist[i].count);
                var item = new Item(purchaseHist[i].id);
                item.count = purchaseHist[i].count;
                item.price = purchaseHist[i].price;
                item.total = purchaseHist[i].count * purchaseHist[i].price;
                purchase.push(item);

                agregate();

            }
        } else {
           
				//var massiv = $("img[data-direct='1']");
            var massiv = $("img").closest('li').find('.prices').find('a:hidden').show();
            
           // var bfg = $("img").closest('li').find('.priceCount').find('a:visible').hide();
            $("div.priceCount:visible").find("span").text(1);
            $("div.priceCount:visible").hide();
            massiv.closest('li').find('img').css('width', 80 + 'px').data('direct',0); 
           // $("span[data-id='" + purchaseHist[i].id + "']").text(purchaseHist[i].count);
            agregate();
           // alert(massiv.length);
           // $("img[data-direct='1']").css('width', 80 + 'px');
           //  massiv.show();
           /* for(var i=0; i<massiv.length; i++)
                {
                    alert('hui');
                    massiv[i].css('width', 80 + 'px');
                    massiv[i].data('direct', 0);
                    massiv[i].closest('li').css('height', 80 + 'px');
                    massiv[i].closest('li').find('.prices').find('a').css('display', 'block'); 
                }*/
        }
    }

    function removeAll() {
        // $("#finish2").text(0);
        purchase.length = 0;
        // purchaseHist.length = 0;

        //sumBasket();
        var listView = $("#basket-list").data("kendoMobileListView");
        listView.dataSource.data(purchase);

        sumBasket();
        agregate();
        //rwd.write()
        //agregate();

    }

    function getPurchaseHistory(history) {
        purchaseHist.length = 0;
        purchase.length = 0;
        if (history === "no") { 
            renderWithHistory();
        }
        //Сначало считываем все строки, разделённые ';'
        var vals = history.split(";");
        //Обнуляем purchaseHist перед чтением с файала истории
        
        //Формируем массив объектов истории покупок
        for (var i = 0; i < vals.length; i++) {
            var t = vals[i].split("|");
            //Формируем новый объект из строки
            var item = new ItemHist(+t[0], +t[1], +t[2]);
            purchaseHist.push(item);
        }
        //renderWithHistory;
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

    function showLoader() {
        // mobileApp.changeLoadingMessage("Please wait...");
        //  mobileApp.pane.loader.show();
        if (mobileApp.hasOwnProperty("pane")) {
            $(mobileApp.pane.loader.element).show();
        }
    }


    function hideloader(e) {
        // e.view.loader.show();
        //setTimeout(function () {
        //    e.view.loader.hide();
        //  }, 2000);
        if (mobileApp.hasOwnProperty("pane")) {
            $(mobileApp.pane.loader.element).hide();
        }
    }
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
        getUserFromFile: getUserFromFile,
        hideLoader: hideloader,
        showLoader: showLoader,
        removeAll: removeAll
    }

}());