# Sass-Export
Sass-export is a work in progress project to use Sass files to generate different fortmats you can use in your application as data.
This is perfect for working on sites doc generation.

### Let's get started!

Sass-Export requires [Node.js](https://nodejs.org/) v4+ to run.

#### CLI
Install it from NPM

```
$ npm install -g sass-export
```

Ready to export

```
$ sass-export path/to/_globals.scss  path/to/_colors.scs --output exported-sass.json
```

### Here some sample output

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
  { "variable": "$logo-quotes", "value": "url('logo.svg')", "compiledValue": "url(\"sample.svg\")" },
  { "variable": "$calculation", "value": "$base-value - 12px", "compiledValue": "13px" },
  { "variable": "$multiple-calculations", "value": "$base-value - floor(12.5px)", "compiledValue": "13px" }
]
```


### Tech Dependencies

Sass-Export has dependencies on these projects:

* [node.js] - evented I/O for the backend
* [Node-Sass] - library that provides binding for Node.js to LibSass, the C version of the popular stylesheet preprocessor, Sass.

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Usage

Usage: sass-export [<inputFiles>] [options]

| Options | Description |
| ------        | ------ |
| --output, -o  |  <path>, Output file path. |
| --help, -h    |   Outputs this help screen. |

License
----

ISC


**It's for free!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [node.js]: <http://nodejs.org>
   [node-sass]: <https://github.com/sass/node-sass>
