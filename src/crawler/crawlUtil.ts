export function extractSidePanelInfo($: cheerio.Root, tag: string) {
  let info = 'Unknown';
  const elements = $(`div[data-source=${tag}]`).toArray();
  if (elements && elements.length) {
    const element = $('div', elements[0])
      .map((_, a) => $(a).text())
      .toArray();
    if (element) {
      info = element.toString();
      info = info.split('[')[0];
    }
  }
  return info;
}
