---
layout: post
title:  "Accordion"
date:   2017-11-28 09:29:03 -0500
categories: component
jsarr:
     - components/accordion/accordion.js
---

The accordion component follows the recommendations in [W3C's WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices/#accordion).

### Component
{% include components/accordion/accordion.html %}

### Functionality
If the focus is on an accordion tab:
- `Click`, `enter`, or `spacebar` open and close the related accordion panel.
- `Left` or `Up` arrows move focus to previous accordion tab.  If focus is on the first accordion tab, moves focus to the last accordion header.
- `Down` or `Right` arrows move focus to next accordion tab.  If focus is on the last accordion tab, moves focus to the first accordion header.
- `Tab` moves focus to next accordion tab (or the next focusable element within an open tab panel). If focus is on the last accordion tab, moves focus out of the accordion to the next focusable element on the page.
- `HOME` moves focus to first accordion tab.
- `END` moves focus to last accordion tab.

### Source code
{% include components/accordion/accordion_accordion.html %}



