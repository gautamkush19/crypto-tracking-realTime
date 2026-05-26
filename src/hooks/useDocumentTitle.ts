import { useEffect } from 'react';
import { PRODUCT_NAME } from '../constants/market';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${PRODUCT_NAME}` : `${PRODUCT_NAME} Crypto Terminal`;
  }, [title]);
}
