const alias = document.getElementById("alias").textContent
const qrcodeImg = document.getElementById("qrcode-img")
const qrcodeInfo = document.getElementById("qrcode-info")

if (qrcodeImg) {
    const text = `${location.origin}/${alias}?scan`
    const img = fetch(`/l/qr?text=${text}`)
        .then((res) => res.text())
        .then((url) => {
            qrcodeImg.src = url
        })

    // Add download button
    const span = document.createElement("span")
    span.className = "material-symbols-outlined"
    span.innerText = "download"

    const anchor = document.createElement("a")
    anchor.download = `${alias}-qrcode.png`
    anchor.href = qrcodeImg.src

    anchor.appendChild(span)

    qrcodeInfo.appendChild(anchor)

}