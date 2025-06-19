/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import usecustomStyles from "../../Common/Hooks/customStyles";
import axios from "axios";
import { Modal } from "antd";
import { FileText, Image } from "lucide-react";
import { getInvestorFileURL } from "../../slices/generalSetting/generalSettingAPI";

const FileShow = ({ link }) => {
  console.log("link: ", link);
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const [image, setImage] = useState(null);
  console.log("image: ", image);
  // const [uint8Arr, setUint8Arr] = useState();
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  const fetchData = async (link) => {
    try {
      setLoading(true);
      if (link[23] === "1") {
        console.log("indside image file");
        const responseImage = await axios.get(`/viewInvestorFile/${link}`, {
          responseType: "arraybuffer", // Ensure response is treated as ArrayBuffer
        });
        const blob = new Blob([responseImage]);
        const url = URL.createObjectURL(blob);
        setImage(url);
      }
      if (link[23] === "2") {
        const responsePdf = await getInvestorFileURL({
          fileId: link,
        });
        console.log("responsePdf: ", responsePdf);
        if (responsePdf.status === "success") {
          // window.location.href = responsePdf.data;

          const a = document.createElement("a");
          a.href = responsePdf.data;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
      setClicked(false);
    }
  };

  // const effectFunction = async () => {
  //   await fetchData();
  // };
  // useEffect(() => {
  //   console.log("first time call");
  //   effectFunction();
  // }, [link]);

  const handleCancel = () => setPreviewVisible(false);
  console.log("link[23]: ", typeof link[23]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 60,
          borderWidth: "1px",
          borderColor: "#40e495",
        }}
      >
        {link[23] === "1" && (
          <Image
            height={50}
            width={50}
            onClick={async () => {
              if (!clicked) {
                setClicked(true);
                setPreviewVisible(true);
                await fetchData(link);
              }
            }}
          />
        )}
        {link[23] === "2" && (
          <FileText
            height={50}
            width={50}
            onClick={async () => {
              if (!clicked) {
                setClicked(true);
                // setPreviewVisible(true);
                await fetchData(link);
              }
            }}
          />
        )}
      </div>

      <Modal
        className="custom-file-show-wrapper"
        visible={previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        {link[23] === "1" && (
          <img alt="Preview" style={{ width: "100%" }} src={image} />
        )}
        {/* {link[23] === "2" && uint8Arr ? (
          <Document
            file={{
              data: uint8Arr,
            }}
            onLoadSuccess={() => {}}
          >
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          ""
        )} */}
      </Modal>
    </>
  );
};

export default FileShow;
