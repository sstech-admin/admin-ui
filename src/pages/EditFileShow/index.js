/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import usecustomStyles from "../../Common/Hooks/customStyles";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Flex, Modal, Typography } from "antd";
import { FilePdfFilled } from "@ant-design/icons";
import { File, FileText, Image, Trash2Icon } from "lucide-react";
import {
  DivContainer,
  ImageContainer,
  PdfFileContainer,
  PDFIconConatiner,
} from "./EditInvestorsFile.styles";
import { getInvestorFileURL } from "../../slices/generalSetting/generalSettingAPI";

const EditFileShow = ({
  link,
  setAllGetFileDocumnet,
  fileName,
  fileObjectKey,
}) => {
  // const fileObjectKeyValue = fileObjectKey;
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const [image, setImage] = useState(null);
  const [uint8Arr, setUint8Arr] = useState();
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  console.log("....link....", link[23] === "2");
  const fetchData = async (link) => {

    try {
      setLoading(true);
      if (link[23] === "1") {
        const responseImage = await axios.get(`${link}`, {
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
  //   effectFunction();
  // }, [link]);

  const handleCancel = () => setPreviewVisible(false);

  return (
    <>
      <DivContainer>
        {link[23] === "2" ? (
          <PdfFileContainer
            onClick={async () => {
              if (!clicked) {
                setClicked(true);
                // setPreviewVisible(true);
                await fetchData(link);
              }
            }}
          >
            <PDFIconConatiner>
              <FileText />
            </PDFIconConatiner>
            {fileName}
          </PdfFileContainer>
        ) : (
          <PdfFileContainer
            onClick={async () => {
              if (!clicked) {
                setPreviewVisible(true);
                setClicked(true);
                await fetchData(link);
              }
            }}
          >
            <PDFIconConatiner>
              {
                !link ?
                  <Image />
                  :
                  <img src={link} style={{ width: '35px', height: '35px', borderRadius: 7, overflow: 'hidden' }} />
              }
            </PDFIconConatiner>
            {fileName}
          </PdfFileContainer>
        )}
        <Button
          onClick={() => {
            setAllGetFileDocumnet((pre) => ({
              ...pre,
              [fileObjectKey]: null,
            }));
          }}
          style={{
            border: "none",
            textAlign: "center",
          }}
          textAlign="center"
        >
          <Trash2Icon color="red" />
        </Button>
      </DivContainer>

      <Modal
        className="custom-file-show-wrapper"
        visible={previewVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {link[23] === "1" && (
          <img alt="Preview" style={{ width: "100%" }} src={image} />
        )}
        {link[23] === "2" && uint8Arr ? (
          <Document
            file={{
              data: uint8Arr,
            }}
            onLoadSuccess={() => { }}
          >
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default EditFileShow;
