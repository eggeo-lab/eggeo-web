// Recorta el margen transparente de un PNG y lo exporta a una altura fija (solo macOS).
// Uso: trim <in.png> <out.png> <alto>
import Foundation
import AppKit

let a = CommandLine.arguments
let img = NSImage(contentsOfFile: a[1])!
var r = CGRect(origin: .zero, size: img.size)
let cg = img.cgImage(forProposedRect: &r, context: nil, hints: nil)!
let w = cg.width, h = cg.height
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
let px = ctx.data!.bindMemory(to: UInt8.self, capacity: w * h * 4)
var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h { for x in 0..<w where px[(y * w + x) * 4 + 3] > 12 {
  minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) } }
let crop = CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
let trimmed = ctx.makeImage()!.cropping(to: crop)!
let th = Int(a[3])!, tw = Int((Double(trimmed.width) * Double(th) / Double(trimmed.height)).rounded())
let out = CGContext(data: nil, width: tw, height: th, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
out.interpolationQuality = .high
out.draw(trimmed, in: CGRect(x: 0, y: 0, width: tw, height: th))
try! NSBitmapImageRep(cgImage: out.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print("\(tw)x\(th)")
