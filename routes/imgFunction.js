const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_WEBSITE,
  process.env.SUPABASE_KEY
);

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const uploadImg = async (file, username, id, Img, foldername = "post") => {
  const fileDetails = path.parse(file.originalname);
  const filename = `${username}/${foldername}/${
    fileDetails.name
  }${username}${id}${Math.floor(Math.random() * 1000)}${fileDetails.ext}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(filename, file.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype,
    });
  if (error) {
    throw new Error("Could Not upload file. " + error);
  }

  await deleteImg(Img.filename);
  const { signedURL } = await supabase.storage
    .from("images")
    .createSignedUrl(filename, 3153600000);
  return { url: signedURL, filename: filename };
};

const deleteImg = async (filename) => {
  await supabase.storage.from("images").remove([filename]);
};

module.exports = {
  uploadImg,
  upload,
  deleteImg,
};
