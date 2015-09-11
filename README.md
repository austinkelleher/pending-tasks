pending-tasks
===========
Uniquely identified setTimeout manager

## Why?
You know those games that begin count downs when a minimum number of players is
met? Yeah, that's why this was built. It's good for stuff like that. You can
manage tasks in one place and add or delete tasks on demand.

## Installation
```bash
npm install pending-tasks --save
```

## Requiring
```javascript
var ptasks = require('pending-tasks').create();
```

## `add(options|[options])`
Adds a task or array of tasks to the running list of pending tasks

#### Arguments
`options` *( object )* - Task object, which includes:
- `options.taskId` *( *\* ) required - Unique Id of the task
- `options.timeout` *( number )* - Time in milliseconds until the task is executed
- `options.task` *( function )* required - Task function to be executed after timeout

#### Examples

- Add a single task

```javascript
var taskId = '123abc';

ptasks.add({
    id: taskId,
    timeout: 1000,
    task: function() {
        console.log('Test!');
    }
});
```

- Add an array of tasks

```javascript
ptasks.add([
    {
        id: 'abc123',
        timeout: 1000,
        task: function() {
            console.log('Test 1!');
        }
    },
    {
        id: '123abc',
        timeout: 1000,
        task: function() {
            console.log('Test 2!');
        }
    }
]);
```

## `delete(taskId)`
Delete a task from the running list of pending tasks

#### Arguments
`taskId` *( *\* ) - Id of the task to delete

#### Examples

```javascript
ptasks.delete(taskId);
```

## `isPending(taskId)`
Return true if a task with the task Id specified is pending, otherwise false.

#### Arguments
`taskId` *( *\* ) - Id of the task to validate whether pending

#### Examples

```javascript
ptasks.isPending(taskId);
```

## `getTaskCreatedTime(taskId)`
Returns the time the task for initialized

#### Arguments
`taskId` *( *\* ) - Id of the task to validate whether pending

#### Examples

```javascript
ptasks.getTaskCreatedTime(taskId);
```

## `getTimeRemaining(taskId)`
Returns the time remaining until the task is executed

#### Arguments
`taskId` *( *\* ) - Id of the task to check the time remaining on

#### Examples

```javascript
ptasks.getTimeRemaining(taskId);
```
