import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import usecustomStyles from "../Common/Hooks/customStyles";
import Loader from "../Component/Loader/Loader";

const BlankRoutes = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      //FIXME: this comment Remove When API Working
      // await dispatch(getAllInvestorTypeAction()).unwrap();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const customStyles = usecustomStyles();
  return (
    <>
      {loading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <Typography.Title
          level={5}
          style={{ margin: `${customStyles.margin}px 0px` }}
        >
          Page Title
        </Typography.Title>
      )}
    </>
  );
};

export default BlankRoutes;
