const {Router} = require("express");
const {findImages} = require("../../../../helpers/minigames");

module.exports = Router({mergeParams: true}).get(
  "/admin/secretkey/find_images",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const images = await findImages(db.SecretKeyImage, "secretkey");
      return res.json({images});
    } catch (error) {
      next(error);
    }
  }
);
