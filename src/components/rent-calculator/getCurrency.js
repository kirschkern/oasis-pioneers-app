export default function getCurrency(value, noComma = false) {
    return Number(value).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: noComma ? 0 : 2,
        maximumFractionDigits: noComma ? 0 : 2,
    })
}
