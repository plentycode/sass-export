# Sass-Export
Sass-export helps you to use Sass files to generate a JSON file you can use in your application as data.
This is perfect for site documentation generation process.

# Let's get started!


#### CLI
Install it from NPM

```
$ npm install -g sass-export
```

Ready to export:

```
$ sass-export _globals.scss _colors.scs --output exported-sass.json
```

### Here's a sample output

[file] _variables.css

``` scss
  $gray-medium: #757575;
  $base-value: 25px;
  $gray-dark: darken($gray-medium, 5%);
  $logo: url(logo.svg);
  $logo-quotes: url('logo.svg');
  $calculation: $base-value - 12px;
  $multiple-calculations: $base-value - floor(12.5px);
```

[output]  exported-sass.json

``` javascript
[
  { "variable": "$gray-medium", "value": "#757575", "compiledValue": "#757575" },
  { "variable": "$base-value", "value": "25px", "compiledValue": "25px" },
  { "variable": "$gray-dark", "value": "darken($gray-medium, 5%)", "compiledValue" :"#686868" },
  { "variable": "$logo", "value": "url(logo.svg)", "compiledValue": "url(logo.svg)" },
  { "variable": "$logo-quotes", "value": "url('logo.svg')", "compiledValue": "url(\"logo.svg\")" },
  { "variable": "$calculation", "value": "$base-value - 12px", "compiledValue": "13px" },
  { "variable": "$multiple-calculations", "value": "$base-value - floor(12.5px)", "compiledValue": "13px" }
]
```

### Section Groups Annotations
From version 0.0.1 basic annotations are supported to split files into sections:

[input] _annotations.scss

``` scss
$black: #000;
$slate: #8ca5af;

/**
 * @sass-export-section="brand-colors"
 */
$brand-gray-light: #eceff1;
$brand-gray-medium: #d6d6d6;
$brand-gray: #b0bec5;
//@end-sass-export-section [optional]

/**
 * @sass-export-section="fonts"
 */
$font-size: 16px;
$font-color: $brand-gray-medium;
//@end-sass-export-section

$global-group: #FF0000;
```

Then we run sass-export, don't forget to include **--structured** flag:
```
$ sass-export scss/_annotations.scss -o=exported-grouped.json -s
```


exported-grouped.json
``` javascript
{
"globals": [
    { "variable": "$black", "value": "#000", "compiledValue": "#000" },
    { "variable": "$slate", "value": "#8ca5af", "compiledValue": "#8ca5af" },
    { "variable": "$global-group", "value": "#ff0000", "compiledValue": "#ff0000" }
],
"brand-colors": [
    { "variable": "$brand-gray-light", "value": "#eceff1", "compiledValue":"#eceff1" },
    { "variable": "$brand-gray-medium", "value": "#d6d6d6" ,"compiledValue":"#d6d6d6" },
    { "variable": "$brand-gray", "value": "#b0bec5", "compiledValue": "#b0bec5" }
],
"fonts": [
    { "variable": "$font-size", "value": "16px", "compiledValue": "16px" },
    { "variable": "$font-color", "value": "$brand-gray-medium", "compiledValue":"#d6d6d6" }
]
}
```

### Include Paths for @import
In order to support @import we need to include **--dependencies** parameter with a comma separated list of the folder path to include:
```
$ sass-export scss/_fonts.scss -o=exported-dependencies.json -s -d "src/sass/config/, src/sass/libs/"
```

in order to use:

``` scss
@import "breakpoints";
@import "globals";

$imported-value: $bp-desktop;
$font-size: $global-font-size;
````

## Want to use it in your Node App?
Just import it!

Old way:
``` javascript
var exporter = require('sass-export').default;
```

New fancy way:

``` javascript
 import exporter from { 'sass-export' };
```


#### Example:

Written using ES5 syntax and  using nodeJs v4.0.0. it is compatible!
``` javascript
// sass-export module it is wrapped in a 'default' property
var exporter = require('sass-export').default;

//basic options
var options = {
  inputFiles: ['_variables.scss', '_fonts.scss'],
  includePaths: ['libs/'] //don't forget this is the folder path not the files
};

// you can get an object {globals:[], colors: []}
var asObject = exporter(options).getStructured();

console.log(asObject.globals);
console.log(asObject.colors);

// or get an array [{}, {}]
var asArray = exporter(options).getArray();
console.log(asArray)
```

### Tech Dependencies
We recommend using [Node.js](https://nodejs.org/) v4+.


Has dependencies on these projects:

* [node.js] - evented I/O for the backend.
* [Node-Sass] - library that provides binding for Node.js to LibSass, the C version of the popular stylesheet preprocessor, Sass.

### Usage

Usage: sass-export [inputFiles] [options]

| Options | Type | Description |
| ------                | ----        | ------ |
|  -o, --output         |  String     |    File path where to save the JSON exported. |
|  -s, --structured     |  Boolean    |   If it is present, it will output an object structured file instead of a plain array. |
|  -d, --dependencies   |  String[]   |   List of dependencies separated by comma, where Sass will try to find the @imports that your inputFiles need to work. Example: "libs/, config/, globals/". |
|  -h, --help           |   Boolean   |  Shows up this help screen. |


### More to come soon:
  * Import/require module documentation
  * Gulp plugin
  * Include/Exclude annotations.
  * Demo Page


License
----

ISC

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)

[node.js]: <http://nodejs.org>
[node-sass]: <https://github.com/sass/node-sass>
