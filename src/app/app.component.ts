import { Component, Input } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrontendChallenge'

  @Input() eventTitle: string = 'Midsummer Eve'
  @Input() eventDate: Date = new Date(2025, 6, 21)

  minEventDate: string = ''
  deltaTime = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  deltaIntervalId: any

  ngOnInit() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.minEventDate = tomorrow.toISOString().split('T')[0]

    this.updateDeltaTime()
    this.deltaIntervalId = setInterval(() => {
      this.updateDeltaTime()
    }, 500)
  }

  updateDeltaTime() {
    // https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates

    let deltaSeconds = Math.abs(new Date(this.eventDate).getTime() - new Date().getTime()) / 1000

    // calculate whole days, removing the remainder
    this.deltaTime.days = Math.floor(deltaSeconds / 86400)
    deltaSeconds -= this.deltaTime.days * 86400

    // calculate whole hours, removing the remainder
    this.deltaTime.hours = Math.floor(deltaSeconds / 3600) % 24
    deltaSeconds -= this.deltaTime.hours * 3600

    // calculate whole minutes, removing the remainder
    this.deltaTime.minutes = Math.floor(deltaSeconds / 60) % 60
    deltaSeconds -= this.deltaTime.minutes * 60

    // remaining time in seconds
    this.deltaTime.seconds = Math.floor(deltaSeconds)
  }
}
