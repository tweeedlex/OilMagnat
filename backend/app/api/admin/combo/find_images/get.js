const {Router} = require("express");
const {findImages} = require("../../../../helpers/minigames");

module.exports = Router({mergeParams: true}).get(
  "/admin/combo/find_images",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const images = await findImages(db.ComboImage, "combo");
      return res.json({images});
    } catch (error) {
      next(error);
    }
  }
);
