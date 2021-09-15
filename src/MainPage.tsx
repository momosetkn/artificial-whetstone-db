import React, {ChangeEvent, useMemo, useRef, useState} from 'react';
import {
  Alignment,
  Button,
  Card, Classes,
  HTMLTable,
  InputGroup,
  Navbar, NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  NumberRange,
  RangeSlider
} from "@blueprintjs/core";
import styled from "styled-components";
import {Product, products} from "./data/products";
import {companies, Company} from "./data/companies";
import {Popover2} from "@blueprintjs/popover2";
import {useHistory, useLocation} from "react-router-dom";
import queryString from "querystring";
import {ReportOverlay} from "./components/ReportOverlay";

type State = {
  freeWord: string;
  gridRange: NumberRange;
};

const maxGrid = 99_999;
const grids = [
  {label: "#0", value: 0, hidden: true},
  {label: "#150", value: 150, hidden: true},
  {label: "#200", value: 200, hidden: false},
  {label: "#400", value: 400, hidden: true},
  {label: "#500", value: 500, hidden: true},
  {label: "#600", value: 600, hidden: false},
  {label: "#800", value: 800, hidden: true},
  {label: "#1,000", value: 1_000, hidden: false},
  {label: "#1,500", value: 1_500, hidden: true},
  {label: "#2,000", value: 2_000, hidden: true},
  {label: "#3,000", value: 3_000, hidden: false},
  {label: "#4,000", value: 4_000, hidden: true},
  {label: "#5,000", value: 5_000, hidden: false},
  {label: "#6,000", value: 6_000, hidden: true},
  {label: "#8,000", value: 8_000, hidden: false},
  {label: "#10,000", value: 10_000, hidden: true},
  {label: "もっと！", value: maxGrid, hidden: true},
] as const;

const gridLabels: string[] = grids.map(x => x.label);
const gridValues: number[] = grids.map(x => x.value);

const initialState: State = {
  freeWord: '',
  gridRange: [0, maxGrid],// gridsのインデックス
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
    const gridRange = (() => {
      const [from, to] = ((parsedQuery.gridrange || "") as string)?.split("-").map(x => gridValues.indexOf(Number(x)));
      const fallback = (value: number, fallbackValue: number) => !value || value === -1 ? fallbackValue : value;
      return [fallback(from, 0), fallback(to, grids.length - 1)] as NumberRange;
    })() || initialState.gridRange;
    return {
      freeWord: (parsedQuery.freeword as string) || initialState.freeWord,
      gridRange,
    };
  }, [location.search]);
  const updateQuery = (q: State) => {
    history.replace(`/?freeword=${q.freeWord}&gridrange=${q.gridRange.map(x => gridValues[x]).join("-")}`)
  };

  const [reportOverlayOpen, setReportOverlayOpen] = useState(false);

  const selectedGridRangesValues: [number, number] = useMemo(() => [gridValues[query.gridRange[0]], gridValues[query.gridRange[1]]], [query.gridRange]);
  const filteredProducts = useMemo(() => products.filter(product => {
    const isTargetGird = (value: Product["grid"][number]) => {
      // TODO: 番手情報が無いものは、とりあえず無条件に出しておく
      if (!value) return true;
      if (selectedGridRangesValues[0] === maxGrid && selectedGridRangesValues[1] === maxGrid) {
        // from-toどっちもMAXの場合、最後から2番目よりも上を条件とする
        if (grids.slice(-2)[0].value < value && value <= maxGrid) return true;
      }
      return selectedGridRangesValues[0] <= value && value <= selectedGridRangesValues[1];

    }
    return (!query.freeWord || product.freeWords.search(query.freeWord) !== -1)
      && product.grid.some(isTargetGird);
  }), [query, selectedGridRangesValues])

  const handleChangeFreeWord = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuery({...query, freeWord: e.target.value});
  };
  const handleChangeGridRange = (e: NumberRange) => {
    updateQuery({...query, gridRange: e});
  };

  return (
    <Main>
      <StyledNavbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>人造砥石データベース</NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="flag" onClick={() => setReportOverlayOpen(true)}>報告・要望</Button>
          <Button className={Classes.MINIMAL} icon="settings" >設定</Button>
        </NavbarGroup>
      </StyledNavbar>
      <StyledControls>
        <InputGroup
          asyncControl={true}
          leftIcon="filter"
          onChange={handleChangeFreeWord}
          placeholder="フリーワード検索"
          value={query.freeWord}
        />
        <StyledRangeSliderContainer>
          <RangeSlider
            min={0}
            max={grids.length - 1}
            stepSize={1}
            labelRenderer={(value, opts) => !grids[value].hidden || query.gridRange.includes(value) ?
              <StyledRangeSliderLabel>{gridLabels[value]}</StyledRangeSliderLabel> : ""}
            onChange={handleChangeGridRange}
            value={query.gridRange}
          />
        </StyledRangeSliderContainer>
      </StyledControls>
      <DataTables items={filteredProducts} />
      <ReportOverlay isOpen={reportOverlayOpen} onClose={() => setReportOverlayOpen(false)} onSubmit={a => console.log(a)}/>
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
          <th>商品</th>
          <th>番手</th>
          <th>寸法(容積)</th>
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
  const cardContent = useMemo(() => ({
    mainRecords: [
      [item.productNumber, item.productName].join(" "),
      item.manufacturingMethod,
      (item.price && `￥${item.price.toLocaleString()}`),
      item.abrasiveGrains,
    ],
    remarks: [item.remarks, item.remarks2].filter(x => x).join("\n"),
  }), [item]);
  const volume = useMemo(() => {
    const [x1, x2, x3] = item.size.split(/\D+/);
    return (Number(x1) || 0) * (Number(x2) || 0) * (Number(x3) || 0);
  }, [item.size]);

  const ref = useRef<HTMLSpanElement>(null);
  return (
    <tr className="clickable" onClick={() => ref.current?.click()}>
      <StyledTd>
        <a
          href={companiesMap[item.company].url}
          target="_blank"
          rel="noreferrer"
        >
          {item.company}
        </a>
      </StyledTd>
      <StyledTd>
        <Popover2
          interactionKind="click"
          position={"bottom-left"}
          hoverOpenDelay={0}
          modifiers={{arrow: {enabled: false}}}
          content={
            <Card>
              {cardContent.mainRecords.map(x => <div>{x}</div>)}
              <div>
                <pre><code>{cardContent.remarks}</code></pre>
              </div>
            </Card>
          }>
          <span ref={ref} hidden/>
        </Popover2>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.productName}
        </a>
      </StyledTd>
      <StyledTd>{item.grid.map(x => `#${x.toLocaleString()}`).join("/")}</StyledTd>
      <StyledTd>
        {volume ? `${item.size} (${volume.toLocaleString()}mm³)` : ""}
      </StyledTd>
    </tr>
  );
});

const mainSidePadding = 24;
const navbarHeight = 50;
const navbarMarginBottom = 8;
const controlsHeight = 40;
const dataTablesMarginTop = 16;

const Main = styled.div`
  padding: 0 ${mainSidePadding}px;
`;

const StyledNavbar = styled(Navbar)`
  margin-bottom: ${navbarMarginBottom}px;
  & button + button {
    margin-left: 8px;
  }
`;

const StyledControls = styled.div`
  display: flex;
  width: 100%;

  & > * + * {
    margin-left: 16px;
  }
  @media (max-width:640px) { 
    display: block;
  
    & > * + * {
      margin-left: 0px;
      margin-top: 16px;
    }
  }
`;

const StyledRangeSliderContainer = styled.div`
  width: 100%;
  padding: 0 8px;
`;

const StyledRangeSliderLabel = styled.span`
  white-space: nowrap;
  transform: rotate(-45deg);
`;

const StyledTableContainer = styled.div`
  // 見た目的な観点で、下に8px余白あけておく
  height: calc(100vh - ${navbarHeight + navbarMarginBottom + controlsHeight + dataTablesMarginTop + 8}px);
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
    width: calc(9% - ${mainSidePadding*2}px);
  }
`;

const StyledTd = styled.td`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
