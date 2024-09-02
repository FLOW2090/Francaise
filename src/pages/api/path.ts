import { readdirSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // 包含min，不包含max
};

const getPath = (req: NextApiRequest, res: NextApiResponse) => {
    const data = JSON.parse(req.body);
    const { tense, type, list, random, word, prefix } = data;
    if (random) {
        const arrLen = tense === "ip" ? 6 : tense === "imp" ? 3 : 0;
        const randInt = getRandomInt(1, arrLen + 1);
        const randWord = list[getRandomInt(0, list.length)];
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
                    if (checkingWord === randWord) {
                        const audioDir = join(typeDir, randWord);
                        const audioFile = readdirSync(audioDir).filter(file => file.startsWith("q" + randInt))[0];
                        res.status(200).send(type + "$" + audioFile);
                    }
                });
            });
        }
        else {
            const audioDir = join("src/data/audio", tense, type, randWord);
            const audioFile = readdirSync(audioDir).filter(file => file.startsWith("q" + randInt))[0];
            res.status(200).send(audioFile);
        }
    }
    else {
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
                            res.status(200).send(audioFile);
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
    }
};

export default getPath;