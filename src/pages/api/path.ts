import { readdirSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

const getPath = (req: NextApiRequest, res: NextApiResponse) => {
    const data = JSON.parse(req.body);
    const { tense, type, word, prefix } = data;
    if (!word || !prefix) {
        res.status(400);
    }
    else {
        if (type === "vmc") {
            const tenseDir = join("src/data/audio", tense);
            const items = readdirSync(tenseDir, { withFileTypes: true });
            const types = items
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            types.forEach(type => {
                const typeDir = join(tenseDir, type);
                const items = readdirSync(typeDir, { withFileTypes: true });
                const words = items
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                words.forEach(checkingWord => {
                    if (checkingWord === word) {
                        const audioDir = join(typeDir, word);
                        const audioFile = readdirSync(audioDir).filter(file => file.startsWith(prefix))[0];
                        res.status(200).send(type + "$" + audioFile);
                    }
                });
            });
        }
        else {
            const audioDir = join("src/data/audio", tense, type, word);
            const audioFile = readdirSync(audioDir).filter(file => file.startsWith(prefix))[0];
            res.status(200).send(audioFile);
        }
    }
};

export default getPath;