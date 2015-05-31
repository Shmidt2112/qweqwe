var app = (function () {

    var dataSource, sum, curId, listviews,
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
            description: "Зелень, украшеная свежими сашими, васаби, соевый винегрет.",
            url: "images/sashimi-salad.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
            },
        {
            id: 1,
            name: "Seaweed Salad bla bla bla",
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

    dataSource = new kendo.data.DataSource({
        data: groupedData,
        group: "letter",
        filter: {
            field: "name",
            operator: "startswith",
            value: ""
        }
    });

    function initialize() {
        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });
    }

    function initMain() {
        //Устанавливаем начальный список
        $("#main-list").kendoMobileListView({
            dataSource: dataSource,
            filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "поиск..."
            },
            template: $("#main-template").html(),
            headerTemplate: "<h4 id='#= data.items[0].hash #' style='color:gray'>${value}</h4>"
        });
    }

    function showMain(e) {
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
                }
            }
        }
        agregate();
    }

    function doPrice(e) {
        curId = $(e.target).data("id");
        //Если цена выделена
        if (!$(e.target).data("on")) {
            var item = new Item(curId, $(e.target).data("price"))
            purchase.push(item);
            //price += item.price;
            //Добавляем сразу в корзину
            agregate();
            $(e.target).data("on", true);
        } else {
            //Ищем полное кол-во по текущему итему
            for (var i = 0; i < purchase.length; i++) {
                if (curId === purchase[i].id) {
                    //Удаляем итем из общего массива
                    purchase.splice(i, 1);
                    $("span[data-id='" + curId + "']").text(1);
                }
            }
            agregate();
            $(e.target).data("on", false);
        }

        //Применяем эффекты
        $(e.target).toggleClass("prices-clicked");
        $("#" + curId).slideToggle("normal");
        $("#img" + curId).fadeToggle("normal");
        $("p.description").toggleClass("description-left");
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
        $("#submModal").kendoMobileModalView("close");
    }

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
        mClose: mClose,
        mSubm: mSubm
    }

}());