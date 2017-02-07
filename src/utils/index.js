import CryptoJS from 'crypto-js';
import { AWSAccessKey, AWSSecretKey, AWSAssociateTag } from '@constants';

function encode(val) {
  return encodeURIComponent(val).
  replace(/%40/gi, '@').
  replace(/%3A/gi, ':').
  replace(/%24/g, '$').
  replace(/%2C/gi, ',').
  replace(/%20/g, '+').
  replace(/%5B/gi, '[').
  replace(/%5D/gi, ']');
}

export function buildURL(url, queryParams) {
  if (!queryParams) {
    return url;
  }

  let serializedParams;
  let parts = [];

  Object.keys(queryParams).forEach(function serialize(key) {
    let val = queryParams[key];

    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (!Array.isArray(val)) {
      val = [val];
    }

    val.forEach(function parseValue(v) {
      if (v instanceof Date) {
        v = v.toISOString();
      } else if (v !== null && typeof v === 'object') {
        v = JSON.stringify(v);
      }

      parts.push(encode(key) + '=' + encode(v));
    });
  });


  serializedParams = parts.join('&');

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

export function createAWSRequestWithSignature(url) {
  let updatedUrl = `${url}&AWSAccessKeyId=${AWSAccessKey}&AssociateTag=${AWSAssociateTag}`;
  let [host, dataDorHash] = updatedUrl.split('?');
  const query = encodeURIComponent(dataDorHash)
    .replace(/%3D/gi, '=')
    .replace(/%26/gi, '\n')
    .split('\n')
    .sort()
    .join('&');

  dataDorHash = `GET\nwebservices.amazon.com\n/onca/xml\n${query}`;
  const hash = CryptoJS.HmacSHA256(dataDorHash, AWSSecretKey);
  const hashInBase64 = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
  const finalUrl = `${host}?${query}&Signature=${hashInBase64}`;

  return finalUrl;
}
