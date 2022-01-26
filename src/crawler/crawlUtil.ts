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

export function extractSummary($: cheerio.Root): string {
  let summary = 'Unknown';
  let foundSummary = false;
  const paragraphs = $('div.mw-parser-output p')
    .map((_, p) => $(p).text())
    .toArray();
  for (let i = 2; i < paragraphs.length; i++) {
    if (foundSummary) break;
    const paragraphText = paragraphs[i].toString() as string;
    if (
      !paragraphText.startsWith('This article or section') &&
      paragraphText.length > 50 &&
      !paragraphText.startsWith('Content approaching.') &&
      !paragraphText.startsWith('This article') &&
      !paragraphText.startsWith('This Star Wars Legends ') &&
      !paragraphText.startsWith('Parts of this article') &&
      !paragraphText.startsWith('A definitive Legends ') &&
      !paragraphText.startsWith('The ability to speak ') &&
      !paragraphText.startsWith('It is requested that this article') &&
      !paragraphText.startsWith('The factual') &&
      !paragraphText.startsWith('Please') &&
      !paragraphText.startsWith('See the')
    ) {
      foundSummary = true;
      summary = paragraphText;
    }
  }
  return summary;
}
