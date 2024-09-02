import { Card, Row } from "antd";
import React from "react";
import Choice from "../../components/choice";

const IMP = () => {

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
            <Card
                type="inner"
                style={{ maxWidth: "1000px", width: "100%" }}
                title={<div style={{ textAlign: "center", fontSize: "20px" }}>Mes verbes</div>}>
                <Row style={{ marginTop: "32px" }}>
                    <Choice type="md" francaise="V1" chinese="第一组规则动词" path="v1"/>
                    <Choice type="md" francaise="VP" chinese="代词式动词" path="vp"/>
                    <Choice type="md" francaise="AV" chinese="其他动词" path="av"/>
                    <Choice type="md" francaise="VMC" chinese="自选动词" path="vmc"/>
                </Row>
            </Card>
        </div>
    );
};

export default IMP;