const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const expand = require('expand-placeholder');
const changeCase = require('change-case');
const glob = require('glob');

if (argv.component) {
    const src = path.resolve(__dirname, './templates/component');
    const dest = path.resolve(__dirname, '../packages/components');

    const componentName = changeCase.pascalCase(argv.component);
    const componentCallName = changeCase.paramCase(argv.component);

    let placeholders = {
        componentName: componentName,
        componentFileName: componentName,
        componentCssName: componentCallName,
        componentPackageName: componentCallName,
        componentCallName: componentCallName
    };

    glob(path.join(src, '**', '*.*'), (er, files) => {
        for (file of files) {
            const cnt = expand(fs.readFileSync(file, 'utf8'), placeholders);

            const filename = path.relative(src, file).replace('componentFileName', placeholders.componentFileName);

            fs.outputFile(path.join(dest, placeholders.componentFileName, filename), cnt)
                .then(() => {
                    console.log(`${filename} created`)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    });
}



