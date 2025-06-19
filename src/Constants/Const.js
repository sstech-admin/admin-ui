export const AadharCardRegExp = /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/;
export const PanCardRegExp = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
export const IFSCRegExp = /^[A-Z]{4}[0-9]{1}[A-Z0-9]{6}$/;
export const onlyNumberRegExp = /^[0-9]{11}/;
export const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 24,
    },
  },
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 0,
    },
    md: {
      span: 10,
      offset: 0,
      gutter: [16, 12],
    },
    lg: {
      span: 6,
      offset: 0,
      gutter: [16, 12],
    },
  },
};
