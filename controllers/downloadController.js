const youtube = require("../services/youtube");

exports.index = (req, res) => {
    res.render("index", {
        error: null
    });
};

exports.download = async (req, res) => {

    try {

        const { url, format } = req.body;

        const file = await youtube.download(url, format);

        res.render("index", {
            error: {
                type: "success",
                msg: `Téléchargement terminé.<br><a href="/download/${file}">Télécharger</a>`
            }
        });

    } catch (err) {

        res.render("index", {
            error: {
                type: "error",
                msg: err.message
            }
        });

    }

};