import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'

const MAX_FONT_SIZE = 1000
const SECONDS_PER_DAY = 86400
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_MINUTE = 60

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
  private deltaIntervalId: ReturnType<typeof setInterval> | null = null

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEvent()
    this.setMinEventDate()
    this.setDeltaTime()
    this.startDeltaInterval()
    this.cdr.detectChanges()
    this.onResize()
  }

  ngOnDestroy(): void {
    this.clearDeltaInterval()
  }

  @HostListener('window:resize')
  onResize(): void {
    const mainElement = this.el.nativeElement.querySelector('main') as HTMLElement | null
    if (!mainElement) return

    const mainStyles = window.getComputedStyle(mainElement)
    const mainWidth =
      mainElement.clientWidth -
      (parseFloat(mainStyles.paddingLeft) + parseFloat(mainStyles.paddingRight))

    this.adjustFontSize('h1', mainWidth)
    this.adjustFontSize('h2', mainWidth)
  }

  private adjustFontSize(selector: string, width: number): void {
    const element = this.el.nativeElement.querySelector(selector) as HTMLElement | null
    if (!element) return

    let fontSize = 1
    this.renderer.setStyle(element, 'font-size', `${fontSize}px`)

    while (element.scrollWidth <= width && fontSize < MAX_FONT_SIZE) {
      fontSize += 1
      this.renderer.setStyle(element, 'font-size', `${fontSize}px`)
    }

    this.renderer.setStyle(element, 'font-size', `${fontSize - 1}px`)
  }

  private loadEvent(): void {
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

  saveEvent(): void {
    localStorage.setItem('eventTitle', this.eventTitle)
    localStorage.setItem('eventDate', this.eventDate)
    this.cdr.detectChanges()
    this.onResize()
  }

  private setDefaultEventDate(): void {
    const nextYear = new Date().getFullYear() + 1
    this.eventDate = new Date(nextYear, 0, 1).toISOString().split('T')[0]
    this.eventTitle = `New Year ${nextYear}`
  }

  private setMinEventDate(): void {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.minEventDate = tomorrow.toISOString().split('T')[0]
  }

  protected setDeltaTime(): void {
    const deltaSeconds = Math.abs(new Date(this.eventDate).getTime() - new Date().getTime()) / 1000

    this.deltaTime.days = Math.floor(deltaSeconds / SECONDS_PER_DAY)
    const remainingSecondsAfterDays = deltaSeconds % SECONDS_PER_DAY

    this.deltaTime.hours = Math.floor(remainingSecondsAfterDays / SECONDS_PER_HOUR)
    const remainingSecondsAfterHours = remainingSecondsAfterDays % SECONDS_PER_HOUR

    this.deltaTime.minutes = Math.floor(remainingSecondsAfterHours / SECONDS_PER_MINUTE)
    this.deltaTime.seconds = Math.floor(remainingSecondsAfterHours % SECONDS_PER_MINUTE)
  }

  private startDeltaInterval(): void {
    this.deltaIntervalId = setInterval(() => {
      this.setDeltaTime()
    }, 500)
  }

  private clearDeltaInterval(): void {
    if (this.deltaIntervalId) {
      clearInterval(this.deltaIntervalId)
      this.deltaIntervalId = null
    }
  }
}
