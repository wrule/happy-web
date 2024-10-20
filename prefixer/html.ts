import { JSDOM } from 'jsdom';

export default
function htmlPrefixer(prefix: string, html: string) {
  const htmlDOM = new JSDOM(html);
  const document = htmlDOM.window.document;
  htmlDOM.window.document.querySelectorAll('script, img, iframe')
    .forEach((item: any) => {
      item.src = prefix + item.src;
    });
  htmlDOM.window.document.querySelectorAll('link')
    .forEach((item) => {
      item.href = prefix + item.href;
    });

  const prefixerScript = document.createElement('script');
  if (document.head.firstChild) {
    document.head.insertBefore(prefixerScript, document.head.firstChild);
  } else {
    document.head.appendChild(prefixerScript);
  }
  prefixerScript.defer = true;
  prefixerScript.removeAttribute('src');
  prefixerScript.textContent = 'console.log(1234);';

  return htmlDOM.serialize();
}
