import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Drawer, Form, Upload, notification } from "antd";

const DrawerComponent = forwardRef(({ title, children, trigger }, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  // Expose closeDrawer method to parent
  useImperativeHandle(ref, () => ({
    closeDrawer,
  }));

  return (
    <>
      <div onClick={showDrawer}>{trigger}</div>
      <Drawer title={title} placement="right" onClose={closeDrawer} open={open}>
        {children}
      </Drawer>
    </>
  );
});

export default DrawerComponent;