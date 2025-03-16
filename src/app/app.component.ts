import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FrontendChallenge'

  eventTitle: string = ''
  eventDate: string = ''
  minEventDate: string = ''

  deltaTime = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  deltaIntervalId: any

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadEvent()
    this.setMinEventDate()
    this.setDeltaTime()
    this.deltaIntervalId = setInterval(() => {
      this.setDeltaTime()
    }, 500)

    window.addEventListener('resize', this.onResize.bind(this))
    this.cdr.detectChanges()
    this.onResize()
  }

  ngOnDestroy() {
    if (this.deltaIntervalId) {
      clearInterval(this.deltaIntervalId)
    }
    window.removeEventListener('resize', this.onResize.bind(this))
  }

  onResize() {
    const mainElement = this.el.nativeElement.querySelector('main')

    const mainStyles = window.getComputedStyle(mainElement)
    const mainWidth =
      mainElement.clientWidth -
      (parseFloat(mainStyles.paddingLeft) + parseFloat(mainStyles.paddingRight))

    const h1Element = this.el.nativeElement.querySelector('h1')
    this.setMaxFontSize(h1Element, mainWidth)

    const h2Element = this.el.nativeElement.querySelector('h2')
    this.setMaxFontSize(h2Element, mainWidth)
  }

  setMaxFontSize(element: HTMLElement, width: number) {
    let fontSize = 1
    this.renderer.setStyle(element, 'font-size', `${fontSize}px`)

    while (element.scrollWidth <= width && fontSize < 1000) {
      fontSize += 1
      this.renderer.setStyle(element, 'font-size', `${fontSize}px`)
    }

    this.renderer.setStyle(element, 'font-size', `${fontSize - 1}px`)
  }

  loadEvent() {
    const storedTitle = localStorage.getItem('eventTitle')
    const storedDate = localStorage.getItem('eventDate')
    if (storedTitle && storedDate) {
      this.eventTitle = storedTitle
      this.eventDate = storedDate
    } else {
      this.setDefaultEventDate()
    }
    this.cdr.detectChanges()
    this.onResize()
  }

  saveEvent() {
    localStorage.setItem('eventTitle', this.eventTitle)
    localStorage.setItem('eventDate', this.eventDate)
    this.cdr.detectChanges()
    this.onResize()
  }

  setDefaultEventDate() {
    const nextYear = new Date().getFullYear() + 1
    this.eventDate = new Date(nextYear, 0, 1).toISOString().split('T')[0]
    this.eventTitle = `New Year ${nextYear}`
  }

  setMinEventDate() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.minEventDate = tomorrow.toISOString().split('T')[0]
  }

  setDeltaTime() {
    let deltaSeconds = Math.abs(new Date(this.eventDate).getTime() - new Date().getTime()) / 1000

    this.deltaTime.days = Math.floor(deltaSeconds / 86400)
    deltaSeconds -= this.deltaTime.days * 86400

    this.deltaTime.hours = Math.floor(deltaSeconds / 3600) % 24
    deltaSeconds -= this.deltaTime.hours * 3600

    this.deltaTime.minutes = Math.floor(deltaSeconds / 60) % 60
    deltaSeconds -= this.deltaTime.minutes * 60

    this.deltaTime.seconds = Math.floor(deltaSeconds)
  }
}
