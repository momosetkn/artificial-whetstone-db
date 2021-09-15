import {Button, Card, Classes, Overlay, TextArea} from "@blueprintjs/core";
import React, {useState} from "react";
import {useAbsoluteCenter} from "../hooks/useAbsoluteCenter";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const ReportOverlay = ({isOpen, onClose, onSubmit}: Props) => {
  const [value, setValue] = useState('');
  const [cardRef, cardStyle] = useAbsoluteCenter<HTMLDivElement>();
  const handleClickSendButton = () => {
    onClose();
    onSubmit(value);
    setValue('');
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose
      enforceFocus
      hasBackdrop
      usePortal
      className={Classes.OVERLAY_SCROLL_CONTAINER}
    >
      <StyledCardContainer ref={cardRef} style={{...cardStyle}}>
        <Card>
          <h3>バグ報告・追加要望</h3>
          <TextArea fill={true} rows={8} onChange={(e) => setValue(e.target.value)} value={value}/>
          <StyledActionContainer>
            <Button className={Classes.MINIMAL} icon="send-message" onClick={handleClickSendButton}>送信</Button>
          </StyledActionContainer>
        </Card>
      </StyledCardContainer>
    </Overlay>
  )
}

const StyledCardContainer = styled.div`
  width: 80%;
`;

const StyledActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
