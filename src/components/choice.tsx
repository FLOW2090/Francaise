import { Button, Col } from "antd";
import { useRouter } from "next/router";
import { PHONE_WIDTH } from "../utils/constants";
import { useEffect, useState } from "react";

interface ChoiceProps {
    type: string;
    francaise: string;
    chinese: string;
    path: string;
}

const Choice = (props: ChoiceProps) => {
    const router = useRouter();
    const [screenWidth, setScreenWidth] = useState<number>(0);

    let colProps = {};
    switch (props.type) {
        case ("bg"):
            colProps = {
                xs: 24,
                sm: 12,
            };
            break;
        case ("md"):
            colProps = {
                xs: 24,
                sm: 24,
                md: 12,
            };
            break;
    }

    const str2display = (str: string) => {
        if (screenWidth < PHONE_WIDTH) {
          return str;
        }
        else {
          switch (str) {
            case "V1":
                return "Verbes du 1er groupe (-er)";
            case "V2":
                return "Verbes du 2e groupe (-ir)";
            case "V3":
                return "Verbes du 3e groupe";
            case "VP":
                return "Verbes pronominaux";
            case "VMC":
                return "Verbes de mon choix";
            case "AV":
                return "Autres verbes";
            default:
                return str;
          }
        }
    };

    const updateScreenSize = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);
        return () => {
            window.removeEventListener("resize", updateScreenSize);
        };
    }, []);

    return (
        <Col {...colProps} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Button
                style={{ width: "90%", height: "64px", fontSize: "16px" }}
                onClick={()=>{router.push(router.pathname === "/" ? router.pathname + props.path : router.pathname + "/" + props.path);}}>
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <div>{str2display(props.francaise)}</div>
                        <div>{props.chinese}</div>
                    </div>
            </Button>
        </Col>
    );
};

export default Choice;