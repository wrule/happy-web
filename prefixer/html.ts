import { JSDOM } from 'jsdom';

export default
function htmlPrefixer(prefix: string, html: string) {
  const htmlDOM = new JSDOM(html);
  htmlDOM.window.document.querySelectorAll('script, img, iframe')
    .forEach((item: any) => {
      item.src = prefix + item.src;
    });
  htmlDOM.window.document.querySelectorAll('link')
    .forEach((item) => {
      item.href = prefix + item.href;
    });
  return htmlDOM.serialize();
}
