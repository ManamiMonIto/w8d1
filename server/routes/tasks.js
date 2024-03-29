const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const router = express.Router();

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then(task => {
      res.json(task);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/", (req, res) => {
  const { title, description, projectId } = req.body;
  console.log(req.body);
  Task.create({
    title,
    description,
    project: projectId
  })
    .then(task => {
      return Project.findByIdAndUpdate(projectId, {
        $push: { tasks: task._id }
      }).then(() => {
        res.json({
          message: `Task with id ${
            task._id
          } was successfully added to project with id ${projectId}`
        });
      });
    })
    .catch(err => {
      res.json(err);
    });
});

router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;

  Task.findByIdAndUpdate(id, { title, description })
    .then(() => {
      res.json({ message: `Project with id ${id} was successfully updated` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then(task => {
      return Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: id }
      }).then(() => {
        res.json({ message: `Project with id ${id} was successfully deleted` });
      });
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
