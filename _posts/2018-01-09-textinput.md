---
layout: post
title:  "Text Input"
date:   2018-01-09 09:29:03 -0500
categories: [component, element]
parent: form
jsarr:
     - components/accordion/accordion.js
---

The text input is a very simple component that doesn't require a lot to make it accessible to screen readers and keyboards.

## Component
{% include components/text_input/textinput.html %}

## What makes this component accessible?
### HTML Structure 
This component utilizes semantic html, which means that screen readers and keyboards can access its information easily. There are just a few requirements to make the input with `type="text"` work properly:
- The `input` element should have a `name` attribute. When a form is submitted, this info is sent to the server along with the user input as a key/value pair.
- The `input` should have an ID.
- The `label` should have an attribute `for="{ID}"`, where `{ID}` refers to its input's ID. 

### Screen Reader Support 
Given this component's use of semantic HTML, screen readers are able to understand and describe its structure without the added help of ARIA roles or attributes. For example, using VoiceOver on a Mac, when the reader initially focuses on the input in our example, the screen reader will say "Describe your favorite food, edit text".

### Keyboard Support 
If the focus is on the input element:
- The user is able to type text into the field.  

## Source code
{% include components/text_input/textinput_accordion.html %}



