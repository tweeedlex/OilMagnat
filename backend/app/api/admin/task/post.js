const {Router} = require("express");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

module.exports = Router({mergeParams: true}).post(
  "/admin/task",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const {name, description, link, reward, isPartnership, isOthers, referralsNeeded, chatId, maxClaimsLimit, order, hidden} = req.body
      if (!name || !description || !reward) {
        return next(ApiError.BadRequest('Some parameters are missing. Required: name, description, reward, image. Optional: link, chatId, isOthers, referralsNeeded, maxClaimsLimit, order, hidden'));
      }

      if (!req.files || !req.files.image) {
        return next(ApiError.BadRequest('Image is required'));
      }

      const image = req.files.image;
      const extension = image.name.split(".")[1];
      const imageName = `${uuid.v4()}.${extension}`;
      const taskImagesPath = path.resolve(__dirname, "../../../../static/tasks");
      const imagePath = path.resolve(taskImagesPath, imageName);

      // make directory if doesn't exist
      if (!fs.existsSync(path.resolve(taskImagesPath))) {
        fs.mkdirSync(path.resolve(taskImagesPath));
      }

      await image.mv(imagePath);

      const task = await db.Task.create({
        name,
        description,
        link,
        reward,
        isPartnership,
        isOthers,
        referralsNeeded,
        chatId,
        maxClaimsLimit,
        order,
        hidden,
        image: imageName
      });

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
);
