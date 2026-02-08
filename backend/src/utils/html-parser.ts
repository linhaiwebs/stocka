import { JSDOM } from 'jsdom';

export interface ParsedHTML {
  html: string;
  css: string;
  js: string;
  isFullDocument: boolean;
}

export class HTMLParser {
  static parse(htmlContent: string): ParsedHTML {
    const trimmedContent = htmlContent.trim();
    const isFullDocument = trimmedContent.toLowerCase().startsWith('<!doctype') ||
                          trimmedContent.toLowerCase().startsWith('<html');

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const cssContent: string[] = [];
    const jsContent: string[] = [];

    const styleElements = document.querySelectorAll('style');
    styleElements.forEach((style: Element) => {
      if (style.textContent) {
        cssContent.push(style.textContent);
      }
      style.remove();
    });

    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach((link: Element) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        cssContent.push(`/* Embedded stylesheet: ${href} - Please include manually */`);
      }
    });

    const scriptElements = document.querySelectorAll('script');
    scriptElements.forEach((script: Element) => {
      if (script.textContent && script.textContent.trim()) {
        jsContent.push(script.textContent);
      }
      script.remove();
    });

    const elementsWithInlineStyles = document.querySelectorAll('[style]');
    const inlineStyles: string[] = [];
    elementsWithInlineStyles.forEach((element: Element, index: number) => {
      const style = element.getAttribute('style');
      if (style) {
        const className = `inline-style-${index}`;
        element.classList.add(className);
        inlineStyles.push(`.${className} { ${style} }`);
        element.removeAttribute('style');
      }
    });

    if (inlineStyles.length > 0) {
      cssContent.push('\n/* Converted inline styles */\n' + inlineStyles.join('\n'));
    }

    // Convert placeholder links to conversion triggers
    const conversionLinks = document.querySelectorAll('a[href^="#"]');
    conversionLinks.forEach((link: Element) => {
      const href = link.getAttribute('href');
      // Check if it's a placeholder link (common patterns: #singo, #signup, #buy, #register, etc.)
      // or just a plain # anchor with button-like text
      const linkText = link.textContent?.toLowerCase() || '';
      const isConversionLink =
        href === '#singo' ||
        href === '#signup' ||
        href === '#register' ||
        href === '#buy' ||
        href === '#submit' ||
        href === '#join' ||
        href === '#start' ||
        href === '#download' ||
        (href === '#' && (
          linkText.includes('sign up') ||
          linkText.includes('signup') ||
          linkText.includes('register') ||
          linkText.includes('buy') ||
          linkText.includes('purchase') ||
          linkText.includes('get started') ||
          linkText.includes('join') ||
          linkText.includes('download') ||
          linkText.includes('subscribe') ||
          linkText.includes('try')
        ));

      if (isConversionLink && !link.hasAttribute('data-conversion-trigger')) {
        link.setAttribute('data-conversion-trigger', 'true');
        link.setAttribute('href', '#');
      }
    });

    let cleanHTML: string;
    if (isFullDocument) {
      const bodyContent = document.body?.innerHTML || '';
      cleanHTML = bodyContent;
    } else {
      cleanHTML = document.body?.innerHTML || htmlContent;
    }

    return {
      html: cleanHTML,
      css: cssContent.join('\n\n'),
      js: jsContent.join('\n\n'),
      isFullDocument
    };
  }

  static isFullHTMLDocument(htmlContent: string): boolean {
    const trimmed = htmlContent.trim().toLowerCase();
    return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
  }
}
