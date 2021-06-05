/**
 * DON'T DO THE PLAGIAT!
 * This is the source code for the Duckbot queue.
 * https://t.me/Miss_DuckBotInfo/55
 * We created this queue code ourselves and it took days to get the algorithm.
 * Anda tetap dapat berkontribusi untuk mengembangkan Queue ini agar lebih baik. Tapi jangan melakukan plagiat.
 */

export class Queue {
  jobs: Array<any>
  now: Array<any>
  constructor() {
    this.jobs = []
    this.now = []
  }
  /**
   * @param {Object} data - json object from a task that will be executed
   * @param {Function} next - Some function to executed jobs
   */
  run(data, next) {
    try {
      this.now.push(data)
      next(this.now[0], this.jobs)
      return this.end(data.taskId, next)
    } catch (error) {
      return this.end(data.taskId, next)
    }
  }
  /**
   * @param {Object} obj - json object to create new task.or jobs
   * @param {Function} next - Some function to executed jobs
   */
  create(obj, next) {
    let id = `jobs-${Date.now()}.duckbot.task`
    let data = {
      taskId: id,
      ...obj,
    }
    this.jobs.push(data)
    if (this.now.length == 0) {
      this.run(data, next)
    }
  }
  /**
   * @param {string} taskId - taskId to end task
   * @param {Function} next - Some function to executed after end
   */
  end(taskId, next) {
    let index = this.jobs.findIndex((el, i) => el.taskId == taskId)
    if (index !== -1) {
      this.jobs.splice(index, 1)
      this.now.splice(0, 1)
    }
    if (this.jobs.length == 0) return
    return this.run(this.jobs[0], next)
  }
  /**
   * @param {string} taskId - taskId to end the task according to the id. This function will not work if you stop the currently running task.
   * @param {Function} next - Some function to executed after canceled
   */
  cancel(taskId, next) {
    let index = this.jobs.findIndex((el, i) => el.taskId == taskId)
    if (index !== -1 && this.now[index].taskId !== taskId) {
      this.jobs.splice(index, 1)
      return next(this.jobs)
    }
    return
  }
}
/*
How to use?

import {Queue} from "./queue" // import this module
let jobs = new Queue() // create new constructor

jobs.create({
  // jobs to running
},(now,list)=>{
  // running
})

jobs.cancel(taskId,(list)=>{
  // if jobs succes canceled.
})

Note only use jobs.create and jobs.cancel

copyright butthx 2020

*/
