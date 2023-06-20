const alias = document.getElementById("alias").textContent

const qrcodeImg = document.getElementById("qrcode-img")
const qrcodeInfo = document.getElementById("qrcode-info")

const copyBtn = document.getElementById("copy") 
const copyContent = document.getElementById("copy-content")

if (qrcodeImg) {
    const text = `${location.origin}/${alias}?scan`
    const img = fetch(`/l/qr?text=${text}`)
        .then((res) => res.text())
        .then((url) => {
            qrcodeImg.src = url
            
            // Add download button
            const span = document.createElement("span")
            span.className = "material-symbols-outlined"
            span.innerText = "download"

            const anchor = document.createElement("a")
            anchor.download = `${alias}-qrcode.png`
            anchor.href = url
            anchor.title = "Download QR Code"

            anchor.appendChild(span)

            qrcodeInfo.appendChild(anchor)
        })

}

copyBtn.addEventListener("click", (ev) => {
    
})



