# Susie's Choir Room

A lightweight choir rehearsal app for score analysis, part-by-part audio demos, rhythm practice, and tempo adjustment.

## First Version

- Import a MusicXML score (`.musicxml` or `.xml`)
- Import MIDI scores (`.mid` or `.midi`)
- Preview PDF scores (`.pdf`) in the app
- Analyze title, key, time signature, tempo, parts, ranges, and likely voice types
- Render an in-app practice score with measures, pitch labels, rests, and rhythm markers
- Play generated audio demos for individual parts or the whole choir
- Use a lightweight built-in choir-style Ah synth for generated demos
- Practice rhythm with click and note-attack cues
- Sync audio and rhythm demos with a highlighted score cursor
- Bind an MP3/WAV demo recording to a selected part and play it with the score cursor
- Adjust playback speed in the browser
- Export the loaded score as MIDI
- Save rehearsal notes locally in the browser

## Use

Open `index.html` in a browser, or publish the repository with GitHub Pages.

The audio is synthesized by the browser for practice reference. It is not a real vocal recording.

MP3 export is intentionally not included in the first browser-only version. Use MIDI export for notation and synth workflows, or bind exported MP3/WAV demos per part for realistic rehearsal audio.

## Optional Local SoundFont

This workspace also includes a lightweight local SoundFont for MIDI workflows:

`soundfonts/FluidR3Mono_GM.sf3`

It is not required for the browser app to run. The browser app uses its built-in choir-style synth unless you bind real MP3/WAV demos.
