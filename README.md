# NaturalCycles Frontend Challenge

The application is deployed [here](google.com).

## Running the application

1. `npm i`
2. `npm run start`

## Suggested improvements

### 1. Default values

Default values could be supplied for the `Title` and `Date` fields. These values should always refer
to an event in the future.

I've implemented this by defaulting to the next new year.

### 2. What happens when the timer ends?

Something should probably happen when the timer ends. A fanfare?

### 3. Dynamically adjusting font sizes breaks zooming

When zooming, the title and date remain the same size due to their fonts dynamically resizing. This
is not so good for visually-impaired users.

### 4. Screen size limitations

To avoid an infinite loop, the `setMaxFontSize(...)` function limits the font size to 1000px. It's a
pretty reasonable limit, but I suppose it has the potential to cause problems if the app is ever run
on a ridiculously large screen.

### 5. Font resizing when updating the event title

The title's font size gets bigger when clearing the `Title` field, since there are fewer characters
to fit to the screen width. Not particularly nice.
