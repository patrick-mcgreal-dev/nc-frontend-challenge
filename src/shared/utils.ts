import { Renderer2 } from '@angular/core'

export function fitTextToWidth(
  renderer: Renderer2,
  textElement: HTMLElement | null,
  width: number,
  maxFontSize: number,
): void {
  if (!textElement) return

  let fontSize = 1
  renderer.setStyle(textElement, 'font-size', `${fontSize}px`)

  while (textElement.scrollWidth <= width && fontSize < maxFontSize) {
    fontSize += 1
    renderer.setStyle(textElement, 'font-size', `${fontSize}px`)
  }

  renderer.setStyle(textElement, 'font-size', `${fontSize - 1}px`)
}
