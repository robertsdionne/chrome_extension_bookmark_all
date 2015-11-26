function maybeCreate(parameters, success) {
  if (parameters.parentId) {
    chrome.bookmarks.getChildren(parameters.parentId, function(children) {
      var child = children.find(function(element, i) {
        return parameters.title === element.title;
      });
      if (child) {
        if (success) {
          success(child);
        }
      } else {
        chrome.bookmarks.create(parameters, success);
      }
    });
  } else {
    chrome.bookmarks.search({
      title: parameters.title,
    }, function(folders) {
      if (folders.length > 0) {
        if (success) {
          success(folders[0]);
        }
      } else {
        chrome.bookmarks.create(parameters, success);
      }
    });
  }
}

function bookmarkAll(folderTitles) {
  console.log('Creating new bookmarks in', folderTitles);
  maybeCreate({
    title: folderTitles[0],
  }, function(year) {
    maybeCreate({
      parentId: year.id,
      title: folderTitles[1],
    }, function(month) {
      maybeCreate({
        parentId: month.id,
        title: folderTitles[2],
      }, function(day) {
        chrome.windows.getAll({
          populate: true,
        }, function(windows) {
          windows.forEach(function(win, i) {
            chrome.bookmarks.create({
              parentId: day.id,
              title: String(i),
            }, function(folder) {
              win.tabs.forEach(function(tab, j) {
                chrome.bookmarks.create({
                  parentId: folder.id,
                  title: tab.title,
                  url: tab.url,
                });
              });
            });
          });
          chrome.bookmarks.create({
            parentId: day.id,
            title: '--',
          });
        });
      });
    });
  });
}
