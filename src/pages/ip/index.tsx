import { Card, Row } from "antd";
import React from "react";
import Choice from "../../components/choice";

const IP = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
            <Card
                type="inner"
                style={{ maxWidth: "1000px", width: "100%" }}
                title={<div style={{ textAlign: "center", fontSize: "20px" }}>Mes verbes</div>}>
                <Row style={{ marginTop: "32px" }}>
                    <Choice type="md" francaise="V1" chinese="第一组规则动词" path="v1"/>
                    <Choice type="md" francaise="V2" chinese="第二组规则动词" path="v2"/>
                    <Choice type="md" francaise="V3" chinese="第三组不规则动词" path="v3"/>
                    <Choice type="md" francaise="VP" chinese="代词式动词" path="vp"/>
                    <Choice type="md" francaise="VMC" chinese="自选动词" path="vmc"/>
                </Row>
            </Card>
        </div>
    );
};

export default IP;