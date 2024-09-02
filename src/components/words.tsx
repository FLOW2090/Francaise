import { Button, Checkbox, Col, Form, GetProp, Input, InputNumber, Progress, Radio, Row, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { PHONE_WIDTH } from "../utils/constants";

interface WordsProps {
    tense: string;
    type: string;
}

interface FormProps {
    showQuestion: boolean;
    answerTime: number;
    autoSkip: boolean;
}

const Words = (props: WordsProps) => {
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [audioPath, setAudioPath] = useState<string>("");
    const [word, setWord] = useState<string>("");
    const [pp, setPP] = useState<string>("");
    const [index, setIndex] = useState<number>(0);
    const [audioType, setAudioType] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [active, setActive] = useState<boolean>(false);
    const [clock, setClock] = useState<number>(0);
    const [answer, setAnswer] = useState<string>("");
    const [checking, setChecking] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [correct, setCorrect] = useState<boolean>(false);
    const [type, setType] = useState<string>("");
    const [maxWidth, setMaxWidth] = useState<string>("");

    const [form] = Form.useForm<FormProps>();
    const showQuestion = Form.useWatch("showQuestion", form);

    const audioRef = useRef<HTMLAudioElement>(null);

    const isCheckedAll = checkedList.length === options.length;
    const disabled = checkedList.length === 0;

    const onCheckAllChange = () => {
        setCheckedList(isCheckedAll ? [] : options);
    };

    const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (checkedValues) => {
        setCheckedList(checkedValues as string[]);
    };

    const getRandomWord = (props: WordsProps, list: string[]) => {
        fetch("/api/path", {
            method: "POST",
            body: JSON.stringify({ ...props, list, random: true })
        }).then(res => res.text()).then(data => {
            const newWord = data.match(/_([^()]*)\s/)![1];
            const newIndex = parseInt(data[props.type === "vmc" ? 4 : 1]);
            const newAudioType = "q";
            if (word === newWord && index === newIndex && audioType === newAudioType) {
                getRandomWord(props, list);
            }
            else {
                setPP(data.match(/\(([^)]+)\)/)![1]);
                setWord(newWord);
                setIndex(newIndex);
                setAudioType(newAudioType);
                setChecking(false);
                setActive(false);
                setClock(0);
                setInputValue("");
                if (props.type === "vmc") {
                    setType(data.match(/([^$]*)\$/)![1]);
                }
            }
        });
    };

    const onSubmit = () => {
        setSubmitted(true);
        getRandomWord(props, checkedList);
    };

    const checkBoxList = options.map((word: string, index: number) =>
        <Col key={index} style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }} xs={24} sm={10} md={6} xl={4}>
            <Checkbox value={word} style={{ fontSize: "24px" }}>{word}</Checkbox>
        </Col>
    );

    const checkAnswer = () => {
        fetch("/api/path", {
            method: "POST",
            body: JSON.stringify({ ...props, word, prefix: "a" + index.toString() })
        }).then(res => res.text()).then(data => {
            setAnswer(data.match(/_([^.]+)\./)![1]);
            setChecking(true);
        });
    };

    const handleQuestionEnded = () => {
        setActive(true);
    };

    const handleProgressEnded = () => {
        setClock(0);
        setActive(false);
        checkAnswer();
    };

    const handleAnswerEnded = () => {
        let timeout: NodeJS.Timeout | null = null;
        if (answer.toLowerCase() === inputValue.toLowerCase() || form.getFieldValue("autoSkip")) {
            timeout = setTimeout(() => {
                getRandomWord(props, checkedList);
            }, 2000);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    };

    const handleScreen = () => {
        if (window.innerWidth < PHONE_WIDTH) {
            setMaxWidth("160px");
        }
        else {
            setMaxWidth("320px");
        }
    };

    useEffect(() => {
        handleScreen();
        window.addEventListener("resize", handleScreen);
    return () => {
      window.removeEventListener("resize", handleScreen);
    };
    }, []);

    useEffect(() => {
        fetch("/api/options", {
            method: "POST",
            body: JSON.stringify(props)
        }).then(res => res.json()).then(data => {
            setOptions(JSON.parse(data));
        });
    }, [props]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audioRef.current) {
            if (audioType === "q") {
                audioRef.current.addEventListener("ended", handleQuestionEnded);
            }
            else if (audioType === "a") {
                audioRef.current.addEventListener("ended", handleAnswerEnded);
            }
        }
        return () => {
            if (audio) {
                if (audioType === "q") {
                    audio.removeEventListener("ended", handleQuestionEnded);
                }
                else if (audioType === "a") {
                    audio.removeEventListener("ended", handleAnswerEnded);
                }
            }
        };
    }, [audioPath, audioType]);

    useEffect(() => {
        if (word === "" || index === 0 || audioType === "") return;
        let body: any = null;
        if (props.type === "vmc") {
            body = {
                tense: props.tense,
                type,
                word,
                prefix: audioType + index
            };
        }
        else {
            body = { ...props, word, prefix: audioType + index };
        }
        fetch("/api/audio", {
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => {
            res.blob().then(blob => {
                setAudioPath(URL.createObjectURL(blob));
            });
        });
    }, [props, word, index, audioType]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (active) {
            timeout = setTimeout(() => {
                if (clock < 1000 * form.getFieldValue("answerTime")) {
                    setClock(clock => clock + 500);
                }
                else {
                    handleProgressEnded();
                }
            }, 500);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [active, clock, form]);

    useEffect(() => {
        if (!checking) return;
        setCorrect(answer.toLowerCase() === inputValue.toLowerCase());
        setAudioType("a");
    }, [checking, answer, inputValue, form, props, checkedList]);

    return (
        <>
        {!submitted ? (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", flexDirection: "column", width: "100%" }}>
                <Button style={{ marginBottom: "16px", fontSize: "20px", height: "40px", maxWidth: "160px" }}
                    onClick={onCheckAllChange}>
                    全选/全不选
                </Button>
                <Checkbox.Group value={checkedList} onChange={onChange} style={{ width: "100%"}}>
                    <Row style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                        {checkBoxList}
                    </Row>
                </Checkbox.Group>
                <Button style={{ marginBottom: "16px", fontSize: "20px", height: "40px", maxWidth: "160px" }}
                    onClick={onSubmit}
                    type="primary"
                    disabled={disabled}>
                    确定
                </Button>
            </div>
        ) : (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", flexDirection: "column", width: "100%" }}>
                <h2 style={{margin: "8px"}}>请根据听到的动词和主语，写出对应的变位：{ showQuestion ? word + " (" + pp + ")" : "" }</h2>
                <div style={{ height: "48px", width: "320px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    { checking ? (
                        <h3 style={{margin: "8px", color: correct ? "green" : "red"}}>回答{ correct ? "正确" : "错误" }：{ answer }</h3>
                    ) : (<>
                        { active ? (
                            <Progress percent={ clock / 10 / form.getFieldValue("answerTime")} showInfo={false} style={{ maxWidth }}/>
                        ) : (
                            <h3 style={{margin: "8px"}}>请听题：</h3>
                        )}
                        </>
                    )}
                </div>
                <audio src={audioPath} ref={audioRef} autoPlay/>
                <Space.Compact size="large" style={{ margin: "8px" }}>
                    <Input value={inputValue} placeholder="Votre réponse" onChange={(e) => {setInputValue(e.target.value);}}/>
                    <Button type="primary" onClick={checkAnswer}>Vérifier</Button>
                </Space.Compact>
                <Button onClick={() => getRandomWord(props, checkedList)}>下一题</Button>
                <Form form={form} layout="horizontal" autoComplete="off" initialValues={{ showQuestion: false, answerTime: 5, autoSkip: true}}>
                    <Form.Item name="showQuestion" label="原文" style={{ margin: "8px" }}>
                        <Radio.Group style={{ display: "flex", justifyContent: "center" }}>
                            <Radio value={true}>显示</Radio>
                            <Radio value={false}>隐藏</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="answerTime" label="作答时间" style={{ margin: "8px" }}>
                        <InputNumber changeOnWheel keyboard min={3} max={30} addonAfter={"s"} style={{ maxWidth: "128px", display: "flex", margin: "auto" }}/>
                    </Form.Item>
                    <Form.Item name="autoSkip" label="自动跳题" style={{ margin: "8px" }}>
                        <Radio.Group style={{ display: "flex", justifyContent: "center" }}>
                            <Radio value={true}>开启</Radio>
                            <Radio value={false}>关闭</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </div>
        )}
        </>
    );
};

export default Words;