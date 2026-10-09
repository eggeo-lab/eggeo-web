// Genera imágenes Open Graph 1200×630 (solo macOS). Lo invoca scripts/media/build-og.mjs.
// Uso: og <spec.json>  → [{ out, kind: "page"|"case", lines:[...], kicker, image?, bg, fg, accent }]
import Foundation
import AppKit
import CoreText

let args = CommandLine.arguments
let root = URL(fileURLWithPath: args[1]).deletingLastPathComponent()
let specs = try! JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: args[1]))) as! [[String: Any]]
let fontURL = URL(fileURLWithPath: args[2])
CTFontManagerRegisterFontsForURL(fontURL as CFURL, .process, nil)
let paths = try! String(contentsOfFile: args[3], encoding: .utf8)

func hex(_ s: String) -> CGColor {
  var v: UInt64 = 0; Scanner(string: String(s.dropFirst())).scanHexInt64(&v)
  return CGColor(red: CGFloat((v >> 16) & 255) / 255, green: CGFloat((v >> 8) & 255) / 255, blue: CGFloat(v & 255) / 255, alpha: 1)
}
func pathFrom(_ name: String) -> (CGPath, CGSize) {
  let r = try! NSRegularExpression(pattern: "\(name) = \\{ viewBox: \"0 0 ([\\d.]+) ([\\d.]+)\", d: \"([^\"]+)\"")
  let m = r.firstMatch(in: paths, range: NSRange(paths.startIndex..., in: paths))!
  let g = { (i: Int) in String(paths[Range(m.range(at: i), in: paths)!]) }
  let p = CGMutablePath()
  let sc = Scanner(string: g(3)); sc.charactersToBeSkipped = CharacterSet(charactersIn: " ")
  while !sc.isAtEnd {
    if let c = sc.scanCharacter() {
      if c == "Z" { p.closeSubpath(); continue }
      let x = sc.scanDouble()!, y = sc.scanDouble()!
      if c == "M" { p.move(to: CGPoint(x: x, y: y)) } else { p.addLine(to: CGPoint(x: x, y: y)) }
    }
  }
  return (p, CGSize(width: Double(g(1))!, height: Double(g(2))!))
}
let (wordmark, wSize) = pathFrom("WORDMARK")

func font(_ size: CGFloat, _ weight: CGFloat) -> CTFont {
  let base = CTFontCreateWithName("PlusJakartaSans-Regular" as CFString, size, nil)
  let axes = CTFontCopyVariationAxes(base) as? [[String: Any]]
  if let axis = axes?.first, let id = axis[kCTFontVariationAxisIdentifierKey as String] {
    let desc = CTFontDescriptorCreateCopyWithVariation(CTFontCopyFontDescriptor(base), id as! CFNumber, weight)
    return CTFontCreateWithFontDescriptor(desc, size, nil)
  }
  return base
}
func drawText(_ ctx: CGContext, _ s: String, _ f: CTFont, _ color: CGColor, _ x: CGFloat, _ y: CGFloat, kern: CGFloat = 0) {
  let attr = NSAttributedString(string: s, attributes: [kCTFontAttributeName as NSAttributedString.Key: f, kCTForegroundColorAttributeName as NSAttributedString.Key: color, kCTKernAttributeName as NSAttributedString.Key: kern])
  let line = CTLineCreateWithAttributedString(attr)
  ctx.textPosition = CGPoint(x: x, y: y); CTLineDraw(line, ctx)
}
func drawWordmark(_ ctx: CGContext, x: CGFloat, y: CGFloat, width: CGFloat, color: CGColor) {
  let s = width / wSize.width
  ctx.saveGState(); ctx.translateBy(x: x, y: y + wSize.height * s); ctx.scaleBy(x: s, y: -s)
  ctx.addPath(wordmark); ctx.setFillColor(color); ctx.fillPath(using: .evenOdd); ctx.restoreGState()
}

let W = 1200, H = 630
for spec in specs {
  let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  let bg = hex(spec["bg"] as! String), fg = hex(spec["fg"] as! String), accent = hex(spec["accent"] as! String)
  ctx.setFillColor(bg); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
  let lines = spec["lines"] as! [String]
  var textX: CGFloat = 72
  if let img = spec["image"] as? String, let ns = NSImage(contentsOfFile: root.appendingPathComponent(img).path) {
    var r = CGRect(origin: .zero, size: ns.size); let cg = ns.cgImage(forProposedRect: &r, context: nil, hints: nil)!
    let boxW: CGFloat = 520, boxH = CGFloat(H)
    let sc = max(boxW / CGFloat(cg.width), boxH / CGFloat(cg.height))
    let dw = CGFloat(cg.width) * sc, dh = CGFloat(cg.height) * sc
    ctx.saveGState(); ctx.clip(to: CGRect(x: CGFloat(W) - boxW, y: 0, width: boxW, height: boxH))
    ctx.draw(cg, in: CGRect(x: CGFloat(W) - boxW + (boxW - dw) / 2, y: (boxH - dh) / 2, width: dw, height: dh)); ctx.restoreGState()
    textX = 64
  }
  // Damero inferior
  let sq: CGFloat = 22
  for i in 0..<Int(CGFloat(W) / sq) + 1 { for r in 0..<2 where (i + r) % 2 == 0 {
    ctx.setFillColor(accent); ctx.fill(CGRect(x: CGFloat(i) * sq, y: CGFloat(r) * sq, width: sq, height: sq)) } }
  drawText(ctx, (spec["kicker"] as! String).uppercased(), font(22, 800), fg, textX, 520, kern: 3)
  let maxW: CGFloat = spec["image"] != nil ? 560 : 1050
  var size: CGFloat = lines.count > 2 ? 80 : 118
  for l in lines { while CTLineGetTypographicBounds(CTLineCreateWithAttributedString(NSAttributedString(string: l, attributes: [kCTFontAttributeName as NSAttributedString.Key: font(size, 800), kCTKernAttributeName as NSAttributedString.Key: -size * 0.025])), nil, nil, nil) > Double(maxW) { size -= 4 } }
  var y: CGFloat = 470 - size * 0.9
  for l in lines { drawText(ctx, l.replacingOccurrences(of: " ", with: "\u{2002}"), font(size, 800), fg, textX - 4, y, kern: -size * 0.025); y -= size * 0.9 }
  drawWordmark(ctx, x: textX, y: 72, width: 180, color: fg)
  let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
  let out = root.appendingPathComponent(spec["out"] as! String)
  try! FileManager.default.createDirectory(at: out.deletingLastPathComponent(), withIntermediateDirectories: true)
  try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!.write(to: out)
  print("og", spec["out"] as! String, Int(size))
}
