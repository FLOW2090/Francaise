import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

const getOptions = async (req:NextApiRequest, res: NextApiResponse) => {
    const data = JSON.parse(req.body);
    const { tense, type } = data;
    const wordList = JSON.parse(readFileSync("src/data/word_list.json").toString());
    const tenseWords = (wordList as any)[tense];
    if (type === "vmc") {
        res.status(200).json(JSON.stringify(Object.values(tenseWords).flat()));
    }
    else {
        res.status(200).json(JSON.stringify(tenseWords[type]));
    }
};

export default getOptions;