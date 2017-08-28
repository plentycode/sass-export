# Sass-Export
**Sass-export** takes SCSS files and export them to a JSON file you can use as data.
This is perfect for generating your site documentation.


#### CLI
Install it from NPM

```
$ npm install -g sass-export
```

Ready to export:

```
$ sass-export scss/config/*.scss -o exported-sass-array.json
```

### Here's a sample output

_input:_ _variables.css

``` scss
  $gray-medium: #757575;
  $base-value: 25px;
  $gray-dark: darken($gray-medium, 5%);
  $logo: url(logo.svg);
  $logo-quotes: url('logo.svg');
  $calculation: $base-value - 12px;
  $multiple-calculations: $base-value - floor(12.5px);
```

_output_: [exported-sass-array.json]

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
You can easily organize your variables into a Javascript object using sass-export annotations:

_input:_ _annotations.scss

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
$ sass-export scss/_annotations.scss -o exported-grouped.json -s
```


_output_ [exported-grouped.json]
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

### Map support
In case you wanted your sass Maps variable to be an array we included te **mapValue** property for variables identified as maps.

_input:_ _breackpoints.scss
``` scss
$breakpoints: (
  small: 767px,
  medium: 992px,
  large: 1200px
);
```
_output:_ [exported-maps.json]

```javascript
{
  "globals": [
    {
      "variable": "$breakpoints",
      "value": "(small: 767px,\n  medium: 992px,\n  large: 1200px\n)",
      "mapValue": [
        { "variable": "small", "value": "767px", "compiledValue": "767px" },
        { "variable": "medium","value": "992px", "compiledValue": "992px" },
        { "variable": "large", "value": "1200px", "compiledValue": "1200px" }
      ],
      "compiledValue": "(small:767px,medium:992px,large:1200px)"
    }
}
```
### Mixin/Function support
For mixins and functions we've added a reserved 'mixins' group for it.

_input:_ _mixins.scss
``` scss
@mixin box($p1, $p2) {
  @content;
}
@function my-function($val) {
}
@mixin z($val: 10px, $p2: '#COFF33') {
  @content;
}
@mixin no-params() {
}
````
_output:_ [exported-mixins.json]

```javascript
{
  "mixins": [
    {
      "name": "box",
      "parameters": [ "$p1", "$p2" ]
    },
    {
      "name": "my-fucntion",
      "parameters": [ "$val" ]
    },
    {
      "name": "z",
      "parameters": [ "$val: 10px", "$p2: '#COFF33'" ]
    },
    {
      "name": "no-params",
      "parameters": []
    }
  ]
}
```


## Want to use it in your Node App?
Just import it!

Require syntax:
``` javascript
var exporter = require('sass-export').exporter;

var exporterBuffer = require('sass-export').buffer;
```

import syntax:

``` javascript
 import { exporter } from 'sass-export';
```


#### Example:

Written using ES5 syntax.
``` javascript

var exporter = require('sass-export').exporter;

//basic options
var options = {
  inputFiles: ['_variables.scss', '_fonts.scss'],
  includePaths: ['libs/'] // don't forget this is the folder path not the files
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
We recommend using [Node.js](https://nodejs.org/) v6+.


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


### New utilities
  * Gulp plugin: [gulp-sass-export]

### More to come soon:
  * Include/Exclude annotations.
  * Demo Page


License
----

ISC

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)

[node.js]: <http://nodejs.org>
[node-sass]: <https://github.com/sass/node-sass>
[gulp-sass-export]: <https://github.com/plentycode/gulp-sass-export>
[exported-sass-array.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/array.json>
[exported-grouped.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/annotations.json>
[exported-maps.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/maps-object.json>
[exported-mixins.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/mixins.json>
