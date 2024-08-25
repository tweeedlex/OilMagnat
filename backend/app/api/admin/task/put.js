const { Router } = require("express");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

module.exports = Router({ mergeParams: true }).put(
  "/admin/task",
  async (req, res, next) => {
    try {
      const { db, ApiError } = req;
      const { _id, name, description, link, reward, isPartnership, isOthers, referralsNeeded, chatId, maxClaimsLimit, order, hidden } = req.body;

      if (!_id) {
        return next(ApiError.BadRequest('Task ID is required'));
      }

      const updateFields = {};
      if (name) updateFields.name = name;
      if (description) updateFields.description = description;
      if (link) updateFields.link = link;
      if (reward) updateFields.reward = reward;
      if (isPartnership !== undefined) updateFields.isPartnership = isPartnership;
      if (chatId) updateFields.chatId = chatId;
      if (maxClaimsLimit) updateFields.maxClaimedLimit = maxClaimsLimit;
      if (isOthers !== undefined ) updateFields.isOthers = isOthers;
      if (referralsNeeded) updateFields.referralsNeeded = referralsNeeded;
      if (order) updateFields.order = order;
      if (hidden !== undefined) updateFields.hidden = hidden;


      if (req.files && req.files?.image) {
        const image = req.files.image;
        const extension = image.name.split(".").pop();
        const imageName = `${uuid.v4()}.${extension}`;
        const taskImagesPath = path.resolve(__dirname, "../../../../static/tasks");
        const imagePath = path.resolve(taskImagesPath, imageName);

        // make directory if doesn't exist
        if (!fs.existsSync(taskImagesPath)) {
          fs.mkdirSync(taskImagesPath, { recursive: true });
        }

        await image.mv(imagePath);
        updateFields.image = imageName;

        const prevTask = await db.Task.findOne({ _id });

        // remove previous image
        if (prevTask.image) {
          fs.unlinkSync(path.resolve(taskImagesPath, prevTask.image));
        }
      }

      const task = await db.Task.findOneAndUpdate(
        { _id },
        updateFields,
        { new: true }
      );

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
);
