/**
* Create a new pending tasks manager
*
* @param options
* @param options.defaultTimeout Default timeout for a task if one is not provided.
*                               this falls back to 1000 ms.
* @param options.tasks Single object or array of objects of tasks with unique Id's
*/
var PendingTasks = function(options) {
    options = options || {};

    this.tasks = {};
    this.defaultTimeout = options.defaultTimeout || 1000;

    if (options.tasks) {
        this.add(options.tasks);
    }
};

PendingTasks.prototype = {
    /**
    * Add a task or array of tasks to the pending tasks
    *
    * @param task Object or array of objects of tasks with unique Id's
    */
    add: function(task) {
        if (Array.isArray(task)) {
            for (var i = 0; i < task.length; i++) {
                this.add(task[i]);
            }
            return;
        } else if (typeof(task) === 'object') {
            if (!task.id) {
                throw new Error('Task Id is required for each task');
            } else if (typeof(task.task) !== 'function') {
                throw new Error('Task function is required for each task');
            } else if (this.tasks[task.id]) {
                throw new Error('Task with Id: ' + task.id + ' already exists');
            }

            var self = this;
            var timeout = task.timeout || this.defaultTimeout;
            // Our function will execute the desired task followed by the
            // deletion of the task from our persisted list
            this.tasks[task.id] = setTimeout(function() {
                task.task();
                delete self.tasks[task.id];
            }, timeout);
        }
    },

    /**
    * Delete a task or array of tasks from the pending tasks
    *
    * @param taskId Unique Id of the task or array of unique tasks Id's
    */
    delete: function(taskId) {
        if (Array.isArray(taskId)) {
            for (var i = 0; i < taskId.length; i++) {
                this.delete(taskId[i]);
            }
            return;
        }

        if (!this.tasks[taskId]) {
            throw new Error('Task with task Id ' + taskId + ' does not exist');
        }

        clearTimeout(this.tasks[taskId]);
        delete this.tasks[taskId];
    },

    /**
    * @return Whether the task is still waiting to be executed or not
    */
    isPending: function(taskId) {
        return typeof(this.tasks[taskId]) !== 'undefined';
    },

    /**
    * @param taskId Unique Id of the task
    * @return The time that the task was initialized
    */
    getTaskCreatedTime: function(taskId) {
        var task = this.tasks[taskId];
        return this.isPending(taskId) ? task._idleStart : null;
    },

    /**
    * @param taskId Unique Id of the task
    * @return The time remaining in milliseconds until the task is executed
    */
    getTimeRemaining: function(taskId) {
        var task = this.tasks[taskId];
        return this.isPending(taskId) ? task._idleTimeout - (Date.now() - task._idleStart) : null;
    }
};

/**
* Create a new pending tasks manager
*
* @param options
* @param options.defaultTimeout Default timeout for a task if one is not provided.
*                               this falls back to 1000 ms.
* @param options.tasks Single object or array of objects of tasks with unique Id's
*/
exports.create = function(options) {
    return new PendingTasks(options);
};
