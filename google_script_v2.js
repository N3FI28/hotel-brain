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
  try {
    var action = e.parameter.action;
    
    // Acción para navegar por archivos (Selector de Drive)
    if (action === "list_drive") {
      var folderId = e.parameter.folderId;
      var targetFolder;
      
      if (folderId && folderId !== "root" && folderId !== "root_real") {
        targetFolder = DriveApp.getFolderById(folderId);
      } else if (folderId === "root_real") {
        targetFolder = DriveApp.getRootFolder();
      } else {
        // Por defecto empieza en IA miramar si no se pide explícitamente root_real
        var iter = DriveApp.getFoldersByName("IA miramar");
        targetFolder = iter.hasNext() ? iter.next() : DriveApp.getRootFolder();
      }
      
      var items = [];
      
      // Obtener subcarpetas
      var folders = targetFolder.getFolders();
      while (folders.hasNext()) {
        var f = folders.next();
        items.push({ id: f.getId(), name: f.getName(), type: 'folder' });
      }
      
      // Obtener archivos (imágenes, pdfs, docs)
      var files = targetFolder.getFiles();
      while (files.hasNext()) {
        var fi = files.next();
        var mime = fi.getMimeType();
        if (mime.indexOf('image/') !== -1 || mime.indexOf('pdf') !== -1) {
          items.push({ 
            id: fi.getId(), 
            name: fi.getName(), 
            type: 'file', 
            url: fi.getUrl(),
            thumbnail: mime.indexOf('image/') !== -1 ? fi.getDownloadUrl() : null // Some files might not have thumbnail
          });
        }
      }
      
      // Ordenar: primero carpetas, luego archivos
      items.sort(function(a, b) {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
      
      return ContentService.createTextOutput(JSON.stringify({ 
        "status": "success", 
        "currentFolderId": targetFolder.getId(),
        "currentFolderName": targetFolder.getName(),
        "items": items 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Acción por defecto: listar carpetas para guardar
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
