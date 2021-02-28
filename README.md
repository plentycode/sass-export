# Sass-Export

**Sass-export** takes SCSS files and export them to a JSON file you can use as data.
This is perfect for generating your site documentation.

[![Build Status](https://travis-ci.org/plentycode/sass-export.svg?branch=master&style=flat)](https://travis-ci.org/plentycode/sass-export)
![Total Downloads](https://img.shields.io/npm/dt/sass-export?style=flat-square)
![Follow @plenty_code](https://img.shields.io/twitter/follow/plenty_code.svg?style=flat-square&color=1da1f2)
[![Donate via Patreon](https://img.shields.io/badge/donate-patreon-orange.svg?style=flat-square&logo=patreon)](https://www.patreon.com/plentycode)

## Try it online: [Playground (demo)](https://sass-export.plentycode.com/)

## CLI

Install it from NPM

``` bash
 npm install -g sass-export
```

Ready to export:

``` bash
 sass-export scss/config/*.scss -o exported-sass-array.json -a
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
  { "name": "$gray-medium", "value": "#757575", "compiledValue": "#757575" },
  { "name": "$base-value", "value": "25px", "compiledValue": "25px" },
  { "name": "$gray-dark", "value": "darken($gray-medium, 5%)", "compiledValue" :"#686868" },
  { "name": "$logo", "value": "url(logo.svg)", "compiledValue": "url(logo.svg)" },
  { "name": "$logo-quotes", "value": "url('logo.svg')", "compiledValue": "url(\"logo.svg\")" },
  { "name": "$calculation", "value": "$base-value - 12px", "compiledValue": "13px" },
  { "name": "$multiple-calculations", "value": "$base-value - floor(12.5px)", "compiledValue": "13px" }
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

Then we run sass-export:

``` bash
 sass-export scss/_annotations.scss -o exported-grouped.json
```


_output_ [exported-grouped.json]

``` javascript
{
    "variables": [
        { "name": "$black", "value": "#000", "compiledValue": "#000" },
        { "name": "$slate", "value": "#8ca5af", "compiledValue": "#8ca5af" },
        { "name": "$global-group", "value": "#ff0000", "compiledValue": "#ff0000" }
    ],
    "brand-colors": [
        { "name": "$brand-gray-light", "value": "#eceff1", "compiledValue":"#eceff1" },
        { "name": "$brand-gray-medium", "value": "#d6d6d6" ,"compiledValue":"#d6d6d6" },
        { "name": "$brand-gray", "value": "#b0bec5", "compiledValue": "#b0bec5" }
    ],
    "fonts": [
        { "name": "$font-size", "value": "16px", "compiledValue": "16px" },
        { "name": "$font-color", "value": "$brand-gray-medium", "compiledValue":"#d6d6d6" }
    ]
}
```

### Include Paths for @import

In order to support @import we need to include **--dependencies** parameter with a comma separated list of the folder path to include:

``` bash
sass-export scss/_fonts.scss -o=exported-dependencies.json  -d "src/sass/config/, src/sass/libs/"
```

in order to use:

``` scss
@import "breakpoints";
@import "variables";

$imported-value: $bp-desktop;
$font-size: $global-font-size;
```

### Map support

In case you wanted your sass Maps variable to be an array we included te **mapValue** property for variables identified as maps.

_input:_ _breakpoints.scss

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
  "variables": [
    {
      "name": "$breakpoints",
      "value": "(small: 767px,  medium: 992px,  large: 1200px)",
      "mapValue": [
        { "name": "small", "value": "767px", "compiledValue": "767px" },
        { "name": "medium","value": "992px", "compiledValue": "992px" },
        { "name": "large", "value": "1200px", "compiledValue": "1200px" }
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


## Import it in your Node App?

import syntax:

``` javascript
 import { exporter } from 'sass-export';
```

Require syntax:

``` javascript
const exporter = require('sass-export').exporter;

const exporterBuffer = require('sass-export').buffer;
```

### Example

Written using ES5 syntax.

``` javascript

const exporter = require('sass-export').exporter;

//basic options
const options = {
  inputFiles: ['_variables.scss', '_fonts.scss'],
  includePaths: ['libs/'] // don't forget this is the folder path not the files
};

// you can get an object {variables:[], colors: []}
const asObject = exporter(options).getStructured();

console.log(asObject.variables);
console.log(asObject.colors);

// or get an array [{}, {}]
const asArray = exporter(options).getArray();

console.log(asArray)
```

### Usage

Usage: sass-export [inputFiles] [options]

| Options | Type | Description |
| ------                | ----        | ------ |
|  -o, --output         |  String     |    File path where to save the JSON exported. |
|  -a, --array          |  Boolean    |   If it is present, it will output an array file instead of a object structured. |
|  -d, --dependencies   |  String[]   |   List of dependencies separated by comma, where Sass will try to find the @imports that your inputFiles need to work. Example: "libs/, config/, variables/". |
|  -h, --help           |   Boolean   |  Shows up this help screen. |


### Other utilities based on this tool

- Gulp plugin: [gulp-sass-export]


### Contributing

Please feel free to submit pull requests or open issues to improve this tool.
Also keep checking [issues][issues] section and grab some items to help!

Check our [Contributing][contributing] page for more information.

License

----

MIT

## Supporting

This is an open source project and completely free to use.

However, the amount of effort needed to maintain and develop new features and products within the Plentycode ecosystem is not sustainable without proper financial backing. If you have the capability, please consider donating using the link below:

<div align="center">
[![Donate via Patreon](https://img.shields.io/badge/donate-patreon-orange.svg?style=flat-square&logo=patreon)](https://www.patreon.com/plentycode)
</div>

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)

[node.js]: <http://nodejs.org>
[node-sass]: <https://github.com/sass/node-sass>
[gulp-sass-export]: <https://github.com/plentycode/gulp-sass-export>
[exported-sass-array.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/array.json>
[exported-grouped.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/annotations.json>
[exported-maps.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/maps-object.json>
[exported-mixins.json]: <https://raw.githubusercontent.com/plentycode/sass-export/develop/exported-examples/mixins.json>
[issues]: https://github.com/plentycode/sass-export/issues
[contributing]: https://github.com/plentycode/sass-export/blob/master/CONTRIBUTING.md
