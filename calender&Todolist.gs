var lineToken = "************************************ ";
 
function myFunction() {
  var calendars = CalendarApp.getAllCalendars();
  var text = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd') + "\n";
 
 //Calender
  for(i in calendars) {
    var calendar = calendars[i];
    var events = calendar.getEventsForDay(new Date());
 
    for(j in events) {
      var event = events[j];
      var title = event.getTitle();
      var start = toTime(event.getStartTime());
      var end = toTime(event.getEndTime());
      text += start + ' - ' + end + " " + title + '\n';
    }
 
    if( events.length > 0 ) {
      text += "\n";
    }
  }
  //sendToLine(text);
  
  //Todo List
  var myTaskLists = getTaskLists();
  var myTasks       = getTasks( myTaskLists[0].id );
  var msg = "[Todo List]\n";

  Logger.log( myTasks );
  /*myTask[0].titleの配列を変更することで他のリストに変更することができる。*/
  Logger.log( myTasks[0].title ); // = "first todo"
  
  for(i in myTasks){
    msg += myTasks[i].title + "\n";
    }
  text +=msg;
  sendToLine(text);
}
 
function sendToLine(text){
  var token = lineToken;
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + text,
     "headers" : {"Authorization" : "Bearer "+ token}
 
   };
   UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
 
function toTime(str){
  return Utilities.formatDate(str, 'JST', 'HH:mm');
}

function getTaskLists() {
  var taskLists = Tasks.Tasklists.list().getItems();
  if (!taskLists) {
    return [];
  }
  return taskLists.map(function(taskList) {
    return {
      id: taskList.getId(),
      name: taskList.getTitle()
    };
  });
}

function getTasks(taskListId) {
  var tasks = Tasks.Tasks.list(taskListId).getItems();
  if (!tasks) {
    return [];
  }
  return tasks.map(function(task) {
    return {
      id: task.getId(),
      title: task.getTitle(),
      notes: task.getNotes(),
      completed: Boolean(task.getCompleted())
    };
  }).filter(function(task) {
    return task.title;
  });
}
