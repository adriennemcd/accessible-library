---
layout: post
title:  "Checkboxes"
date:   2017-12-19 09:29:03 -0500
categories: component
jsarr:
     - components/accordion/accordion.js
---

The checkbox group component follows the recommendations in this [SitePoint article](https://www.sitepoint.com/replacing-radio-buttons-without-replacing-radio-buttons/). While the article is for radio buttons, the pattern can be used for checkboxes, too. It leverages semantic HTML, the CSS pseudo-class `:checked`, and the CSS adjacent sibling combinator to get the job done without JavaScript.

## Component
{% include components/checkbox/checkbox.html %}

## What makes this component accessible?
### HTML Structure 
A `fieldset` element is the wrapper for this component, which signals that it contains a group of related controls and labels, in this case checkboxes. Within the `fieldset` is a `legend`, which is the title for this group of controls. After the `legend` are the inputs with attribute `type="checkbox"`, along with their labels. Since we are using semantic, out-of-the-box HTML, there isn't a need for any JavaScript to make this component accessible. There are just a few requirements to make the checkboxes work properly:
- Each `input` should have a `name` attribute. When a form is submitted, this is info sent to the server along with the `value` attribute as a key/value pair.
- Each `input` should have a `value` attribute. The default value for this attribute is `on`. So if this attribute is omitted, the server will be sent a key/value pair like `name=on`, for example.
- Each `input` should have an ID.
- Each `label` should have an attribute `for="{ID}"`, where `{ID}` refers to its input's ID. 

### Screen Reader Support 
Given this component's use of semantic HTML, screen readers are able to understand and describe its structure without the added help of role or ARIA attributes. For example, using VoiceOver on a Mac, when the first checkbox is chosen either by mouse click or spacebar, the screen reader will say "Label 1, checked, checkbox". 

### Keyboard Support 
As the user navigates through the page using the `Tab` key:
- `Tab` will move focus through the checkboxes from first to last. If the user is moving *up* the page, `Shift + Tab` will move focus through the checkboxes from last to first.  

Once the keyboard focus is on a checkbox:
- `Spacebar` will check and uncheck the focused checkbox.

## Source code
{% include components/checkbox/checkbox_accordion.html %}



