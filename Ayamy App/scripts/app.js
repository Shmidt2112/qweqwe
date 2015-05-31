var app = (function () {

    var dataSource, sum, curId, timer,
        mobileApp = {},
        purchase = [],
        Item = function (id, price) {
            this.id = id;
            this.price = price;
            this.count = 1;
            this.total = price;
        };

    var groupedData = [
        {
            id: 0,
            name: "Sashimi Salad",
            description: "Зелень, лосось, васаби, арахис, чернозем",
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
            description: "Кусочки тунца.",
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

    function initialize() {

        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });

        dataSource = new kendo.data.DataSource({
            data: groupedData,
            schema: {
                model: {
                    id: "id"
                }
            }
        });
    }

    function initMain() {
        $("#main-list").kendoMobileListView({
            dataSource: kendo.data.DataSource.create({
                data: groupedData,
                group: "letter"
            }),
            filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "поиск..."
            },
            template: $("#main-template").html(),
            headerTemplate: "<h4 style='color:gray; margin: 5px;'>${value}</h4>"
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
                var a = $(e.target).prev();
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
            var a = $(e.target).data("on");
            var item = new Item(curId, $(e.target).data("price"))
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
        $(e.target).css("display", "none");
        //$(e.target).slideToggle("normal"); 
        //$("#" + curId).slideToggle("normal");
        $("#" + curId).css("display", "block");
        //$("#img" + curId).fadeToggle("normal");   
        timer = setInterval(animationImg, 20, curId);
    }

    function animationImg(id) {
        var obj = $("#img" + id);
        var w = $(obj).width();
        var directionAnimate = parseInt($("#img" + id).data("direct"));

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

    function toMain() {
        mobileApp.navigate("#main-view#rools", "slide");
    }

    function toBasket() {
        mobileApp.navigate("#basket", "slide");
    }

    function toFilter() {
        mobileApp.navigate("#filterView", "slide");
        // mobileApp.navigate("views/groups.html");
    }

    function filterViewInit() {
        var listviews = this.element.find("ul.km-listview");

        $("#select-filter").kendoMobileButtonGroup({
            select: function (e) {
                listviews.hide()
                    .eq(e.index)
                    .show();
            },
            index: 0
        });
    }

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        doPrice: doPrice,
        p: plus,
        m: minus,
        goMain: toMain,
        goBasket: toBasket,
        goFilter: toFilter,
        filterViewInit: filterViewInit
    }

}());