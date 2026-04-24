const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
// Đọc biến môi trường từ process.env
const env = process.env;

// Đường dẫn tới template và file output
const templatePath = path.join(
  __dirname,
  "../public/firebase-sw-env.template.js"
);
const outputPath = path.join(__dirname, "../public/firebase-sw-env.js");

// Đọc template
let content = fs.readFileSync(templatePath, "utf8");

// Thay thế các placeholder bằng giá trị thực tế từ env
content = content
  .replace("__VITE_FIREBASE_API_KEY__", env.VITE_FIREBASE_API_KEY || "")
  .replace("__VITE_FIREBASE_AUTH_DOMAIN__", env.VITE_FIREBASE_AUTH_DOMAIN || "")
  .replace("__VITE_FIREBASE_PROJECT_ID__", env.VITE_FIREBASE_PROJECT_ID || "")
  .replace(
    "__VITE_FIREBASE_STORAGE_BUCKET__",
    env.VITE_FIREBASE_STORAGE_BUCKET || ""
  )
  .replace(
    "__VITE_FIREBASE_MESSAGING_SENDER_ID__",
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || ""
  )
  .replace("__VITE_FIREBASE_APP_ID__", env.VITE_FIREBASE_APP_ID || "")
  .replace(
    "__VITE_FIREBASE_MEASUREMENT_ID__",
    env.VITE_FIREBASE_MEASUREMENT_ID || ""
  );

// Ghi ra file output
fs.writeFileSync(outputPath, content);
console.log("Generated firebase-sw-env.js with environment variables.");
