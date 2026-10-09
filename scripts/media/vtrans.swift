// Transcodificador H.264 para la web (solo macOS, usa AVFoundation).
// Uso: vtrans <in> <out.mp4> <maxDim> <kbps> <start> <dur|0> <audio 0|1> [posterOut.png] [posterAt]
// Lo invoca scripts/media/build-media.sh; no forma parte del build de Vite.
import Foundation
import AVFoundation
import AppKit
let a = CommandLine.arguments
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2])
let maxDim = CGFloat(Double(a[3])!), kbps = Int(a[4])!, start = Double(a[5])!, durArg = Double(a[6])!, keepAudio = a[7] == "1"
let posterOut = a.count > 8 ? a[8] : "", posterAt = a.count > 9 ? Double(a[9])! : 0.5
let asset = AVURLAsset(url: src)
let sem = DispatchSemaphore(value: 0)
var vTrack: AVAssetTrack!, aTrack: AVAssetTrack?
var assetDur = 0.0
Task {
  vTrack = try! await asset.loadTracks(withMediaType: .video).first!
  aTrack = try? await asset.loadTracks(withMediaType: .audio).first
  assetDur = CMTimeGetSeconds(try! await asset.load(.duration))
  sem.signal()
}
sem.wait()
let nat = vTrack.naturalSize, tf = vTrack.preferredTransform
let disp = nat.applying(tf); let dw = abs(disp.width), dh = abs(disp.height)
let scale = min(1, maxDim / max(dw, dh))
var ow = Int((dw * scale / 2).rounded()) * 2, oh = Int((dh * scale / 2).rounded()) * 2
let dur = durArg > 0 ? min(durArg, assetDur - start) : assetDur - start
let range = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), duration: CMTime(seconds: dur, preferredTimescale: 600))
try? FileManager.default.removeItem(at: dst)
let reader = try! AVAssetReader(asset: asset); reader.timeRange = range
let comp = AVMutableVideoComposition(propertiesOf: asset)
comp.renderSize = CGSize(width: ow, height: oh)
let ins = AVMutableVideoCompositionInstruction(); ins.timeRange = CMTimeRange(start: .zero, duration: CMTime(seconds: assetDur + 1, preferredTimescale: 600))
let li = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
var t = tf.concatenating(CGAffineTransform(scaleX: scale, y: scale))
let r = CGRect(origin: .zero, size: nat).applying(t); t = t.concatenating(CGAffineTransform(translationX: -r.minX, y: -r.minY))
li.setTransform(t, at: .zero); ins.layerInstructions = [li]; comp.instructions = [ins]
let vOut = AVAssetReaderVideoCompositionOutput(videoTracks: [vTrack], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
vOut.videoComposition = comp; reader.add(vOut)
var aOut: AVAssetReaderTrackOutput?
if keepAudio, let at = aTrack { aOut = AVAssetReaderTrackOutput(track: at, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM]); reader.add(aOut!) }
let writer = try! AVAssetWriter(outputURL: dst, fileType: .mp4); writer.shouldOptimizeForNetworkUse = true
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: ow, AVVideoHeightKey: oh,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 60]])
vIn.expectsMediaDataInRealTime = false; writer.add(vIn)
var aIn: AVAssetWriterInput?
if aOut != nil { aIn = AVAssetWriterInput(mediaType: .audio, outputSettings: [AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: 2, AVSampleRateKey: 44100, AVEncoderBitRateKey: 96000]); writer.add(aIn!) }
reader.startReading(); writer.startWriting(); writer.startSession(atSourceTime: range.start)
let g = DispatchGroup()
func pump(_ inp: AVAssetWriterInput, _ out: AVAssetReaderOutput, _ q: String) {
  g.enter()
  inp.requestMediaDataWhenReady(on: DispatchQueue(label: q)) {
    while inp.isReadyForMoreMediaData {
      if let sb = out.copyNextSampleBuffer() { inp.append(sb) } else { inp.markAsFinished(); g.leave(); return }
    }
  }
}
pump(vIn, vOut, "v"); if let ai = aIn, let ao = aOut { pump(ai, ao, "a") }
g.wait()
writer.finishWriting { sem.signal() }; sem.wait()
if writer.status != .completed { print("ERR", writer.error!); exit(1) }
let size = (try! FileManager.default.attributesOfItem(atPath: dst.path)[.size] as! Int)
print("ok \(dst.lastPathComponent) \(ow)x\(oh) \(String(format: "%.1f", dur))s \(size/1024)KB")
if !posterOut.isEmpty {
  let gen = AVAssetImageGenerator(asset: asset); gen.appliesPreferredTrackTransform = true
  gen.maximumSize = CGSize(width: ow, height: oh); gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
  let img = try! gen.copyCGImage(at: CMTime(seconds: start + posterAt, preferredTimescale: 600), actualTime: nil)
  let rep = NSBitmapImageRep(cgImage: img)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: posterOut))
  print("poster \(posterOut) \(img.width)x\(img.height)")
}
