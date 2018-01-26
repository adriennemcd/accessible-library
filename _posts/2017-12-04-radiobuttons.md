---
layout: post
title:  "Radio Buttons"
date:   2017-12-04 09:29:03 -0500
categories: [component, element]
parent: form
jsarr:
     - components/accordion/accordion.js
---

The radio button group component follows the recommendations in this [SitePoint article](https://www.sitepoint.com/replacing-radio-buttons-without-replacing-radio-buttons/). It leverages semantic HTML, the CSS pseudo-class `:checked`, and the CSS adjacent sibling combinator to get the job done without JavaScript.

## Component
{% include components/radio_button/radiobutton.html %}

## What makes this component accessible?
### HTML Structure 
A `fieldset` element is the wrapper for this component, which signals that it contains a group of related controls and labels, in this case radio buttons. Within the `fieldset` is a `legend`, which is the title for this group of controls. After the `legend` are the inputs with attribute `type="radio"`, along with their labels. Since we are using semantic, out-of-the-box HTML, there isn't a need for any JavaScript to make this component accessible. There are just a few requirements to make the radio buttons work properly:
- Each `input` should have a `name` attribute with the same value. This is what identifies them as a group.
- Each `input` should have a `value` attribute. When a form is submitted, this is the information that is sent to the server as the selected radio button.
- Each `input` should have an ID.
- Each `label` should have an attribute `for="{ID}"`, where `{ID}` refers to its input's ID. 

### Screen Reader Support 
Given this component's use of semantic HTML, screen readers are able to understand and describe its structure without the added help of role or ARIA attributes. For example, using VoiceOver on a Mac, when the first radio button in a group of three options is chosen either by mouse click or the arrow keys, the screen reader will say "Label 1, selected, radio button, 1 of 3". 

### Keyboard Support 
As the user navigates through the page using the `Tab` key:
- If no radio button is selected, `Tab` will focus on the first radio button. If the user is moving *up* the page, `Shift + Tab` will focus on the last radio button. 
- If a radio button is selected, `Tab` or `Shift + Tab` will focus on the selected button.  

Once the keyboard focus is on a radio button:
- The `Down` or `Right` arrow keys will move the selection to the next radio button.
- The `Up` or `Left` arrow keys will move the selection to the previous radio button.

## Source code
{% include components/radio_button/radio_accordion.html %}



