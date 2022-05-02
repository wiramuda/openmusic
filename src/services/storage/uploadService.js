const fs = require('fs');

class UploadService {
    #folder
    constructor(folder) {
        this.#folder = folder;
        if(!fs.existSync(folder)){
            fs.mkdirSync(folder, {recursive: true})
        }
    }

    writeFile(file, meta) {
        const filename = +new Date()+meta.filename;
        const path = `${this.#folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);
        return new Promise((resolve, reject) => {
            fileStream.on('error',(err) => {
                console.log(err);
                reject(err);
            });
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        })
    }
}

module.exports = UploadService;