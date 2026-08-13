// Nothing is open in the modal slot for ordinary storefront URLs. Without this
// file a hard load of any /(site) route would 404 on the unmatched slot.
export default function ModalDefault() {
  return null;
}
