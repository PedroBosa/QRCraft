import { UrlPayload } from '../../types/payload';

export function buildUrlWithUtm(payload: UrlPayload): string {
  const trimmedUrl = payload.rawUrl.trim();
  if (!trimmedUrl) return '';

  let validUrl: URL;
  try {
    const hasProtocol = /^https?:\/\//i.test(trimmedUrl);
    validUrl = new URL(hasProtocol ? trimmedUrl : `https://${trimmedUrl}`);
  } catch {
    return trimmedUrl;
  }

  if (payload.utmParams) {
    const { source, medium, campaign, term, content } = payload.utmParams;
    if (source && source.trim()) validUrl.searchParams.set('utm_source', source.trim());
    if (medium && medium.trim()) validUrl.searchParams.set('utm_medium', medium.trim());
    if (campaign && campaign.trim()) validUrl.searchParams.set('utm_campaign', campaign.trim());
    if (term && term.trim()) validUrl.searchParams.set('utm_term', term.trim());
    if (content && content.trim()) validUrl.searchParams.set('utm_content', content.trim());
  }

  return validUrl.toString();
}
