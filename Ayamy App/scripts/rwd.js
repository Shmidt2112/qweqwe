/*
	Объект для работы с файловой системой телефона
*/

var rwd = (function () {

    "use strict";
    
    var hash, vals;

    function read(dirName, fileName) {
        //Пытаемся считать фалй настроек
        function readAsText(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                //Если что-то есть
                if (evt.target.result) {
                   // alert(evt.target.result);
                    if (fileName === "AyamyHistory.txt") {
                        app.getPurchaseHistory(evt.target.result);
                    } else if (fileName === "AyamyUser.txt") {
                        app.getUserFromFile(evt.target.result);
                    }
                }
            }
            reader.readAsText(file);
        }

        function gotFile(file) {
            readAsText(file);
        }

        function fail(error) {

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