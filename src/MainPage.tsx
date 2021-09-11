import React, {useState} from 'react';
import {InputGroup, NumberRange, RangeSlider} from "@blueprintjs/core";
import styled from "styled-components";

type State = {
  freeWord: string;
  gridRange: NumberRange;
};

const grids = ["#0", "#100", "#200", "#300", "#400", "#500", "#600", "#800", "#1,000", "#3,000", "#6,#000", "#8,000", "もっと！"];

const initialState: State = {
  freeWord: '',
  gridRange: [0, grids.length - 1],
};

export const MainPage = () => {
  const [state, update] = useState<State>(initialState);

  return (
    <Main>
      <StyledControls>
        <InputGroup
          asyncControl={true}
          leftIcon="filter"
          onChange={(e) => update(prev => ({...prev, freeWord: e.target.value}))}
          placeholder="フリーワード"
          value={state.freeWord}
        />
        <RangeSlider
          min={0}
          max={grids.length - 1}
          stepSize={1}
          labelRenderer={(value, opts) => grids[value]}
          onChange={(e) => update(prev => ({...prev, gridRange: e}))}
          value={state.gridRange}
        />
      </StyledControls>
    </Main>
  );
};

const Main = styled.div`
  padding: 24px;
`;

const StyledControls = styled.div`
  display: flex;
  width: 100%;
  
  & > * + * {
    margin-left: 24px;
  }
`;