import React, {ChangeEvent, useMemo, useState, MouseEvent, useEffect} from 'react';
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
import {companiesMap, Company} from "./data/companies";
import {useHistory, useLocation} from "react-router-dom";
import queryString from "querystring";
import {ReportOverlay} from "./components/ReportOverlay";
import {sendMail} from "./utils/sendMail";
import {SettingsOverlay} from "./components/SettingsOverlay";

type Query = {
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
const initialState: Query = {
  freeWord: '',
  gridRange: [0, maxGrid],// gridsのインデックス
};

export const columns = [
  {
    label: "品番",
    value: "productNumber",
  },
  // {
  //   label: "会社名",
  //   value: "company",
  // },
  // {
  //   label: "品名",
  //   value: "productName",
  // },
  {
    label: "番手",
    value: "grid",
  },
  {
    label: "製法",
    value: "manufacturingMethod",
  },
  {
    label: "砥粒",
    value: "abrasiveGrains",
  },
  {
    label: "寸法",
    value: "size",
  },
  {
    label: "金額",
    value: "price",
  },
  // {
  //   label: "URL",
  //   value: "url",
  // },
  {
    label: "備考",
    value: "remarks",
  },
  {
    label: "容積",
    value: "volume",
  },
  {
    label: "1円あたりの容積",
    value: "volume-cost",
  },
] as const;

export type Column = typeof columns[number];
type columnValues = Column["value"];

type State = {
  reportOverlayOpen: boolean;
  settingsOverlayOpen: boolean;
  displayColumnValues: string[];
};
export const MainPage = () => {
  const history = useHistory();
  const location = useLocation();
  const query: Query = useMemo(() => {
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
  const updateQuery = (q: Query) => {
    history.replace(`/?freeword=${q.freeWord}&gridrange=${q.gridRange.map(x => gridValues[x]).join("-")}`)
  };
  const [state, update] = useState<State>({
    settingsOverlayOpen: false,
    reportOverlayOpen: false,
    displayColumnValues: ["grid"],
  });

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
    const isFreeWordMatch = () => {
      const splitFreeWord = query.freeWord.toLowerCase().split(/\s/);
      return splitFreeWord.every(x => product.freeWords.search(x) !== -1);
    };
    return (!query.freeWord || isFreeWordMatch()) && product.grid.some(isTargetGird);
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
          <Button className={Classes.MINIMAL} icon="flag" onClick={() => update(prev => ({...prev, reportOverlayOpen: true}))}>
            バグ報告・追加要望
          </Button>
          <Button className={Classes.MINIMAL} icon="settings" onClick={() => update(prev => ({...prev, settingsOverlayOpen: true}))}>
            表示列設定
          </Button>
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
            labelRenderer={(value) => !grids[value].hidden || query.gridRange.includes(value) ?
              <StyledRangeSliderLabel>{gridLabels[value]}</StyledRangeSliderLabel> : ""}
            onChange={handleChangeGridRange}
            value={query.gridRange}
          />
        </StyledRangeSliderContainer>
      </StyledControls>
      <DataTables items={filteredProducts} displayColumnValues={state.displayColumnValues} />
      <ReportOverlay
        isOpen={state.reportOverlayOpen}
        onClose={() => update(prev => ({...prev, reportOverlayOpen: false}))}
        onSubmit={message => sendMail({title: "人造砥石データベースのバグ報告・追加要望", message})}
      />
      <SettingsOverlay
        isOpen={state.settingsOverlayOpen}
        columnValues={state.displayColumnValues}
        onClose={() => update(prev => ({...prev, settingsOverlayOpen: false}))}
        onChange={(value) => update(prev => ({...prev, displayColumnValues: value}))}
      />
    </Main>
  );
};

const DataTables = ({items, displayColumnValues}: { items: Product[], displayColumnValues: string[]}) => {
  const displayColumns =  columns.filter(x => displayColumnValues.includes(x.value));

  const [state, update] = useState<{ item: Product, x: number, y: number } | undefined>();

  const handleClick = (e: MouseEvent<HTMLTableRowElement>, id: number) => {
    const item = items.find(x => x.id === id);
    if(!item) return;
    update({item, x: e.clientX,  y: e.clientY });
  };

  useEffect(() => {
    const handleClickDocument = () => {
      update(undefined);
    };

    document.addEventListener("click", handleClickDocument);
    return () => document.removeEventListener("click", handleClickDocument);
  }, [])

  // @ts-ignore
  return (
    <StyledTableContainer>
      <StyledHTMLTable striped>
        <thead>
        <StyledStickyTr>
          <th>会社名</th>
          <th>商品</th>
          {displayColumns.map(column => (
            <th key={column.value}>{column.label}</th>
          ))}
        </StyledStickyTr>
        </thead>
        <tbody>
        {items.map(item => <Row key={item.id} item={item} displayColumns={displayColumns} onClick={handleClick}/>)}
        </tbody>
      </StyledHTMLTable>
      <ItemDetailCard {...(
        state ?
          {...state, hidden: false}
          : {
            item: undefined,
            x: undefined,
            y: undefined,
            hidden: true
          }
        )}
        onClose={() => update(undefined)}
      />
    </StyledTableContainer>
  )
};

type ItemDetailCardProps =
  (
    { item: Product, x: number, y: number, hidden: false }
    | { item: undefined, x: undefined, y: undefined, hidden: true }
    )
  & { onClose: () => void };

const ItemDetailCard = (props: ItemDetailCardProps) => {
  const cardContent = useMemo(() => {
    if (props.hidden) return undefined;
    return {
      mainRecords: [
        props.item.manufacturingMethod,
        (props.item.price && `￥${props.item.price.toLocaleString()}`),
        props.item.abrasiveGrains,
        (props.item.size && props.item.volume) && `${props.item.size.join("☓")}(${props.item.volume.toLocaleString()}mm³)`,
      ].filter(x => x),
      remarks: props.item.remarks,
    }
  }, [props.item, props.hidden]);

  const title = useMemo(() => {
    if (props.hidden) return undefined;

    return [props.item.productNumber, props.item.productName].join(" ");
  }, [props.item, props.hidden]);

  return (
    <StyledAbsoluteCardContainer hidden={props.hidden} top={props.y} left={props.x} onClick={e => e.stopPropagation()}>
      <Card>
        <StyledCardHeader>
          <div>
            {title}
          </div>
          <Button className={Classes.MINIMAL} icon="cross" onClick={props.onClose}/>
        </StyledCardHeader>
        {cardContent?.mainRecords.map((x, i) => <div key={i}>{x}</div>)}
        <div>
          <pre><code>{cardContent?.remarks}</code></pre>
        </div>
      </Card>
    </StyledAbsoluteCardContainer>
  );
};

const Row = React.memo(({
  item,
  displayColumns,
  onClick
}: {
  item: Product,
  displayColumns: Column[],
  onClick: (e: MouseEvent<HTMLTableRowElement>, id: number) => void
}) => {
  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation();
    onClick(e, item.id);
  };
  const company: Company | undefined = companiesMap[item.company];
  return (
    <tr className="clickable" onClick={handleClick}>
      <StyledTd>
        {company ?
          <a
            href={company.url}
            target="_blank"
            rel="noreferrer"
          >
            {company.name}
          </a>
          : "不明"}
      </StyledTd>
      <StyledTd>
        {item.url ?
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.productName}
          </a>
          : item.productName}
      </StyledTd>
      {displayColumns.map(column => (
        <VariableCell key={column.value} columnValue={column.value} item={item} />
      ))}
    </tr>
  );
});

const VariableCell = ({columnValue, item}: { columnValue: columnValues, item: Product }) => {
  if (columnValue === "grid") {
    return (
      <StyledTd>{item.grid.map(x => `#${x.toLocaleString()}`).join("/")}</StyledTd>
    );
  }
  if (columnValue === "volume") {
    return (
      <StyledTd>
        {item.volume ? `${item.volume.toLocaleString()}mm³` : ""}
      </StyledTd>
    );
  }
  if (columnValue === "size") {
    return (
      <StyledTd>
        {item.size?.join("☓")}
      </StyledTd>
    );
  }
  if (columnValue === "price") {
    return (
      <StyledTd>
        {item.price ? `${item.price.toLocaleString()} 円` : ''}
      </StyledTd>
    );
  }
  if (columnValue === "volume-cost") {
    const volumeCost = (() => {
      if(!item.volume || !item.price)return ""
      return `${(item.volume / item.price).toFixed(0)} mm³/円`;
    })();
    return (
      <StyledTd>
        {volumeCost}
      </StyledTd>
    );
  }
  return (
    <StyledTd>
      {/* @ts-ignore */}
      {item[columnValue]}
    </StyledTd>
  );
};

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
  .bp3-navbar-group > * + * {
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

const StyledAbsoluteCardContainer = styled.div<{ top?: number, left?: number }>`
  position: absolute;
  ${x => x.top ? `top: ${x.top}px;` : ""}
  ${x => x.left ? `left: ${x.left}px;` : ""}
`;

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;;
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
