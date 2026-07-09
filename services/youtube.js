const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");
const randomstring = require("randomstring");

const DOWNLOAD_DIR = path.join(__dirname, "..", "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

exports.download = async (url, format) => {

    const id = randomstring.generate(12);

    const output = path.join(
        DOWNLOAD_DIR,
        `${id}.%(ext)s`
    );

    if (format === "mp3") {

        await youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            output
        });

        return `${id}.mp3`;
    }

    await youtubedl(url, {
        format: "bestvideo+bestaudio/best",
        output
    });

    const file = fs.readdirSync(DOWNLOAD_DIR)
        .find(f => f.startsWith(id));

    return file;

};