pending-tasks
===========
Unique Id timed task manager for Node.js.

## Installation
```bash
npm install pending-tasks --save
```

## Requiring
```javascript
var ptasks = require('pending-tasks');
```

## Create / Delete

```javascript
var taskId = uuid.v4();

pendingTasks.add({
    id: taskId,
    timeout: 1000,
    task: function() {
        console.log('Test!');
    }
});

// The task will be deleted before execution takes place
pendingTasks.delete(taskId);
```
