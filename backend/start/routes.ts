/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from "#controllers/auth_controller";
import SubtitlesController from "#controllers/subtitles_controller";
import router from "@adonisjs/core/services/router";
import { middleware } from "./kernel.js";

router.get("/", async () => {
    return {
        hello: "world",
    };
});

router.post("/login", [AuthController, "login"]);
router.post("/register", [AuthController, "register"]);
router.get("/google/redirect", [AuthController, "googleRedirect"]);
router.get("/google/callback", [AuthController, "googleCallback"]);

router.group(() => {
    router.get("/all", [SubtitlesController, "fetchAll"])
    router.post("/", [SubtitlesController, "save"])
    router.get("/:id", [SubtitlesController, "fetch"])
    router.delete("/:id", [SubtitlesController, "delete"])
    router.patch("/:id", [SubtitlesController, "update"])
}).prefix("srt").use(middleware.auth());