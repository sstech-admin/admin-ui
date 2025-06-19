import { Col, Flex } from "antd";
import styled from "styled-components";

export const ColBTN = styled(Col)`
  display: flex;
  justify-content: end;
  @media (max-width: 768px) {
    justify-content: start;
  }
`;

export const FlexBTN = styled(Flex)`
  display: flex;
  justify-content: end;
  @media (max-width: 768px) {
    justify-content: start;
  }
`;
