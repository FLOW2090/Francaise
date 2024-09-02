import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PAD_WIDTH, PHONE_WIDTH, PUBLI_URL } from "../utils/constants";
import { HomeOutlined } from "@ant-design/icons";

const BC = () => {
  const router = useRouter();
  const [crumbs, setCrumbs] = useState<any[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const str2display = (str: string) => {
    if (screenWidth < PHONE_WIDTH) {
      switch (str) {
        case "":
          return <HomeOutlined />;
        case "ip":
          return "IP";
        case "imp":
          return "IMP";
        case "v1":
          return "V1";
        case "v2":
          return "V2";
        case "v3":
          return "V3";
        case "vp":
          return "VP";
        case "vmc":
          return "VMC";
        case "av":
          return "AV";
      }
    }
    else if (screenWidth < PAD_WIDTH) {
      switch (str) {
        case "":
          return <HomeOutlined />;
        case "ip":
          return "Indicatif Présent";
        case "imp":
          return "Impératif Présent";
        case "v1":
          return "Verbes du 1er groupe (-er)";
        case "v2":
          return "Verbes du 2e groupe (-ir)";
        case "v3":
          return "Verbes du 3e groupe";
        case "vp":
          return "Verbes pronominaux";
        case "vmc":
          return "Verbes de mon choix";
        case "av":
          return "Autres verbes";
      }
    }
    else {
      switch (str) {
        case "":
          return <HomeOutlined />;
        case "ip":
          return "直陈式现在时 Indicatif Présent";
        case "imp":
          return "命令式现在时 Impératif Présent";
        case "v1":
          return "第一组规则动词 Verbes du 1er groupe (-er)";
        case "v2":
          return "第二组规则动词 Verbes du 2e groupe (-ir)";
        case "v3":
          return "第三组不规则动词 Verbes du 3e groupe";
        case "vp":
          return "代词式动词 Verbes pronominaux";
        case "vmc":
          return "自选动词 Verbes de mon choix";
        case "av":
          return "其他动词 Autres verbes";
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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const pathName = router.pathname;
    const pathArray = pathName.split("/").filter(Boolean);
    const crumbArray = pathArray.map((path, index) => {
      const url = `/${pathArray.slice(0, index + 1).join("/")}`;
      const onclick = () => {
        router.push(url);
      };
      return {
        title: str2display(path),
        onClick: onclick,
      };
    });
    crumbArray.unshift({
      title: str2display(""),
      onClick: () => {
        router.push("/");
      }
    });
    setCrumbs(crumbArray);
  }, [router, screenWidth]);

  return <Breadcrumb items={ crumbs }/>;
};

export default BC;