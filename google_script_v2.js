function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Busca la carpeta principal "HotelBrain" o la crea
    var folderIterator = DriveApp.getFoldersByName("HotelBrain");
    var parentFolder = folderIterator.hasNext() ? folderIterator.next() : DriveApp.createFolder("HotelBrain");
    
    // Si se especifica una subcarpeta, se busca o se crea dentro de HotelBrain
    var targetFolder = parentFolder;
    if (data.folderName && data.folderName !== "HotelBrain") {
      var subIter = parentFolder.getFoldersByName(data.folderName);
      targetFolder = subIter.hasNext() ? subIter.next() : parentFolder.createFolder(data.folderName);
    }
    
    var fileUrls = [];
    
    // Si la aplicación envía fotos en formato base64
    if (data.photos && data.photos.length > 0) {
      for (var i = 0; i < data.photos.length; i++) {
        var base64Data = data.photos[i].split(',')[1];
        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg', 'Averia_' + data.title + '_' + i + '.jpg');
        var file = targetFolder.createFile(blob);
        fileUrls.push(file.getUrl());
      }
    }
    
    // Crear un archivo de texto de respaldo con los pasos
    targetFolder.createFile('Doc_' + data.title + '.txt', 
      'TÍTULO: ' + data.title + '\n' +
      'UBICACIÓN: ' + data.location + '\n' +
      'PROCEDIMIENTO:\n' + data.steps + '\n' +
      'ENLACES DE FOTOS:\n' + fileUrls.join('\n')
    );
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Configuración CORS (Google Apps Script lo maneja internamente con redirect, pero permitimos lectura pura)
  try {
    var folderIterator = DriveApp.getFoldersByName("HotelBrain");
    var parentFolder = folderIterator.hasNext() ? folderIterator.next() : DriveApp.createFolder("HotelBrain");
    
    var subfolders = parentFolder.getFolders();
    var foldersList = [];
    while (subfolders.hasNext()) {
      foldersList.push(subfolders.next().getName());
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "folders": foldersList }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
