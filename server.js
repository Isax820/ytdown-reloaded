require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ===== Configuration =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Fichiers statiques
app.use(express.static(path.join(__dirname, "assets")));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ===== Routes =====
app.use("/", require("./routes"));

// ===== 404 =====
app.use((req, res) => {
    res.status(404).render("404", {
        title: "404",
        message: "Page introuvable"
    });
});

// ===== Gestion globale des erreurs =====
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).render("error", {
        title: "Erreur",
        message: err.message || "Une erreur est survenue."
    });
});

// ===== Port =====
const PORT = process.env.PORT || process.env.p || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
