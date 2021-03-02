# Chess 0x539

WebAssembly Chess Engine made with rust, [Demo](http://chess.0x539.co/)

## A chess app using rust webassembly and react js

### Rust

TBA

### WASM

TBA

### ReactJS

TBA

# Running the project

## Clone this repository:

```sh
$ git clone https://github.com/l0x539/chess-0x539
```

## Installing npm package:

* Navigate to the repository folder and run following command:

```sh 
$ npm install
```

## Installing Rust packages:
* Navigate to the repository folder and run following commands:

- you'll need [wasm-bindgen-cli](https://rustwasm.github.io/wasm-bindgen/reference/cli.html) using following command:

```sh
$ rustup target add wasm32-unknow-unknown
$ cargo +nightly install wasm-bindgen-cli
$ cargo build
```

## Run the app:

Once you setup the recommended packages, you can run the following command to see the test:

```sh
$ yarn dev
```
or
```sh
$ npm run dev
```

# Running a rust Webassembly Website (not required for this repo)

## Steps to compile

1. Setting up rust project:
* install it using [rustup](https://rustup.rs/):
```sh
$ rustup target add wasm32-unknow-unknown
```
* install [wasm-bindgen-cli](https://rustwasm.github.io/wasm-bindgen/reference/cli.html) using following command:
```sh
$ cargo +nightly install wasm-bindgen-cli
```
* create the project folder:
```sh
$ cargo +nightly new chess-0x539 --lib
```

2. Adding `Cargo.toml` configuration:

* Add following lines:

```toml
[lib]
crate-type = ["cdylib"]
```
 * Add wasm bindgen using [cargo edit](https://crates.io/crates/cargo-edit):
 ```sh
 $ cargo add wasm-bindgen
 ```

 this wall add following line to your toml file:
 ```
 ...
 [dependencies]
 wasm-bindgen = "x.x.x"
 ```
 in this cas `0.2.70`

 3. Build the project:
 * Intstall Rust dependencies:
 ```sh
 $ cargo build
 ```

 4. Test case:
 * Inside `src/lib.rs` put this:
 ```rust
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn run_alert(item: &str) {
    alert(&format!("This is WASM and {}", item));
}
 ```

 * Build the wasm file and typescript files:
 ```shell
 $ cargo +nightly build --target wasm32-unknown-unknown
 ```

 * Clone built files on current directory

 ```shell
 $ wasm-bindgen target/wasm32-unknown-unknown/debug/chess-0x539.wasm --out-dir .
 ```

* Create js file `index.js` to import and call the wasm functions:

```js
const rust = import("./chess_0x539.wasm")

rust.then(func => {
    func.run_alert("Nico")
})
```

* install and add [webpack](https://webpack.js.org/) inside `package.json` (create the file):

```json
{
    "scripts": {
        "server": "webpack-dev-server"
    },
    "defDependencies": {
        "webpack": "4.15.1",
        "webpack-cli": "3.0.8",
        "webpack.dev.server": "3.1.4"
    }
}
```

* Add a webpack config file `webpack.config.js`:

```js
const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    },
    mode: "development"
}
```

* Add an html index file to render DOM `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>0x539 wasm test</title>
</head>
<body>
    <script src="index.js"></script>
</body>
</html>
```

* Install JS dependencies:

```sh
$ yarn install
```
or
```sh
$ npm install
```

* Run test:
```sh
$ yarn serve
```


Now your App should be running on http://localhost:8080 and you should receive an alert box.