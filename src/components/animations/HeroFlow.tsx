'use client'
import { useEffect, useRef } from 'react'

// Thin white lines that drift/loop across the hero background and gently bend
// toward the pointer. Canvas-based, DPR-aware, self-cleaning. Honors
// prefers-reduced-motion (renders a single static line, no animation loop).
// Purely decorative: pointer-events none, sits behind the hero content.
export default function HeroFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Coarse pointer (phones/tablets) can't hover, so the lines react to scroll
    // instead: they lean in the scroll direction and settle back at rest.
    const touch = window.matchMedia('(pointer: coarse)').matches

    let width = 0
    let height = 0
    let dpr = 1
    // On narrow (phone) viewports the ribbons run top-to-bottom and drift
    // horizontally instead of left-to-right.
    let vertical = false
    // Pointer in CSS px relative to the canvas; null until the user moves it.
    const pointer = { x: 0, y: 0, active: false }
    // Eased pointer the lines actually follow, so motion stays smooth.
    const eased = { x: 0, y: 0, strength: 0 }

    const factor = 1.5;

    // Three drifting ribbons at different heights/speeds for a layered feel.
    const LINES = [
      { y: 0.32, amp: 0.05, len: 1.7, speed: 0.06 * factor, phase: 0.0, alpha: 0.16, w: 1 },
      { y: 0.52, amp: 0.07, len: 1.3, speed: -0.045 * factor, phase: 2.1, alpha: 0.1, w: 1 },
      { y: 0.7, amp: 0.045, len: 2.2, speed: 0.03 * factor, phase: 4.2, alpha: 0.07, w: 1 },
    ]

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      vertical = width < 768
    }

    function drawLine(line: (typeof LINES)[number], time: number) {
      // `main` is the travel axis (the line's length), `cross` is the drift
      // axis. Horizontal: main=x/width, cross=y/height. Vertical (phone):
      // main=y/height, cross=x/width.
      const mainLen = vertical ? height : width
      const crossLen = vertical ? width : height
      const base = line.y * crossLen
      const amp = line.amp * crossLen
      const k = (Math.PI * 2 * line.len) / mainLen
      const step = Math.max(6, mainLen / 120)
      const pointerMain = vertical ? eased.y : eased.x
      const pointerCross = vertical ? eased.x : eased.y

      ctx!.beginPath()
      for (let m = -step; m <= mainLen + step; m += step) {
        let c = base + Math.sin(m * k + time * line.speed + line.phase) * amp
        // Gentle local bend toward the eased pointer (gaussian falloff).
        if (eased.strength > 0.001) {
          const dm = m - pointerMain
          const falloff = Math.exp(-(dm * dm) / (2 * 150 * 150))
          const pull = (pointerCross - c) * 0.4 * falloff * eased.strength
          c += pull
        }
        const x = vertical ? c : m
        const y = vertical ? m : c
        if (m <= -step) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.strokeStyle = `rgba(242, 239, 232, ${line.alpha})`
      ctx!.lineWidth = line.w
      ctx!.stroke()
    }

    function renderStatic() {
      ctx!.clearRect(0, 0, width, height)
      LINES.forEach((line) => drawLine(line, 0))
    }

    let raf = 0
    let start = 0
    function frame(now: number) {
      if (!start) start = now
      const time = (now - start) / 1000
      // Ease the pointer influence in/out.
      const targetStrength = pointer.active ? 1 : 0
      eased.strength += (targetStrength - eased.strength) * 0.06
      eased.x += (pointer.x - eased.x) * 0.08
      eased.y += (pointer.y - eased.y) * 0.08

      ctx!.clearRect(0, 0, width, height)
      LINES.forEach((line) => drawLine(line, time))
      raf = requestAnimationFrame(frame)
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      if (!pointer.active) {
        // First move: snap the eased pointer so the bend doesn't fly in.
        eased.x = pointer.x
        eased.y = pointer.y
      }
      pointer.active = true
    }
    function onPointerLeave() {
      pointer.active = false
    }

    // Touch devices can't hover, and browsers cancel pointer events once a
    // scroll gesture starts — but touchmove keeps firing, so the lines can
    // follow the finger as it drags to scroll.
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0]
      if (!t) return
      const rect = canvas!.getBoundingClientRect()
      pointer.x = t.clientX - rect.left
      pointer.y = t.clientY - rect.top
      if (!pointer.active) {
        eased.x = pointer.x
        eased.y = pointer.y
      }
      pointer.active = true
    }
    function onTouchEnd() {
      pointer.active = false
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) renderStatic()
    })
    ro.observe(canvas)

    if (reduce) {
      renderStatic()
    } else if (touch) {
      // touchstart snaps the bend to the finger on contact; touchmove follows
      // it (fires on any movement, so slow scrolls keep reacting); touchend
      // releases. A held-still finger keeps its last bend until lift.
      window.addEventListener('touchstart', onTouchMove, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true })
      raf = requestAnimationFrame(frame)
      return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('touchstart', onTouchMove)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchcancel', onTouchEnd)
      }
    } else {
      const parent = canvas.parentElement || canvas
      parent.addEventListener('pointermove', onPointerMove)
      parent.addEventListener('pointerleave', onPointerLeave)
      raf = requestAnimationFrame(frame)
      return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        parent.removeEventListener('pointermove', onPointerMove)
        parent.removeEventListener('pointerleave', onPointerLeave)
      }
    }

    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
