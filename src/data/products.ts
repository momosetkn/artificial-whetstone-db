import {companiesMap} from "./companies";
import {productsSrc} from "./productsSrc";

export type Product = {
  id: number,
  productNumber: string,
  company: string,
  productName: string,
  grid: number[],
  manufacturingMethod: string,
  abrasiveGrains: string,
  size?: number[],
  volume?: number,
  price?: number,
  url: string,
  remarks?: string,
  freeWords: string,
};

let index = 0;

export const products: Product[] = productsSrc.map(x => {
  const size: number[] | undefined = x.size ? x.size.split(/\D+/).slice(0, 3).map(Number) : undefined;
  const grid: number[] = x.grid ? x.grid.split(/\D+/).filter(x => x).map(Number) : [];
  const volume: number | undefined = size?.reduce((acc, cur) => acc * cur) as number | undefined;
  const remarks: string | undefined = [x.remarks, x.remarks2].filter(x => x).join("\n") || undefined;
  const freeWords: string | undefined = JSON.stringify({...x, company: companiesMap[x.company]}).toLowerCase();
  return {
    ...x,
    size,
    grid,
    freeWords,
    volume,
    remarks,
    id: index++
  }
});
