import path, { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import vueJsx from "@vitejs/plugin-vue-jsx"
import viteSvgIcons from "vite-plugin-svg-icons"
//mock
import { viteMockServe } from "vite-plugin-mock"
//inject title
import { createHtmlPlugin } from "vite-plugin-html"
//setup name
import VueSetupExtend from "vite-plugin-vue-setup-extend"
import viteCompression from "vite-plugin-compression"

// auto import element-plus has some issue
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

//auto import vue https://www.npmjs.com/package/unplugin-auto-import
import AutoImport from "unplugin-auto-import/vite"

import setting from "./src/settings"
const prodMock = setting.openProdMock
// import packageJson from './package.json'
// import { loadEnv } from 'vite'

const isProduction = process.env.NODE_ENV === "production"

export default ({ command, mode }: any) => {
  return {
    base: isProduction ? setting.viteBasePath : "",
    root: process.cwd(),
    //define global var
    define: {
      "process.platform": null,
      "process.version": null,
      GLOBAL_STRING: JSON.stringify("i am global var from vite.config.js define"),
      GLOBAL_VAR: {
        test: "i am global var from vite.config.js define"
      }
    },
    clearScreen: false,
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      port: 5003,
      strictPort: true,
      open: false,
      cors: true // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源

      //proxy look for https://vitejs.cn/config/#server-proxy
      // proxy: {
      //   '/api': {
      //     target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },

    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ["defaults", "not IE 11", "ie >= 11", "chrome 52"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"] // 面向IE11时需要此插件
      }),
      viteCompression({
        ext: ".gz",
        deleteOriginFile: false
      }),
      viteSvgIcons({
        iconDirs: [path.resolve(process.cwd(), "src/icons/common"), path.resolve(process.cwd(), "src/icons/nav-bar")], // config svg dir that can config multi
        symbolId: "icon-[name]" // appoint svg icon using mode
      }),
      // //https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md
      // viteMockServe({
      //   supportTs: true,
      //   mockPath: "mock",
      //   localEnabled: command === "serve",
      //   prodEnabled: prodMock,
      //   injectCode: `
      //     import { setupProdMockServer } from './mockProdServer';
      //     setupProdMockServer();
      //   `,
      //   logger: true
      // }),
      VueSetupExtend(),
      //https://github.com/antfu/unplugin-auto-import/blob/HEAD/src/types.ts
      AutoImport({
        // resolvers: [ElementPlusResolver()],
        imports: [
          "vue",
          "pinia",
          "vue-router",
          {
            "@/hooks/global/useCommon": ["useCommon"],
            "@/hooks/global/useElement": ["useElement"],
            "@/hooks/global/useVueRouter": ["useVueRouter"],
            "@/utils/axiosReq": ["axiosReq"]
          }
        ],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: true //auto generation auto-imports.d.ts file
      }),
      // auto config of index.html title
      createHtmlPlugin({
        inject: {
          // Inject data into ejs template
          data: {
            title: setting.title
          }
        }
      })
      // Components({
      //   resolvers: [ElementPlusResolver()]
      // })
    ],
    build: {
      // Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。
      minify: isProduction ? "esbuild" : "terser",
      brotliSize: false,
      assetsInlineLimit: 40900, // 默认4090（4kb）小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
      // chunkSizeWarningLimit: 1500,   //打包大小超过500kb警告, 大文件报警阈值设置,不建议使用
      terserOptions: {
        //remote console.log in prod
        //detail to look https://terser.org/docs/api-reference#compress-options
        compress: {
          drop_console: isProduction, // 生产环境去除console
          pure_funcs: ["console.log", "console.info"],
          drop_debugger: true
        }
      },
      assetsDir: "static/assets", //build assets Separate
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id: string | string[]) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString()
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    css: {
      postcss: {
        //remove build charset warning
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === "charset") {
                  atRule.remove()
                }
              }
            }
          }
        ]
      },
      preprocessorOptions: {
        //define global scss variable
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    //引入第三方配置
    optimizeDeps: {
      include: ["moment-mini"]
    }
  }
}
