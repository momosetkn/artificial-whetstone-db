export type Company = {
  name: string,
  url?: string,
}

export const companies =  [
  {
    name: "シャプトン",
    url: "https://shapton.co.jp/"
  },
  {
    name: "ナニワ",
    url: "https://www.naniwa-kenma.co.jp/"
  },
  {
    name: "ツボ万",
    url: ""
  },
  {
    name: "研承",
    url: "https://tsukiyama.buyshop.jp/"
  },
  {
    name: "キング砥石株式会社(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "朝日虎(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "中京研磨(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "中京研磨株式会社(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "中京研磨(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "朝日虎(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "ノーブランド？(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "株式会社ノリタケカンパニーリミテド(松永トイシ)",
    url: "http://matsunaga-corp.co.jp/"
  },
  {
    name: "サイコム",
    url: "http://www.saicom.info/"
  },
  {
    name: "スエヒロ",
    url: "https://www.suehiro-toishi.com/"
  },
  {
    name: "實光刃物",
    url: "https://www.jikko.jp/"
  },
  {
    name: "今西製砥",
    url: "https://home.etown.ne.jp/"
  },
  {
    name: "大谷砥石",
    url: "https://hamono.ocnk.net/"
  },
  {
    name: "田中砥石 ",
    url: ""
  },
  {
    name: "京東山砥石",
    url: "https://www.honmamon.jp/"
  },
  {
    name: "NSK",
    url: "https://nskdiatoishi.jp/"
  },
  {
    name: "ノーブランド",
    url: "https://hamono.ocnk.net/"
  },
  {
    name: "伊予鉱業所",
    url: ""
  },
  {
    name: "森平",
    url: "https://sankeishop.jp/"
  },
  {
    name: "宮越製砥",
    url: "https://shop.toishiya-miyagoshi.com/"
  },
  {
    name: "アイウッド",
    url: "https://www.monotaro.com/"
  },
  {
    name: "大和製砥所",
    url: "http://www.yamatoseito.co.jp/"
  },
  {
    name: "SK11(藤原産業)",
    url: "http://www.fujiwarasangyo-markeweb2.com/"
  },
  {
    name: "三京ダイヤモンド工業",
    url: "https://www.sankyo-diamond.co.jp/"
  },
  {
    name: "柳瀬",
    url: "https://yanase-saving.com/"
  },
  {
    name: "鳳凰？",
    url: "http://www.echigo-douraku.com/"
  },
  {
    name: "ノーブランド？",
    url: "https://www.ehamono.com/"
  },
  {
    name: "堺一文字光秀",
    url: "https://www.ichimonji.co.jp/"
  },
  {
    name: "砥石どっとこむ",
    url: "http://www.e-toishi.com/"
  },
  {name: "高儀", url: ""},
  {name: "GOKEI", url: ""},
  {name: "三共コーポレーション", url: ""},
  {name: "貝印", url: "https://www.kai-group.com/"},
  {name: "グレステン", url: "http://www.glestain.jp/"},
  {name: "郷右馬允義弘", url: "https://www.houchoumasa.com/"},
  {name: "ツヴィリング", url: "https://jp.zwilling-shop.com/"},
];

export const companiesMap: Record<string, Company> = companies.reduce((acc, cur) => ({
  ...acc,
  [cur.name]: cur
}), {});
