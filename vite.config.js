import path from "path";

export default {
  // 設定オプション
  root: "./src",
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        index: "/index.html",
        top: "/top.html",
        mypage: "/mypage.html",
        upload: "/upload.html",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "../dist",
    minify: false,
    emptyOutDir: true,
  },
};
