
$(document).ready(function(){
  var folderTitles = new Date().toISOString().split('T')[0].split('-');
  console.log('Set folderTitles to', folderTitles);
  window.close();
  chrome.extension.getBackgroundPage().bookmarkAll(folderTitles);
});
