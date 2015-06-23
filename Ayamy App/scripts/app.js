var app = (function () {

    "use strict";

    var dataSource, sum, curId, listviews, timer, apiKey = "gR2l3Bi8JjZC4Hhv",
        rootUrl = "http://frontpad.ru/api/index.php",
        mobileApp = {},
        purchase = [],
        purchaseHist = [],
        flag = false,
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

    var Item = function (id, count) {
        this.id = id;
        this.order = dataSource.get(id).order;
        if (count === undefined) {
            this.count = 1;
        } else {
            this.count = count;
        }

        this.price = dataSource.get(id).price;
        /* if (price === undefined) {
             this.price = dataSource.get(id).price;
         } else {
             this.price = price;
         }*/
        this.name = dataSource.get(id).name;

        /* if (price === undefined) {
             this.total = dataSource.get(id).price;
         } else {
             this.total = price;
         }*/
        this.total = dataSource.get(id).price * this.count;
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
            // alert(window.innerWidth);
            //Считываем с локальной бд и с файла телефона и сравниваем версии
            dtB.fetch(function () {
                var curVers = dtB.at(0).Version;
                // alert(curVers);
                rwd.read(dirName, versionFile, curVers);
            });
        }, 2000);

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
                return "<h4 id='" + data.items[0].hash + "' style='color:gray;margin:5px;'>" + data.items[0].letter + "</h4>";
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

    var isConsist = false;
    
    function showMain(e) {

        // $("#main-list").data("kendoMobileListView").refresh();

        e.view.scroller.scrollTo(0, 0);
        //Сбрасываем фильтр
           // dataSource.filter([]);
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
                 //Если до этого делали фильтр по составу, то сбрасыаем фильтр и позицию скрола
                    if (isConsist) {
                        dataSource.filter([]);
                       // dataSource.sync();
                      //  $("#main-list").data("kendoMobileListView").refresh();
                        isConsist = false;
                    }
                var el = $("#" + e.view.params.hash);
                //Если элемент существует
                if (el.hasOwnProperty("length")) {
                   
                   // if (e.view.params.hash !== "rolls") {
                         //Получаем позицию элемента
                     	var pos = el.offset();
                     	e.view.scroller.animatedScrollTo(0, -(pos.top - 55));
                   // }
                }
            }
        } else if (e.view.params.hasOwnProperty("consist")) {
            //Фильтруем существующий список по терму
            isConsist = true;
            dataSource.filter({
                field: "consist",
                operator: "contains",
                ignoreCase: true,
                value: e.view.params.consist
            });
        }
        //Считываем с текстового файла историю покупок
        rwd.read(dirName, fileName, null);
    }

    function hideMain(e) {
		//e.view.scroller.scrollTo(0, 0);
        //Сбрасываем фильтр
           // dataSource.filter([]);
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

    function minus(e) {
        if (flag) return false;
        flag = true;
        // alert(purchase.length);
        var button = $(e.target).closest('li').find('a.prices');
        var id = $(e.target).next().data("id");
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === id) {

                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    flag = false;
                    break;
                } else {
                    //Ищем полное кол-во по текущему итему
                    //for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        //if ($(e.target).next().data("id") === purchase[i].id) {
                            //Удаляем итем из общего массива
                            purchase.splice(i, 1);
                            $("span[data-id='" + id + "']").text(1);
                        //}
                    //}
                    button.data("on", false);
                    var directionAnimate = $("#img" + id).data("direct");

                    $("#" + id).fadeToggle(100, 'linear', function () {
                        $("#img" + id).animate({
                            width: "+=80",
                            height: "80"
                        }, 400, 'linear', function () {
                            button.fadeToggle("fast");
                            $("#img" + id).data("direct", 0);
                            flag = false;
                        });

                    });
                }
            }
        }
        agregate();
    }

    function doPrice(e) {
        if (flag) return false;
        //alert("1");
        flag = true;
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
        $("#img" + curId).animate({
            width: "-=80",
            height: "80"
        }, 300, 'linear', function () {
            $(e.target).fadeOut(100, 'linear', function () {
                $("#" + curId).show();
                $("#img" + curId).data("direct", 1);
                flag = false;
            });
        });
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

            for (var i = 0; i < purchase.length; i++) {
                //заносим артикулы
                product.push(purchase[i].id);
                //заносим кол-во
                productKol.push(purchase[i].count);
            }

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
                    //  "pers": this.person,
                    "descr": this.comment

                },
                success: function (data) {
                    if (data === "success") {
                        setTimeout(function () {
                            $("div.tooltip").text("Спасибо за заказ, в скором времени наш менеджер свяжеться с вами! :)").slideDown("normal");
                        }, 500);
                    } else {
                        setTimeout(function () {
                            $("div.tooltip").text("Что-то пошло не так :( Попробуйте позже.").slideDown("normal");
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
            $("#hready").text("Основной заказ");
            $("#finish").text(sum);
            $("#finish2").text("Cумма " + sum.toFixed() + " Р");
            $("#fin").show();
            $("#foo").show();
            $("#df").show();
        } else {
            $("#hready").text("Ваша корзина пуста");
            $("#fin").hide();
            $("#foo").hide();
            $("#df").hide();
        }
    }

    function addExtra() {
        //Включаем также доп. порции
        var it1 = new Item(1110, 0), //орбит
            it2 = new Item(1111, 0), //васаби
            it3 = new Item(1112, 0), //имбирь
            it4 = new Item(1116, 0), //соевый соус
            it5 = new Item(1117, 0); //соус heinz

        purchase.push(it1);
        purchase.push(it2);
        purchase.push(it3);
        purchase.push(it4);
        purchase.push(it5);
    }

    function initBasket() {
	
        if (purchase.length === 0) {
            sumBasket();
            return false;
        }

        addExtra();
        
        var dt1 = new kendo.data.DataSource({
            data: purchase,
            filter: {
                field: "order",
                operator: "neq",
                value: 10
            }
        });

        var dt2 = new kendo.data.DataSource({
            data: purchase,
            filter: {
                field: "order",
                operator: "eq",
                value: 10
            }
        });

        $("#basket-list").kendoMobileListView({
            dataSource: dt1,
            template: $("#basket-template").html()
        });
        $("#adv-list").kendoMobileListView({
            dataSource: dt2,
            template: $("#adv-template").html()
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
       // purchase.length = 0;
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
                  //  for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        if ($(e.target).next().data("id") === purchase[i].id) {
                            if (purchase[i].order === 10) {
                                if (purchase[i].count > 0) {
                                    //Уменьшаем кол-во на 1
                    				purchase[i].count--;
                                	//Заносим в текущий элемент
                    				$(e.target).next().text(purchase[i].count);
                                 	//Устанавливаем новую стоимость
                    				purchase[i].total = purchase[i].count * purchase[i].price;
                                } else {
                                      //Удаляем итем из общего массива
                            			purchase.splice(i, 1);
                            			//curId = $(e.target).next().data("id");
                            			//$("#b" + curId).hide();
                            			$(e.target).closest('li').fadeToggle('fast');
                                }
                            } else {
                                 //Удаляем итем из общего массива
                            	purchase.splice(i, 1);
                            	//curId = $(e.target).next().data("id");
                            	//$("#b" + curId).hide();
                            	$(e.target).closest('li').fadeToggle('fast');
                            }
                        }
                   // }
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
                img.width(0);
                img.data("direct", 1);
                img.closest("li").height(80);
                //Скрываем цену
                $("a[data-id='" + purchaseHist[i].id + "']").hide();
                //Показываем кол-во
                $("span[data-id='" + purchaseHist[i].id + "']").text(purchaseHist[i].count);
                $("#" + purchaseHist[i].id).show();

                var item = new Item(purchaseHist[i].id);
                item.count = purchaseHist[i].count;
                item.price = purchaseHist[i].price;
                item.total = purchaseHist[i].count * purchaseHist[i].price;
                purchase.push(item);

                agregate();

            }
        } else {
            //Поиск скрытых анкоров 
            var massiv = $("img").closest('li').find("a:hidden").data("on", false).show();
            massiv.closest("li").find("img").width(80).data('direct', 0);

            //Поиск скрытых анкоров
            // $("a:hidden").data("on", false).show();
            //Поиск сжатых фоток
            // $("img[data-direct='1']").width(80).data("direct", 0);
            //Поиск спанов с кол-вом
            $("div.priceCount:visible").find("span[data-id]").text(1);
            $("div.priceCount:visible").hide();

            agregate();
        }
    }

    function removeAll() {
        // $("#finish2").text(0);
        purchase.length = 0;
        // purchaseHist.length = 0;

        //sumBasket();
        var listView = $("#basket-list").data("kendoMobileListView");
        listView.dataSource.data(purchase);

        var listview2 = $("#adv-list").data("kendoMobileListView");
        listview2.dataSource.data([]);

        sumBasket();
        agregate();

        mobileApp.view().scroller.scrollTo(0, 0);

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
    
    function hideBasket () {
       // alert(purchase.length);
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
        hideBasket: hideBasket,
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