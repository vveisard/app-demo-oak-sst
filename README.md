Demo of a solidjs app on a Deno server with server-side transformation (SST) using [oak](https://deno.land/x/oak@v12.6.1) with middleware: 
- [oak-babel-sst](https://github.com/vveisard/oak-sst-babel) with:
    - [babel-preset-solid](https://deno.land/x/babel_preset_solid@v1.7.11)
    - [babel-preset-minify](https://babeljs.io/docs/babel-preset-minify)
    - [babel-plugin-transform-css-module-import](https://github.com/vveisard/babel-plugin-transform-css-module-import)
- [oak-sst-lightningcss](https://github.com/vveisard/oak-sst-lightningcss)
- [oak-sst-html-minifier-terser](https://github.com/vveisard/oak-sst-html-minifier-terser)

# Development
## dev
Run `deno task dev` to start the server up.