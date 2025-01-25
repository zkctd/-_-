import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    inject({
      "window.Quill": ["@vueup/vue-quill", "Quill"],
      Quill: ["@vueup/vue-quill", "Quill"],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        Math: "always",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), //配置@路径
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
    terserOptions: {
      compress: {
        keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
        drop_console: true, // 生产环境去除 console
        drop_debugger: true, // 生产环境去除 debugger
      },
      format: {
        comments: false, // 删除注释
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 80,
    open: true,
  },
});
