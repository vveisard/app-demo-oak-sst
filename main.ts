//
import { Application } from "oak";
import babelPresetSolid from "babel-preset-solid";
import babelPresetMinify from "babel-preset-minify";
import { CSSModuleExports, transform } from "lightningcss";
import { PluginPass, TransformOptions } from "@babel/core";
//
import { createSstHtmlMinifierTerserMiddleware } from "oak-sst-html-minifier-terser";
import { createSstLightningCSSMiddleware } from "oak-sst-lightningcss";
import { createSstBabelMiddleware } from "oak-sst-babel";
import babelPluginTransformCssModuleImport from "babel-plugin-transform-css-module-import";

/**
 * Get exports of a CSS module using Lightning CSS.
 */
const getCssModuleExportsUsingLightningCSS = (
  absoluteRootDirPath: string,
  state: PluginPass,
  absoluteCssFilePath: string,
) => {
  const encoder = new TextEncoder();
  const cssCodeText = Deno.readTextFileSync(absoluteCssFilePath);
  const cssCodeBytes = encoder.encode(cssCodeText);

  const transformResult = transform(
    {
      code: cssCodeBytes,
      cssModules: true,
      projectRoot: absoluteRootDirPath,
      filename: absoluteCssFilePath,
      analyzeDependencies: false,
    },
  );

  return Object.fromEntries(
    Object.entries(transformResult.exports as CSSModuleExports).map(
      (iEntry) => {
        return [
          iEntry[0],
          iEntry[1].name,
        ];
      },
    ),
  );
};

// @region-begin

const app = new Application();
const absoluteRootDirPath = `${Deno.cwd()}/app`;

const babelTransformOptions: TransformOptions = {
  cwd: absoluteRootDirPath,
  presets: [
    babelPresetSolid,
    babelPresetMinify,
  ],
  plugins: [
    babelPluginTransformCssModuleImport({ // TODO cache output of lightning CSS so each file is processed only once
      absoluteRootDirPath: absoluteRootDirPath,
      getCssModuleExports: getCssModuleExportsUsingLightningCSS,
    }),
  ],
};

const sstBabelMiddleware = createSstBabelMiddleware(
  {
    absoluteRootDirPath: absoluteRootDirPath,
    transformOptions: babelTransformOptions,
  },
);

const sstLightningCSSMiddleware = createSstLightningCSSMiddleware(
  {
    absoluteRootDirPath: absoluteRootDirPath,
    transformOptions: {
      cssModules: true,
      analyzeDependencies: false,
      minify: true,
    },
  },
);

const sstHtmlMinifierTerserMiddleware = createSstHtmlMinifierTerserMiddleware(
  {
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyJS: true,
    processScripts: [
      "importmap",
    ],
  },
);

app.use(
  sstHtmlMinifierTerserMiddleware,
);

app.use(
  sstLightningCSSMiddleware,
);

app.use(
  sstBabelMiddleware,
);

// serve static file
app.use(
  async (ctx, next) => {
    try {
      await ctx.send({
        root: absoluteRootDirPath,
        index: "index.html",
      });
    } catch {
      await next();
    }
  },
);

await app.listen({ port: 8000 });

// @region-end
