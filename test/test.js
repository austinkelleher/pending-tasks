/**
* Using .exist as a property instead of a function makes jshint unhappy!
*/
/*jshint -W030 */
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var uuid = require('uuid');
var PendingTasks = require('../index');

describe('Pending Tasks', function() {

    describe('Adding tasks', function() {
        var pendingTasks;

        beforeEach(function(done) {
            pendingTasks = PendingTasks.create();
            done();
        });

        it('should allow tasks to be added as object', function(done) {
            pendingTasks.add({
                id: uuid.v4(),
                timeout: 1,
                task: function() {
                    done();
                }
            });
        });

        it('should allow tasks to be added as array', function(done) {
            var finishedFirstTask = false;
            pendingTasks.add([
                {
                    id: uuid.v4(),
                    timeout: 100,
                    task: function() {
                        finishedFirstTask = true;
                    }
                },
                {
                    id: uuid.v4(),
                    timeout: 200,
                    task: function() {
                        expect(finishedFirstTask).to.equal(true);
                        done();
                    }
                }
            ]);
        });

        it('should not allow adding task with Id that already exists', function(done) {
            var taskId = uuid.v4();
            pendingTasks.add({
                id: taskId,
                timeout: 100,
                task: function() {}
            });

            try {
                pendingTasks.add({
                    id: taskId,
                    timeout: 100,
                    task: function() {}
                });
            } catch(e) {
                expect(e).to.exist;
                done();
            }
        });

        it('should not allow adding task without id', function(done) {
            try {
                pendingTasks.add({
                    timeout: 100,
                    task: function() {}
                });
            } catch(e) {
                expect(e).to.exist;
                done();
            }
        });

        it('should not allow adding task without task function', function(done) {
            try {
                pendingTasks.add({
                    id: uuid.v4(),
                    timeout: 100
                });
            } catch(e) {
                expect(e).to.exist;
                done();
            }
        });
    });

    describe('Deleting Tasks', function() {
        var pendingTasks;

        beforeEach(function(done) {
            pendingTasks = PendingTasks.create();
            done();
        });

        it('should allow deletion of single task', function() {
            var finishedTask = false;
            var taskId = uuid.v4();

            pendingTasks.add({
                id: taskId,
                timeout: 1000,
                task: function() {
                    finishedTask = true;
                }
            });

            pendingTasks.delete(taskId);
            setTimeout(function() {
                expect(finishedTask).to.equal(false);
            }, 1000);
        });

        it('should not allow deletion of a task that has completed', function(done) {
            var finishedTask = false;
            var taskId = uuid.v4();

            pendingTasks.add({
                id: taskId,
                timeout: 100,
                task: function() {
                    finishedTask = true;
                }
            });

            setTimeout(function() {
                try {
                    pendingTasks.delete(taskId);
                } catch(e) {
                    expect(e).to.exist;
                    expect(finishedTask).to.equal(true);
                    done();
                }
            }, 500);
        });
    });

    describe('Task information', function() {
        var pendingTasks;

        beforeEach(function(done) {
            pendingTasks = PendingTasks.create();
            done();
        });

        it('should be pending if not completed', function() {
            var finishedTask = false;
            var taskId = uuid.v4();

            pendingTasks.add({
                id: taskId,
                timeout: 1000,
                task: function() {
                    finishedTask = true;
                }
            });

            expect(pendingTasks.isPending(taskId)).to.equal(true);
        });

        it('should not be pending if completed', function(done) {
            var finishedTask = false;
            var taskId = uuid.v4();

            pendingTasks.add({
                id: taskId,
                timeout: 1,
                task: function() {
                    finishedTask = true;
                }
            });

            setTimeout(function() {
                expect(pendingTasks.isPending(taskId)).to.equal(false);
                done();
            }, 100);
        });

        it('should provide task created information if task is pending', function(done) {
            var taskId = uuid.v4();

            pendingTasks.add({
                id: taskId,
                timeout: 100,
                task: function() {}
            });

            setTimeout(function() {
                expect(pendingTasks.getTaskCreatedTime(taskId)).to.be.below(Date.now());
                done();
            }, 50);
        });

        it('should provide task remaining execution time', function(done) {
            var taskId = uuid.v4();
            var timeout = 500;

            pendingTasks.add({
                id: taskId,
                timeout: timeout,
                task: function() {}
            });

            setTimeout(function() {
                expect(pendingTasks.getTimeRemaining(taskId)).to.be.below(timeout);
                done();
            }, 50);
        });

        it('should return null if task does not exist', function(done) {
            pendingTasks.add({
                id: uuid.v4(),
                timeout: 100,
                task: function() {}
            });

            setTimeout(function() {
                expect(pendingTasks.getTimeRemaining(uuid.v4())).to.equal(null);
                expect(pendingTasks.getTaskCreatedTime(uuid.v4())).to.equal(null);
                done();
            }, 50);
        });
    });

    describe('Task Option Creation', function() {

        it('should allow creation of task with default timeout', function(done) {
            var pendingTasks = PendingTasks.create({
                defaultTimeout: 1500
            });

            var finishedTask = false;
            pendingTasks.add({
                id: uuid.v4(),
                task: function() {
                    finishedTask = true;
                }
            });

            expect(finishedTask).to.equal(false);
            setTimeout(function() {
                expect(finishedTask).to.equal(true);
                done();
            }, 1600);
        });

        it('should allow creation of task with options and tasks', function(done) {
            var timeout = 500;
            var finishedTask1 = false;
            var finishedTask2 = false;
            var finishedTask3 = false;

            var pendingTasks = PendingTasks.create({
                defaultTimeout: timeout,
                tasks: [
                    {
                        id: uuid.v4(),
                        timeout: 700,
                        task: function() {
                            finishedTask1 = true;
                        }
                    },
                    {
                        id: uuid.v4(),
                        task: function() {
                            finishedTask2 = true;
                        }
                    }
                ]
            });

            pendingTasks.add({
                id: uuid.v4(),
                timeout: timeout,
                task: function() {
                    finishedTask3 = true;
                }
            });

            expect(finishedTask1).to.equal(false);
            expect(finishedTask2).to.equal(false);

            setTimeout(function() {
                expect(finishedTask1).to.equal(false);
                expect(finishedTask2).to.equal(true);
                expect(finishedTask3).to.equal(true);

                setTimeout(function() {
                    expect(finishedTask1).to.equal(true);
                    done();
                }, 150);
            }, 600);
        });
    });
});
