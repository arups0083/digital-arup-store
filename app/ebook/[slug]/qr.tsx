import QRCode from "qrcode";

export async function QRBlock({ upi, title, amount }: { upi: string; title: string; amount: number }) {
  // UPI URI format (basic)
  const uri = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent("Digital Arup")}&tn=${encodeURIComponent(title)}&am=${encodeURIComponent(String(Math.round(amount)))}&cu=INR`;
  const dataUrl = await QRCode.toDataURL(uri, { margin: 1, scale: 6 });

  return (
    <div className="flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="UPI QR" className="h-28 w-28 rounded-xl ring-1 ring-slate-200" />
      <div>
        <p className="text-xs font-semibold text-slate-500">Scan to pay</p>
        <p className="mt-1 text-sm text-slate-700">UPI app দিয়ে QR scan করে payment করুন।</p>
        <p className="mt-2 text-xs text-slate-500">Note: payment success হলে UTR কপি করে রাখুন।</p>
      </div>
    </div>
  );
}
