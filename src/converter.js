import fs from 'fs';
import sass from 'node-sass';

class Converter {
  constructor (filePath) {
    this.filePath_ = filePath;
    this.compile();
  }

  compile () {
   let rendered =  sass.renderSync({
      file: this.filePath_
    });

    console.log(rendered);
  }
}

 export default Converter;