import { createReadStream, readdirSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

const getAudio = (req: NextApiRequest, res: NextApiResponse) => {
    const data = JSON.parse(req.body);
    const { tense, type, word, prefix } = data;
    const audioDir = join("src/data/audio", tense, type, word);
    const audioFile = readdirSync(audioDir).filter(file => file.startsWith(prefix))[0];
    res.status(200);
    res.setHeader("Content-Type", "audio/mpeg");
    const readStream = createReadStream(join(audioDir, audioFile));
    readStream.pipe(res);
};

export default getAudio;