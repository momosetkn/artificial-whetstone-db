import React, {useState} from "react";
import {Button, Card, Classes, Overlay, Switch} from "@blueprintjs/core";
import {useAbsoluteCenter} from "../hooks/useAbsoluteCenter";
import styled from "styled-components";
import {columns} from "../MainPage";
import {Tooltip2} from "@blueprintjs/popover2";

type Props = {
  isOpen: boolean;
  columnValues: string[];
  onClose: () => void;
  onChange: (value: string[]) => void;
}

export const SettingsOverlay = ({isOpen, columnValues, onClose, onChange}: Props) => {
  const [editingColumnValues, setEditingColumnValues] = useState(columnValues);
  const [cardRef, cardStyle] = useAbsoluteCenter<HTMLDivElement>();
  const handleClose = () => {
    onChange(editingColumnValues);
    onClose();
  };
  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
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
          <StyledHeader>
            <h3>表示列</h3>
            <Tooltip2 content="閉じる">
              <Button className={Classes.MINIMAL} icon="cross" onClick={handleClose}/>
            </Tooltip2>
          </StyledHeader>
          {columns.map(column => (
            <Switch
              key={column.value}
              label={column.label}
              checked={editingColumnValues.includes(column.value)}
              onClick={() => setEditingColumnValues(prev =>
                prev.includes(column.value) ? prev.filter(x => x !== column.value) : [...prev, column.value]
              )}
            />
          ))}
        </Card>
      </StyledCardContainer>
    </Overlay>
  )
};

const StyledCardContainer = styled.div`
  width: 30%;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
