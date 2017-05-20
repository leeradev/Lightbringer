const fse = require('fs-extra');
const path = require('path');

exports.migrate = (bot, base) => {
    migrateConfig(bot, base);
    migrateDB(bot, base);
};

const migrateConfig = (bot, base) => {
    const oldPath = path.resolve(base, 'config.json');
    const newPath = path.resolve(base, '../config.json');
    const newNewPath = path.resolve(base, '../data/configs/config.json');

    if (fse.existsSync(oldPath)) {
        try {
            fse.moveSync(oldPath, newPath);
        } catch (err) {
            console.error('Failed to migrate config.json!', err);
            process.exit(1);
        }
    }

    if (fse.existsSync(newPath)) {
        try {
            fse.moveSync(newPath, newNewPath);
        } catch (err) {
            console.error('Failed to migrade config.json to configs!', err);
            process.exit(1);
        }
    }
};

const migrateDB = (bot, base) => {
    const oldDataPath = path.resolve(base, '../data/tags');
    const newDataPath = path.resolve(base, '../data/db');
    if (fse.existsSync(oldDataPath)) {
        try {
            fse.renameSync(oldDataPath, newDataPath);
        } catch (err) {
            console.error('Failed to rename tags folder!');
            process.exit(1);
        }
    }
};
