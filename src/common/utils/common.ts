export const findChildren = (allData: any[], { parentId, field }: { parentId: number; field: string }) => {
  return allData
    .filter((d) => d.parentId === parentId)
    .map((item: any) => ({
      ...item,
      child: findChildren(allData, { parentId: item[field], field }),
    }));
};

export const prefixZero = (num: number, length: number) => {
  return (Array(length).join('0') + num).slice(-length);
};

/**
 * 截取字符串
 * @param str 被截取的目标字符串
 */
export const cutOutString = (str: string) => (length: number) => str.substr(0, str.length - length);

/**
 * 截取末尾3位字符串
 * @param str 被截取的目标字符串
 * @returns 返回剩下的字符串
 */
export const cutOutStringThree = (str: string) => cutOutString(str)(3);
