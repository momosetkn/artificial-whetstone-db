import React, {ChangeEvent, useMemo} from 'react';
import {HTMLTable, InputGroup, NumberRange, RangeSlider} from "@blueprintjs/core";
import styled from "styled-components";
import {Product, products} from "./data/products";
import {companies, Company} from "./data/companies";
import {Tooltip2} from "@blueprintjs/popover2";
import {useHistory, useLocation} from "react-router-dom";
import queryString from "querystring";

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
  {label: "#2,000", value: 2_000},
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
  const history = useHistory();
  const location = useLocation();

  const query: State = useMemo(() => {
    // 先頭の?を取り除く
    const parsedQuery = queryString.parse(location.search.slice(1));
    return {
      freeWord: (parsedQuery.freeword as string) || initialState.freeWord,
      gridRange: (parsedQuery.gridrange as string)?.split("-").map(x => Number(x)) as NumberRange || initialState.gridRange,
    };
  }, [location.search]);
  const updateQuery = (q: State) => {
    history.replace(`/?freeword=${q.freeWord}&gridrange=${q.gridRange.join("-")}`)
  };

  const selectedGridRangesValues: [number, number] = useMemo(() => [gridValues[query.gridRange[0]], gridValues[query.gridRange[1]]], [query.gridRange]);
  const filteredProducts = useMemo(() => products.filter(product => {
    const isTargetGird = (value: Product["grid"]) => {
      // TODO: 番手情報が無いものは、とりあえず無条件に出しておく
      if (!value) return true;
      if (selectedGridRangesValues[0] === Number.MAX_VALUE && selectedGridRangesValues[1] === Number.MAX_VALUE) {
        // from-toどっちもMAXの場合、最後から2番目よりも上を条件とする
        if (typeof value === "number" && grids.slice(-2)[0].value < value && value <= Number.MAX_VALUE) return true;
      }
      if (typeof value === "number" && selectedGridRangesValues[0] <= value && value <= selectedGridRangesValues[1]) return true;
      if (typeof value === "string") {
        const matchGroups = value.match(/(\d+)/g);
        for (const m in matchGroups) {
          const n = Number(m);
          if (selectedGridRangesValues[0] <= n && n <= selectedGridRangesValues[1]) return true;
        }
      }
    }
    return (!query.freeWord || product.freeWords.search(query.freeWord) !== -1)
      && isTargetGird(product.grid);
  }), [query, selectedGridRangesValues])

  const handleChangeFreeWord = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuery({...query, freeWord: e.target.value});
  };
  const handleChangeGridRange = (e: NumberRange) => {
    updateQuery({...query, gridRange: e});
  };

  return (
    <Main>
      <StyledControls>
        <InputGroup
          asyncControl={true}
          leftIcon="filter"
          onChange={handleChangeFreeWord}
          placeholder="フリーワード検索"
          value={query.freeWord}
        />
        <StyledRangeSlider
          min={0}
          max={grids.length - 1}
          stepSize={1}
          labelRenderer={(value, opts) => <StyledRangeSliderLabel>{gridLabels[value]}</StyledRangeSliderLabel>}
          onChange={handleChangeGridRange}
          value={query.gridRange}
        />
      </StyledControls>
      <DataTables items={filteredProducts} />
    </Main>
  );
};

const DataTables = ({items}: { items: Product[]}) => {
  return (
    <StyledTableContainer>
      <StyledHTMLTable striped>
        <thead>
        <StyledStickyTr>
          <th>会社名</th>
          <th>品番</th>
          <th>商品名</th>
          <th>番手</th>
          <th>製法</th>
          <th>砥粒</th>
          <th>サイズ</th>
          <th>容積</th>
          <th>金額</th>
          <th>製品URL</th>
          <th>備考</th>
        </StyledStickyTr>
        </thead>
        <tbody>
          {items.map(item => <Row key={item.id} item={item} />)}
        </tbody>
      </StyledHTMLTable>
    </StyledTableContainer>
  )
};

const Row = React.memo(({item}: { item: Product }) => {
  const remarks = useMemo(() => [item.remarks, item.remarks2].filter(x => x).join("\n"), [item.remarks, item.remarks2]);
  const volume = useMemo(() => {
    const [x1, x2, x3] = item.size.split(/\D+/);
    return (Number(x1) || 0) * (Number(x2) || 0) * (Number(x3) || 0);
  }, [item.size]);
  return (
    <tr>
      <StyledTd>
        <Tooltip2 content={item.company}>
          <a
            href={companiesMap[item.company].url}
            target="_blank"
           rel="noreferrer"
          >
            {item.company}
          </a>
        </Tooltip2>
      </StyledTd>
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
      <StyledTd>{volume ? `${volume.toLocaleString()}mm³` : ""}</StyledTd>
      <StyledTd>{item.price && `￥${item.price.toLocaleString()}`}</StyledTd>
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
});

const controlsHeight = 40;
const mainPadding = 24;
const dataTablesMarginTop = 16;

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

const StyledRangeSlider = styled(RangeSlider)`
  margin-right: 16px;
`;

const StyledRangeSliderLabel = styled.span`
  white-space: nowrap;
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
    width: calc(9% - ${mainPadding*2}px);
  }
`;

const StyledTd = styled.td`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
