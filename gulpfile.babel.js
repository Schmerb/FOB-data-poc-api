import { series, src, dest, watch, parallel } from "gulp";
import babel from "gulp-babel";
import nodemon from "gulp-nodemon";
import minify from "gulp-minify";
import cache from "gulp-cached";
import path from "path";

const SOURCES = ["src/**/*.js", "server.js"];
const DEST_DIR = "dist";
const MAIN = path.join(DEST_DIR, "server.js");

export function compile() {
  return (
    src(SOURCES)
      .pipe(cache("compile"))
      .pipe(
        babel({
          presets: ["@babel/preset-env"]
        })
      )
      // .pipe(
      //   minify({
      //     ext: {
      //       src: ".js",
      //       min: ".min.js"
      //     }
      //   })
      // )
      .pipe(dest(DEST_DIR))
  );
}

export function watchSrc() {
  return watch("src/**/*.js", compile);
}

export function start(done) {
  nodemon({
    script: "dist/server.js",
    ext: "js",
    env: { NODE_ENV: "development" },
    done
  });
}

export default parallel(series(compile, watchSrc), start);
