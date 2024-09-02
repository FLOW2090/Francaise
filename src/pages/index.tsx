import { Row } from "antd";
import Choice from "../components/choice";

const HomePage = () => {

    return (
        <>
            <Row style={{ margin: "32px" }}>
                <Choice type="bg" francaise="Indicatif Présent" chinese="直陈式现在时" path="ip"/>
                <Choice type="bg" francaise="Impératif Présent" chinese="命令式现在时 " path="imp"/>
            </Row>
        </>
    );
};

export default HomePage;