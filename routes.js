const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const ytdl = require("@distube/ytdl-core");
const randomstring = require("randomstring");
const ffmpeg = require("fluent-ffmpeg");

const DOWNLOAD_DIR = path.join(__dirname, "..", "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

router.get("/", (req, res) => {
    res.render("index", { error: null });
});

router.post("/", async (req, res) => {
    try {
        const { url, format } = req.body;

        if (!url || !ytdl.validateURL(url)) {
            return res.render("index", {
                error: {
                    type: "error",
                    msg: "Lien YouTube invalide."
                }
            });
        }

        if (!["mp3", "mp4"].includes(format)) {
            return res.render("index", {
                error: {
                    type: "error",
                    msg: "Format invalide."
                }
            });
        }

        const filename = randomstring.generate(12);
        const output = path.join(DOWNLOAD_DIR, `${filename}.${format}`);

        if (format === "mp4") {
            const stream = ytdl(url, {
                quality: "highest"
            });

            stream.on("error", (err) => {
                console.error(err);

                return res.render("index", {
                    error: {
                        type: "error",
                        msg: "Impossible de télécharger cette vidéo."
                    }
                });
            });

            stream
                .pipe(fs.createWriteStream(output))
                .on("finish", () => {
                    res.render("index", {
                        error: {
                            type: "success",
                            msg: `<a href="/download/${filename}.${format}">Télécharger le fichier</a>`
                        }
                    });
                });
        }

        if (format === "mp3") {
            ffmpeg(ytdl(url, { quality: "highestaudio" }))
                .audioBitrate(128)
                .toFormat("mp3")
                .save(output)
                .on("end", () => {
                    res.render("index", {
                        error: {
                            type: "success",
                            msg: `<a href="/download/${filename}.mp3">Télécharger le MP3</a>`
                        }
                    });
                })
                .on("error", (err) => {
                    console.error(err);

                    res.render("index", {
                        error: {
                            type: "error",
                            msg: "Erreur lors de la conversion."
                        }
                    });
                });
        }

    } catch (err) {
        console.error(err);

        res.render("index", {
            error: {
                type: "error",
                msg: err.message
            }
        });
    }
});

router.get("/download/:file", (req, res) => {

    const file = path.join(DOWNLOAD_DIR, req.params.file);

    if (!fs.existsSync(file)) {
        return res.redirect("/");
    }

    res.download(file, () => {

        fs.unlink(file, () => {});

    });

});

module.exports = router;
