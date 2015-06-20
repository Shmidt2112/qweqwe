/*
	Объект для работы с файловой системой телефона
*/

var rwd = (function () {

    "use strict";

    var hash, vals;

    function read(dirName, fileName, curVersion) {
        //Пытаемся считать файл настроек
        function readAsText(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                //alert(evt.target.result);
                if (fileName === "AyamyHistory.txt") {
                    //Если что-то есть
                    if (evt.target.result) {
                        //alert(evt.target.result);
                        app.getPurchaseHistory(evt.target.result);
                    } else {
                        app.getPurchaseHistory("no");
                    }
                } else if (fileName === "AyamyUser.txt") {
                    if (evt.target.result) {
                        app.getUserFromFile(evt.target.result);
                    }
                } else if (fileName === "version.txt") {
                    if (evt.target.result) {
                        if (curVersion) {
                            if (evt.target.result !== curVersion) { //Если версии не совпадают, обновляем и записываем в файл текущую версию
                               // alert(curVersion);
                                //Уведомляем пользователя об обновлении
                                $("span.tooltip").text("Внимание, ваша версия приложения устарела, сейчас произойдёт обновление!").slideDown("normal").delay(3000).slideUp("normal");
                               // alert("Ваша версия устарела, сейчас произойдёт обновление!");
                                setTimeout(function () {
                                    window.livesync.sync();
                                    rwd.write(dirName, fileName, curVersion);
                                }, 4000);
                            }
                        }
                    }
                }
            }
            reader.readAsText(file);
        }

        function gotFile(file) {
            readAsText(file);
        }

        function fail(error) {
            if (fileName === "version.txt") { //первый запуск
                //пытаемся создать файл с версией
                rwd.write(dirName, fileName, curVersion);
            }
           // alert(error.code);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.file(gotFile, fail);
        }

        function gotDir(dirEntry) {
            dirEntry.getFile(fileName, null, gotFileEntry, fail);
        }

        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(dirName, null, gotDir, fail);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function write(dirName, fileName, text) {

        function fail(error) {
			//alert(error.code);
        }

        function gotFileWriter(writer) {
            writer.write(text);
        }

        function gotFile(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        //Перезапись файла
        function gotDir(dirEntry) {
            dirEntry.getFile(fileName, {
                create: true,
                exclusive: false
            }, gotFile);
        }

        //Создаём если не существует
        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(dirName, {
                create: true
            }, gotDir);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function remove(dirName, fileName) {

        //Обработчик ошибок
        function fail(error) {

        }

        //Удаляем
        function gotFile(fileEntry) {
            fileEntry.remove();
        }

        //Берём файл
        function gotDir(dirEntry) {
            dirEntry.getFile(fileName, null, gotFile, fail);
        }

        //Получаем папку
        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(dirName, null, gotDir, fail);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    return {
        read: read,
        write: write,
        remove: remove
    }

})();