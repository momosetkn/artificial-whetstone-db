import React, {useMemo, useState} from 'react';
import {HTMLTable, InputGroup, NumberRange, RangeSlider} from "@blueprintjs/core";
import styled from "styled-components";
import {Product, products} from "./data/products";
import {companies, Company} from "./data/companies";
import {Tooltip2} from "@blueprintjs/popover2";

type State = {
  freeWord: string;
  gridRange: NumberRange;
};

const grids = [
  {label: "#0", value: 0},
  {label: "#100", value: 100},
  {label: "#200", value: 200},
  {label: "#300", value: 300},
  {label: "#400", value: 400},
  {label: "#500", value: 500},
  {label: "#600", value: 600},
  {label: "#800", value: 800},
  {label: "#1,000", value: 1_000},
  {label: "#3,000", value: 2_000},
  {label: "#3,000", value: 3_000},
  {label: "#6,000", value: 6_000},
  {label: "#8,000", value: 8_000},
  {label: "もっと！", value: Number.MAX_VALUE},
] as const;

const gridLabels: string[] = grids.map(x => x.label);
const gridValues: number[] = grids.map(x => x.value);

const initialState: State = {
  freeWord: '',
  gridRange: [0, grids.length - 1],
};

const companiesMap: Record<string, Company> = companies.reduce((acc, cur) => ({
  ...acc,
  [cur.name]: cur
}), {});

export const MainPage = () => {
  const [state, update] = useState<State>(initialState);

  const selectedGridRangesValues: [number, number] = useMemo(() => [gridValues[state.gridRange[0]], gridValues[state.gridRange[1]]], [state.gridRange]);
  const filteredProducts = useMemo(() => products.filter(product => {
    const isTargetGird = (value: Product["grid"]) => {
      // TODO: 番手情報が無いものは、とりあえず無条件に出しておく
      if (!value) return true;
      if (typeof value === "number" && selectedGridRangesValues[0] <= value && value <= selectedGridRangesValues[1]) return true;
      if (typeof value === "string") {
        const matchGroups = value.match(/(\d+)/g);
        for (const m in matchGroups) {
          const n = Number(m);
          if (selectedGridRangesValues[0] <= n && n <= selectedGridRangesValues[1]) return true;
        }
      }
    }
    return (!state.freeWord || product.freeWords.search(state.freeWord) !== -1)
      && isTargetGird(product.grid);
  }), [state, selectedGridRangesValues])

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
          labelRenderer={(value, opts) => gridLabels[value]}
          onChange={(e) => update(prev => ({...prev, gridRange: e}))}
          value={state.gridRange}
        />
      </StyledControls>
      <DataTables items={filteredProducts} />
    </Main>
  );
};

const DataTables = ({items}: { items: Product[] }) => {
  return (
    <StyledTableContainer>
      <StyledHTMLTable striped>
        <thead>
        <StyledStickyTr>
          <th>会社名</th>
          <th>品番</th>
          <th>商品名</th>
          <th>粒度</th>
          <th>製法</th>
          <th>砥粒</th>
          <th>サイズ</th>
          <th>容積</th>
          <th>金額</th>
          <th>URL</th>
          <th>備考</th>
        </StyledStickyTr>
        </thead>
        <tbody>
          {items.map(item => <Row key={item.id}  item={item}/>)}
        </tbody>
        <tfoot>
        <tr>
          <td>Total</td>
          <td>{items.length}</td>
        </tr>
        </tfoot>
      </StyledHTMLTable>
    </StyledTableContainer>
  )
};

const Row = ({item}: { item: Product }) => {
  const remarks = [item.remarks, item.remarks2].filter(x => x).join("\n");
  const volume = (() => {
    const [x1, x2, x3] = item.size.split(/\D+/);
    return (Number(x1) || 0) * (Number(x2) || 0) * (Number(x3) || 0);
  })();
  return (
    <tr>
      <StyledTd><a href={companiesMap[item.company].url} target="_blank"
                   rel="noreferrer"> {item.company}</a></StyledTd>
      <StyledTd>{item.productNumber}</StyledTd>
      <StyledTd>
        <Tooltip2 content={item.productName}>
          {item.productName}
        </Tooltip2>
      </StyledTd>
      <StyledTd>{typeof item.grid === 'number' ? `#${item.grid.toLocaleString()}` : item.grid}</StyledTd>
      <StyledTd>
        <Tooltip2 content={item.manufacturingMethod}>
          {item.manufacturingMethod}
        </Tooltip2>
      </StyledTd>
      <StyledTd>
        <Tooltip2 content={item.abrasiveGrains}>
         {item.abrasiveGrains}
        </Tooltip2>
      </StyledTd>
      <StyledTd>{item.size}</StyledTd>
      <StyledTd>{`${volume.toLocaleString()}mm³`}</StyledTd>
      <StyledTd>{item.price}</StyledTd>
      <StyledTd>
        <Tooltip2 content={item.url}>
          <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
        </Tooltip2>
      </StyledTd>
      <StyledTd>
        <Tooltip2 content={remarks}>
          <pre>
            <code>
              {remarks}
            </code>
          </pre>
        </Tooltip2>
      </StyledTd>
    </tr>
  );
};

const controlsHeight = 40;
const mainPadding = 24;
const dataTablesMarginTop = 16;

const Main = styled.div`
  padding: 64px;
`;

const StyledControls = styled.div`
  display: flex;
  width: 100%;

  & > * + * {
    margin-left: 24px;
  }
`;

const StyledTableContainer = styled.div`
  height: calc(100vh - ${mainPadding*2 + controlsHeight + dataTablesMarginTop}px);
  overflow-y: scroll;
  margin-top: ${dataTablesMarginTop}px;
`;

const StyledHTMLTable = styled(HTMLTable)`
  table-layout: fixed;
  width: 100%;
`;

const StyledStickyTr = styled.tr`
  position: sticky;
  top: 0;
  background: white;
  & th {
    width: 10%;
  }
`;

const StyledTd = styled.td`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
