import Head from "next/head";
import type { AppProps } from "next/app";
import BC from "../components/breadcrumb";
import { Card } from "antd";
import { useState, useEffect } from "react";
import { PHONE_WIDTH } from "../utils/constants";

// eslint-disable-next-line @typescript-eslint/naming-convention
const App = ({ Component, pageProps }: AppProps) => {
    const [titleSize, setTitleSize] = useState<string>("");

    const handleScreen = () => {
        if (window.innerWidth < PHONE_WIDTH) {
            setTitleSize("24px");
        }
        else {
            setTitleSize("28px");
        }
    };

    useEffect(() => {
        handleScreen();
        window.addEventListener("resize", handleScreen);
    return () => {
      window.removeEventListener("resize", handleScreen);
    };
    }, []);

    return (
        <>
            <Head>
                <title>Défis de conjugaison</title>
                <meta name="description" content="Défis de conjugaison exercises developed by LCTU."/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="apple-touch-icon" href="/favicon.gif" />
                <link rel="icon" href="/favicon.gif" />
            </Head>
            <div style={{ display: "flex", justifyContent: "center", margin: "32px" }}>
                <Card
                    type="inner"
                    style={{ maxWidth: "1200px", width: "100%" }}
                    title={<div style={{ textAlign: "center", fontSize: titleSize }}>Défis de conjugaison</div>}>
                    <BC />
                    <Component {...pageProps} />
                </Card>
            </div>
        </>
    );
};

export default App;