# Completed gardener booking screen

## What will change
- Replace the current dental example with the Quality Green Gardening task shown in the reference.
- Present a clear completed outcome: Quality Green Gardening booked by phone for Friday at 3:00 PM, at 73 Nora St, Atherton, CA, for $450 with the gardener and one helper.
- Mark Call and Email as completed in the four-step execution bar; keep Retry and Message as skipped where unnecessary.
- Update the timeline to show the call, verbal confirmation, final-details email, and completion.
- Keep the existing expandable call recording, but give it realistic playback controls, waveform progress, and a transcript showing Asmi clearly confirming every requirement.
- Add an expandable email receipt to `contact@gglandscaping.info`, showing the subject, send time, and the exact final details sent to the gardener.
- Preserve the existing Asmi plum, cream, amber, typography, mobile shell, and responsive behavior.

## Technical details
- Extend the shared task data shape with optional confirmed-detail rows and an optional email record.
- Update the gardening mock task and its outcome, channel states, timeline, recording, and email content. The call transcript will clearly confirm Friday at 3:00 PM, $450, two workers total, and cleanup of dry pine needles, leaves, and debris from the brick pathways.
- Update the execution screen to render concise confirmed details and the expandable email panel using existing semantic design tokens.
- Keep all data mocked and frontend-only; no real call, audio file, or email will be sent.
- Verify the completed screen at desktop and mobile widths, including expansion controls and overflow.
