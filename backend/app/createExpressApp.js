const express = require("express");
const bodyParser = require("body-parser");
const expressWinston = require("express-winston");
const apiRouter = require("./api/createApiRouter.js")();
const cors = require("cors");
const ApiError = require("./exceptions/api-error.js");
const fileUpload = require("express-fileupload");
const authMiddleware = require("./middlewares/authMiddleware.js");
const adminMiddleware = require("./middlewares/adminMiddleware.js");
const fs = require("fs");
const path = require("path");

module.exports = ({ database, logger, bot }) =>
	express()
		.use((req, res, next) => {
			res.header("Access-Control-Max-Age", "86400");
			next();
		})
		.use(
			expressWinston.logger({
				winstonInstance: logger,
				msg: "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms",
				meta: false,
			})
		)
		.use(bodyParser.urlencoded({ extended: true }))
		.use(bodyParser.json())
		.use((req, res, next) => {
			req.base = `${req.protocol}://${req.get("host")}`;
			req.logger = logger;
			req.db = database;
			req.tgBot = bot;
			req.ApiError = ApiError;
			return next();
		})
		.use(
			cors({
				origin: "*",
				credentials: true,
			})
		)
		.use((req, res, next) => {
			if (req.path.startsWith("/avatars")) {
				const filePath = path.join("static", req.path);
				fs.access(filePath, fs.constants.F_OK, (err) => {
					if (err) {
						res.sendFile(path.resolve(__dirname, "..", "static", "avatar_placeholder.webp"));
					} else {
						next();
					}
				});
			} else {
				next();
			}
		})
		.use("/", express.static("static"))
		.use(fileUpload())
		.use("/api/admin", authMiddleware, adminMiddleware)
		.use("/api", apiRouter)
		.use((req, res) => res.sendStatus(404))
		.use((error, req, res, next) => {
			logger.error(
				`userTgId: ${req?.user?.id}, username: ${req?.user?.username}, req.method: ${req.method}, req.path: ${req.path}, error: ${error}`
			);
			console.log("error:", error, "error.status:", error.status, "error.message:", error.message)
			if (error?.status) {
				return res.status(400).json(error);
			} else {
				return res.status(500).json({message: "Internal server error"})
			}
		})
