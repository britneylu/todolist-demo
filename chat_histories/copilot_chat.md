User: Todo App — Requirements & User Stories
Baseline: TodoList.jsx (single-component React + Tailwind, useState, no external libraries). Supports add, toggle, delete, All/Active/Completed filters, remaining count.
Scope of this document: The next iteration of functionality beyond the baseline.

1. Functional Requirements
FR1 Edit todo inline: The user can edit the text of an existing todo in place. Double-clicking a todo enters edit mode; pressing Enter or moving focus away saves the change; pressing Escape cancels and restores the original text; saving empty text deletes the todo.

FR2 Set due date: The user can attach an optional due date to a todo, both when creating it and when editing it later. When a due date is set, it appears next to the todo text.

FR3 See overdue todos highlighted: The user sees a visual indicator on any active todo whose due date has passed. Completed todos never display the overdue indicator, even if their due date is in the past.

FR4 Set priority: The user can assign a priority of low, normal, or high to a todo, both at creation and afterward. A todo's priority is always visible in the list.

FR5 Sort visible todos: The user can sort the visible list by date added (default), by due date (earliest first, undated items last), or by priority (high → low).

FR6 Clear completed todos: The user can remove every completed todo in a single action. The action is unavailable when no todos are completed.

FR7 Persist todos across sessions: The user finds their todos — with text, completion state, due date, and priority intact — still present after closing and reopening the app.

FR8 Undo a delete: After the user deletes a todo, they see a toast for about 5 seconds with an Undo action. Activating Undo restores the todo to its previous position and state.

FR9 See filtered count: When the user applies the Active or Completed filter, they see both the visible count and the total (e.g., "3 of 7"). Under the All filter, they see only the remaining count.

2. Non-Functional Requirements
NFR1 Single-component architecture [Architecture]: All functionality lives in one React component using only useState and useEffect. No new runtime dependencies beyond React and Tailwind.
Measurement: Code review confirms a single default-exported component; package.json diff adds no runtime dependencies.

NFR2 Keyboard accessibility [Accessibility]: Every interactive element is reachable and operable via keyboard alone, with a visible focus indicator on each focusable element.
Measurement: Manual Tab-through reaches 100% of actions (add, toggle, edit, delete, filter, sort, clear-completed, undo). eslint-plugin-jsx-a11y passes with no errors.

NFR3 Screen-reader support [Accessibility]: Filter tabs expose their selected state (aria-pressed or equivalent). The toast region announces its content via aria-live="polite".
Measurement: VoiceOver/NVDA smoke test announces filter changes and toast appearance. Automated check asserts presence of the aria-live region.

NFR4 Keyboard shortcuts [Usability]: Enter in the add-input creates a todo. Enter saves an edit; Escape cancels. Cmd/Ctrl+Z triggers undo while the delete toast is visible.
Measurement: Each shortcut has a corresponding test case in the test suite.

NFR5 Stable row layout [Usability]: Hover-revealed controls (such as the delete button) must not change a row's height or shift neighboring rows.
Measurement: Visual check — each row's bounding box is identical with and without hover.

NFR6 Semantic testability [Quality]: All user-facing behavior is reachable in tests via role, label, or visible-text queries.
Measurement: No test file references data-testid or CSS class selectors. Enforced in code review.

NFR7 Aesthetic continuity [Design]: New UI (date picker, priority markers, toast, sort control) uses the existing editorial design language — same palette, typography, and spacing scale.
Measurement: Design review sign-off; no new color values or font families introduced outside existing tokens.

NFR8 Performance under load [Performance]: Input latency stays under 100 ms with up to 500 todos in the list.
Measurement: Manual profiling with 500 seeded todos; typing in the add-input shows no dropped frames in the React DevTools Profiler.

NFR9 Persistence robustness [Reliability]: A corrupt or unreadable localStorage payload does not crash the app; the app falls back to an empty list and overwrites storage on the next write.
Measurement: Test case injects malformed JSON into localStorage and asserts the app renders normally.

3. Epics & User Stories
Stories are sized so a small team can deliver a full epic inside a single 2-week sprint. Each story is independently shippable unless noted.

Epic A — Richer Todo Content
Goal: Let the user express more about each todo than just a line of text.

US-A1 As a user, I want to fix a typo in a todo in place, so that I don't have to delete and re-add it.
Covers: FR1, NFR4.
Acceptance: Double-click enters edit mode; Enter or blur saves; Escape restores the original; saving empty text deletes the todo.

US-A2 As a user, I want to attach a due date to a todo, so that I know when it needs to happen.
Covers: FR2.
Acceptance: Due date is optional at creation and editable later; appears next to the todo text when set.

US-A3 As a user, I want overdue items to stand out, so that I notice them before they pile up.
Covers: FR3.
Acceptance: Active todos with a past due date render with a distinct visual treatment; completed todos never do.

US-A4 As a user, I want to mark a todo as high or low priority, so that important items are obvious at a glance.
Covers: FR4.
Acceptance: Priority is settable at creation, editable later, and visible in the row.

Epic B — Organizing the List
Goal: Help the user make sense of a growing list.

US-B1 As a user, I want to sort by due date, so that I can work on what's due first.
Covers: FR5 (due-date sort).
Acceptance: Sort control offers "Due date"; undated items appear last.

US-B2 As a user, I want to sort by priority, so that high-priority items surface to the top.
Covers: FR5 (priority sort).
Acceptance: Sort control offers "Priority"; order is high → normal → low.

US-B3 As a user with a filter applied, I want to see how many items match the filter versus the total, so that I have context for what's hidden.
Covers: FR9.
Acceptance: Header shows "X of Y" under Active or Completed; shows "X remaining" under All.

US-B4 As a user, I want to clear all completed todos in one action, so that my list stays tidy.
Covers: FR6.
Acceptance: "Clear completed" control present; disabled when no todos are completed; one click removes all completed.

Epic C — Durability & Safety
Goal: Make the app trustworthy enough to rely on day-to-day.

US-C1 As a user, I want my list to still be there when I come back tomorrow, so that I don't have to re-enter it.
Covers: FR7, NFR9.
Acceptance: Todos persist across reload; corrupt storage does not crash the app.

US-C2 As a user, I want to undo a delete immediately after making it, so that I can recover a todo I removed by mistake.
Covers: FR8, NFR4.
Acceptance: Toast appears on delete for ~5 s with Undo; Undo restores the todo to its previous position and state; Cmd/Ctrl+Z triggers Undo while the toast is visible.

Epic D — Accessibility & Polish
Goal: Make the app usable by everyone and pleasant to return to.

US-D1 As a keyboard user, I want to navigate, edit, and undo without touching the mouse, so that I can work efficiently.
Covers: NFR2, NFR4.
Acceptance: All actions reachable via Tab and documented shortcuts; visible focus on every focusable element.

US-D2 As a screen-reader user, I want filter changes and deletion toasts to be announced, so that I know the UI state.
Covers: NFR3.
Acceptance: Filter tabs expose selected state; toast region is aria-live="polite".

US-D3 As a user, I want the new controls (date, priority, sort, toast) to feel like part of the same app, so that the design holds together.
Covers: NFR7.
Acceptance: Design review confirms no new fonts or palette colors; spacing and typography tokens are reused.



implement fr2 according to the requirements

GitHub Copilot: Optimizing tool selection...Inspecting the current app file and state to implement due-date support cleanly.

Read [](file:///Users/britneylu/Desktop/CS1530/todolist-demo/src/App.jsx)

Updating the todo state and UI to support optional due dates at creation and edit time.

Replacing 20 lines with 26 lines in [](file:///Users/britneylu/Desktop/CS1530/todolist-demo/src/App.jsx)


```

```
Checking edit/save flow and list rendering to wire due-date fields properly.

Read [](file:///Users/britneylu/Desktop/CS1530/todolist-demo/src/App.jsx#20-20), lines 20 to 191

Now wiring due-date state into edit/save logic and the row UI.

Replacing 97 lines with 134 lines in [](file:///Users/britneylu/Desktop/CS1530/todolist-demo/src/App.jsx)


```

```
Verifying the edited component structure and React syntax after the due-date changes.

Read [](file:///Users/britneylu/Desktop/CS1530/todolist-demo/src/App.jsx)

## Completed

Implemented FR2 in App.jsx:

- Added an optional due-date picker to the add-todo row
- Stored `dueDate` on new todos when set
- Added due-date editing support inside inline edit mode
- Rendered the due date next to the todo text when present

This keeps the app within the existing single-component React + Tailwind architecture and adds no new runtime dependencies.

Made changes.