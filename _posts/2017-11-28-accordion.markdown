---
layout: post
title:  "Accordion"
date:   2017-11-28 09:29:03 -0500
categories: [component, block]
jsarr:
     - components/accordion/accordion.js
---

The accordion component follows the recommendations in [W3C's WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices/#accordion).

## Component
{% include components/accordion/accordion.html %}

## What makes this component accessible?
### HTML Structure 
This component is structured as a term-description group, using the `dl`, `dt`, and `dd` tags. The `dl` tag wraps the entire accordion. Each `dt` element is an accordion section heading. The corresponding `dd` element is the hidden accordion panel for that heading. This markup is suggested for any group that "may be names and definitions, questions and answers, categories and topics, or any other groups of term-description pairs" [(WAI-ARIA)](https://www.w3.org/TR/html5/grouping-content.html#the-dl-element).  

### Screen Reader Support 
The accordion has a number of role and ARIA attributes to reveal structure and interaction to screen readers:
- The description list element `dl` has an attribute of `role='presentation'` to indicate that the use of this element type is for presentation purposes.
- The description term element `dt` acts as the heading for each accordion section, so it is given an attribute of `role='heading'`. This element is also given an `aria-level` attribute, with the heading level appropriate for the structure of the page. Our example is with a heading level of 3. 
- Inside each `dt` tag is a link which enables the heading to have keyboard focus. This `a` tag gets the attribute `role='button'`. In addition, it gets two ARIA attributes: 1) `aria-controls`, which defines its relationship to its corresponding panel by giving its ID as the value, and 2) `aria-expanded`, which describes whether its panel is expanded or not. The default value is `false`, and it gets set to `true` when the panel is opened. 
- The `dl` element has an attribute of `role='region'`. It also has two ARIA attributes: 1) `aria-labelledby`, which links this panel to its corresponding heading with its ID, and 2) `aria-hidden`, the default setting of which is `true`, and gets set to `false` when the panel is opened.

### Keyboard Support 
If the focus is on an accordion heading:
- `Click`, `enter`, or `spacebar` open and close the related accordion panel.
- `Left` or `Up` arrows move focus to previous accordion heading.  If focus is on the first accordion heading, moves focus to the last accordion header.
- `Down` or `Right` arrows move focus to next accordion heading.  If focus is on the last accordion heading, moves focus to the first accordion header.
- `Tab` moves focus to next accordion heading (or the next focusable element within an open panel). If focus is on the last accordion heading, moves focus out of the accordion to the next focusable element on the page.
- `HOME` moves focus to first accordion heading.
- `END` moves focus to last accordion heading.

## Source code
{% include components/accordion/accordion_accordion.html %}



