export default {
  // 設定オプション
  root: "./src",
  build: {
    rollupOptions: {
      input: {
        index: "/index.html",
        top: "/top.html",
        mypage: "/mypage.html",
        upload: "/upload.html",
      },
    },
    outDir: "../dist",
    minify: false,
    emptyOutDir: true,
  },
};
