/*! For license information please see bundle.js.LICENSE.txt */
  width: 80%;
`,Ji=sa.div`
  display: flex;
  justify-content: flex-end;
`,np=({isOpen:e,columnValues:t,onClose:o,onChange:a})=>{const[r,i]=(0,n.useState)(t),[p,c]=qi(),s=()=>{a(r),o()};return n.createElement(Mt,{isOpen:e,onClose:s,autoFocus:!0,canEscapeKeyClose:!0,canOutsideClickClose:!0,enforceFocus:!0,hasBackdrop:!0,usePortal:!0,className:we},n.createElement(ep,{ref:p,style:{...c}},n.createElement(pt,null,n.createElement(tp,null,n.createElement("h3",null,"表示列"),n.createElement($i,{content:"閉じる"},n.createElement(it,{className:In,icon:"cross",onClick:s}))),cp.map((e=>n.createElement(st,{key:e.value,label:e.label,checked:r.includes(e.value),onClick:()=>i((n=>n.includes(e.value)?n.filter((n=>n!==e.value)):[...n,e.value]))}))))))},ep=sa.div`
  width: 30%;
`,tp=sa.div`
  display: flex;
  justify-content: space-between;
`,op=99999,ap=[{label:"#0",value:0,hidden:!0},{label:"#150",value:150,hidden:!0},{label:"#200",value:200,hidden:!1},{label:"#400",value:400,hidden:!0},{label:"#500",value:500,hidden:!0},{label:"#600",value:600,hidden:!1},{label:"#800",value:800,hidden:!0},{label:"#1,000",value:1e3,hidden:!1},{label:"#1,500",value:1500,hidden:!0},{label:"#2,000",value:2e3,hidden:!0},{label:"#3,000",value:3e3,hidden:!1},{label:"#4,000",value:4e3,hidden:!0},{label:"#5,000",value:5e3,hidden:!1},{label:"#6,000",value:6e3,hidden:!0},{label:"#8,000",value:8e3,hidden:!1},{label:"#10,000",value:1e4,hidden:!0},{label:"もっと！",value:op,hidden:!0}],rp=ap.map((n=>n.label)),ip=ap.map((n=>n.value)),pp={freeWord:"",gridRange:[0,op]},cp=[{label:"品番",value:"productNumber"},{label:"番手",value:"grid"},{label:"製法",value:"manufacturingMethod"},{label:"砥粒",value:"abrasiveGrains"},{label:"寸法",value:"size"},{label:"金額",value:"price"},{label:"備考",value:"remarks"},{label:"容積",value:"volume"},{label:"1円あたりの容積",value:"volume-cost"}],sp=({items:e,displayColumnValues:t})=>{const o=cp.filter((n=>t.includes(n.value))),[a,r]=(0,n.useState)(),i=(n,t)=>{const o=e.find((n=>n.id===t));o&&r({item:o,x:n.clientX,y:n.clientY})};return(0,n.useEffect)((()=>{const n=()=>{r(void 0)};return document.addEventListener("click",n),()=>document.removeEventListener("click",n)}),[]),n.createElement(vp,null,n.createElement(wp,{striped:!0},n.createElement("thead",null,n.createElement(yp,null,n.createElement("th",null,"会社名"),n.createElement("th",null,"商品"),o.map((e=>n.createElement("th",{key:e.value},e.label))))),n.createElement("tbody",null,e.map((e=>n.createElement(bp,{key:e.id,item:e,displayColumns:o,onClick:i}))))),n.createElement(lp,{...a?{...a,hidden:!1}:{item:void 0,x:void 0,y:void 0,hidden:!0},onClose:()=>r(void 0)}))},lp=e=>{const t=(0,n.useMemo)((()=>{if(!e.hidden)return{mainRecords:[e.item.manufacturingMethod,e.item.price&&`￥${e.item.price.toLocaleString()}`,e.item.abrasiveGrains],remarks:e.item.remarks}}),[e.item,e.hidden]),o=(0,n.useMemo)((()=>{if(!e.hidden)return[e.item.productNumber,e.item.productName].join(" ")}),[e.item,e.hidden]);return n.createElement(kp,{hidden:e.hidden,top:e.y,left:e.x,onClick:n=>n.stopPropagation()},n.createElement(pt,null,n.createElement(xp,null,n.createElement("div",null,o),n.createElement(it,{className:In,icon:"cross",onClick:e.onClose})),t?.mainRecords.map(((e,t)=>n.createElement("div",{key:t},e))),n.createElement("div",null,n.createElement("pre",null,n.createElement("code",null,t?.remarks)))))},bp=n.memo((({item:e,displayColumns:t,onClick:o})=>{const a=la[e.company];return n.createElement("tr",{className:"clickable",onClick:n=>{n.stopPropagation(),o(n,e.id)}},n.createElement(zp,null,a?n.createElement("a",{href:a.url,target:"_blank",rel:"noreferrer"},a.name):"不明"),n.createElement(zp,null,e.url?n.createElement("a",{href:e.url,target:"_blank",rel:"noreferrer"},e.productName):e.productName),t.map((t=>n.createElement(up,{key:t.value,columnValue:t.value,item:e}))))})),up=({columnValue:e,item:t})=>{if("grid"===e)return n.createElement(zp,null,t.grid.map((n=>`#${n.toLocaleString()}`)).join("/"));if("volume"===e)return n.createElement(zp,null,t.volume?`${t.volume.toLocaleString()}mm³`:"");if("price"===e)return n.createElement(zp,null,t.price?`${t.price.toLocaleString()} 円`:"");if("volume-cost"===e){const e=t.volume&&t.price?`${(t.volume/t.price).toFixed(0)} mm³/円`:"";return n.createElement(zp,null,e)}return n.createElement(zp,null,t[e])},dp=sa.div`
  padding: 0 ${24}px;
`,hp=sa(gt)`
  margin-bottom: ${8}px;
  .bp3-navbar-group > * + * {
    margin-left: 8px;
  }
`,mp=sa.div`
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
`,fp=sa.div`
  width: 100%;
  padding: 0 8px;
`,gp=sa.span`
  white-space: nowrap;
  transform: rotate(-45deg);
`,vp=sa.div`
  // 見た目的な観点で、下に8px余白あけておく
  height: calc(100vh - ${122}px);
  overflow-y: scroll;
  margin-top: ${16}px;
`,wp=sa(dt)`
  table-layout: fixed;
  width: 100%;
`,kp=sa.div`
  position: absolute;
  ${n=>n.top?`top: ${n.top}px;`:""}
  ${n=>n.left?`left: ${n.left}px;`:""}
`,xp=sa.div`
  display: flex;
  justify-content: space-between;;
`,yp=sa.tr`
  position: sticky;
  top: 0;
  background: white;
  & th {
    width: calc(9% - ${48}px);
  }
`,zp=sa.td`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;var Mp=t(3379),Hp=t.n(Mp),Cp=t(7795),Vp=t.n(Cp),Lp=t(569),Sp=t.n(Lp),Ep=t(3565),Ap=t.n(Ep),jp=t(9216),_p=t.n(jp),Np=t(4589),Op=t.n(Np),Dp=t(3788),Tp={};Tp.styleTagTransform=Op(),Tp.setAttributes=Ap(),Tp.insert=Sp().bind(null,"head"),Tp.domAPI=Vp(),Tp.insertStyleElement=_p(),Hp()(Dp.Z,Tp),Dp.Z&&Dp.Z.locals&&Dp.Z.locals;var Rp=t(175),Pp={};Pp.styleTagTransform=Op(),Pp.setAttributes=Ap(),Pp.insert=Sp().bind(null,"head"),Pp.domAPI=Vp(),Pp.insertStyleElement=_p(),Hp()(Rp.Z,Pp),Rp.Z&&Rp.Z.locals&&Rp.Z.locals;var Ip=t(6003),Bp={};Bp.styleTagTransform=Op(),Bp.setAttributes=Ap(),Bp.insert=Sp().bind(null,"head"),Bp.domAPI=Vp(),Bp.insertStyleElement=_p(),Hp()(Ip.Z,Bp),Ip.Z&&Ip.Z.locals&&Ip.Z.locals;var Kp=t(3671),Wp={};Wp.styleTagTransform=Op(),Wp.setAttributes=Ap(),Wp.insert=Sp().bind(null,"head"),Wp.domAPI=Vp(),Wp.insertStyleElement=_p(),Hp()(Kp.Z,Wp),Kp.Z&&Kp.Z.locals&&Kp.Z.locals;var Fp=t(5698),Up={};Up.styleTagTransform=Op(),Up.setAttributes=Ap(),Up.insert=Sp().bind(null,"head"),Up.domAPI=Vp(),Up.insertStyleElement=_p(),Hp()(Fp.Z,Up),Fp.Z&&Fp.Z.locals&&Fp.Z.locals;const Gp=window.location.pathname.match(/^(\/[^/]+)/)?.[1]||"/";e.render(n.createElement(n.StrictMode,null,n.createElement(q,{basename:Gp},n.createElement(U,null,n.createElement(F,{exact:!0,path:"/"},n.createElement((()=>{const e=G(T),t=G(P).location,o=(0,n.useMemo)((()=>{const n=Qi.parse(t.search.slice(1)),e=(()=>{const[e,t]=(n.gridrange||"")?.split("-").map((n=>ip.indexOf(Number(n)))),o=(n,e)=>n&&-1!==n?n:e;return[o(e,0),o(t,ap.length-1)]})()||pp.gridRange;return{freeWord:n.freeword||pp.freeWord,gridRange:e}}),[t.search]),a=n=>{e.replace(`/?freeword=${n.freeWord}&gridrange=${n.gridRange.map((n=>ip[n])).join("-")}`)},[r,i]=(0,n.useState)({settingsOverlayOpen:!1,reportOverlayOpen:!1,displayColumnValues:["grid"]}),p=(0,n.useMemo)((()=>[ip[o.gridRange[0]],ip[o.gridRange[1]]]),[o.gridRange]),c=(0,n.useMemo)((()=>da.filter((n=>(!o.freeWord||o.freeWord.toLowerCase().split(/\s/).every((e=>-1!==n.freeWords.search(e))))&&n.grid.some((n=>!n||p[0]===op&&p[1]===op&&ap.slice(-2)[0].value<n&&n<=op||p[0]<=n&&n<=p[1]))))),[o,p]);return n.createElement(dp,null,n.createElement(hp,null,n.createElement(mt,{align:zn},n.createElement(ft,null,"人造砥石データベース")),n.createElement(mt,{align:Mn},n.createElement(ht,null),n.createElement($i,{content:"バグ報告・追加要望"},n.createElement(it,{className:In,icon:"flag",onClick:()=>i((n=>({...n,reportOverlayOpen:!0})))})),n.createElement($i,{content:"表示列設定"},n.createElement(it,{className:In,icon:"settings",onClick:()=>i((n=>({...n,settingsOverlayOpen:!0})))})))),n.createElement(mp,null,n.createElement(bt,{asyncControl:!0,leftIcon:"filter",onChange:n=>{a({...o,freeWord:n.target.value})},placeholder:"フリーワード検索",value:o.freeWord}),n.createElement(fp,null,n.createElement(Pt,{min:0,max:ap.length-1,stepSize:1,labelRenderer:e=>!ap[e].hidden||o.gridRange.includes(e)?n.createElement(gp,null,rp[e]):"",onChange:n=>{a({...o,gridRange:n})},value:o.gridRange}))),n.createElement(sp,{items:c,displayColumnValues:r.displayColumnValues}),n.createElement(Yi,{isOpen:r.reportOverlayOpen,onClose:()=>i((n=>({...n,reportOverlayOpen:!1}))),onSubmit:n=>(async n=>{await fetch("https://8fovdmbcp0.execute-api.us-east-2.amazonaws.com/default/send_mail",{method:"POST",body:JSON.stringify(n),mode:"no-cors"})})({title:"人造砥石データベースのバグ報告・追加要望",message:n})}),n.createElement(np,{isOpen:r.settingsOverlayOpen,columnValues:r.displayColumnValues,onClose:()=>i((n=>({...n,settingsOverlayOpen:!1}))),onChange:n=>i((e=>({...e,displayColumnValues:n})))}))}),null)),n.createElement(F,null,"not found")))),document.getElementById("root"))}()}();