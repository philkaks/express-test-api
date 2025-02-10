// const functions = require("firebase-functions");
// const app = require("./src/app");


// //🚀 Deploy Express app as a Firebase Function
// exports.api = functions.https.onRequest(app);


const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fileParser = require("express-multipart-file-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Readable } = require("stream");
const { error } = require("console");

admin.initializeApp();
const app = express();

app.use(fileParser);
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload", async (req, res) => {
    try {
        const storage = admin.storage().bucket();
        const file = req.files[0];

        if (!file) {
            return res.status(400).send("No file uploaded");
            
        }

        console.log(file)

        const fileStream = Readable.from(file.buffer)

        const fileUpload = storage.file('test/${file.originalname}')

        const writeStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        fileStream.pipe(writeStream).on("error", error => {
            console.error("Error:", error)
            res.status(500).send({ message: error.message });
        }).on("finish", async () => {
            try {
                await fileUpload.makePublic();

                const publicUrl = 'https://storage.googleapis.com/${storage.name}/${fileUpload.name}';

                console.log("File Upload Complete")

                res.status(200).send({ fileUrl: publicUrl });


            } catch (error) {
                console.error("Error making file public :", error)
                res.status(500).send({ message: error.message });
                
            }
        })

    } catch (error) {
        console.error("Error making file public :", error);
        res.status(500).send({ message: error.message });
        
    }

});
 
exports.api = functions.https.onRequest(app);