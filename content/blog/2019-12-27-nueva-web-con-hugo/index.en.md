---
title: 'New website with Hugo'
img: img/gohugoio.png
altImg: Hugo, static site generator
author: javi
type: post
date: 2019-12-27T12:04:01+01:00
tags:
  - hugo
  - tailwindcss
---

I have a new web with a **single purpose: create articles with content about things I am learning**. I have migrated the
old posts from my Wordpress blog. I always wanted to create a design for my blog from scratch and finally I did it!

In the next articles I am going to show some things I have learnt creating this website. First of all I had to choose
which tool to use for managing my personal website. I always thought in creating my own Wordpress theme but nowadays there
a lot of alternatives and I decided finally using a **Static Site Generator**.

{{< img src="img/hugo-logo.png" alt="Hugo" class="mx-auto" >}}

Searching on the Internet I found an open-source static site generator written in ***Go***: [Hugo][1]. I started testing
Hugo, I felt very comfortable and I decided Hugo was the tool I needed.

In order to work with hugo, first thing I did was [installing it][2] on my PC and following this [great guide for
creating a blog with Hugo from scratch][3]. Hugo is very flexible and allows us to do everything we can imagine, using
themes and [shortcodes][4] for syntax highlighting, embed content from popular services such as Youtube, Twitter, 
Instagram...

Working with a static site allows me using [Github][5] pages as hosting. When I want to deploy a new version I just need
to copy public folder into the repository, commit, push and the website is deployed automatically.

Finally, I had the decision of how I was going to organize the web layout. I could have developed everything on my own
with CSS or SASS, but I have been hearing about [Tailwind CSS][6], a CSS framework  that implements "utility first"
concept. After having worked with Bootstrap, I didn't want to start learning another framework but I decided to give it a
shot. First day I thought that HTML was very dirty with so many classes, but after a couple of days I decided it was
very useful and now I love it.

{{< img src="img/tailwindcss.png" alt="TailwindCSS" class="mx-auto" >}}

Tailwind is not a framework like Bootstrap, **you don´t have components** with a given markup. Tailwind provides 
**low-level utility classes** that let you build completely custom designs without ever leaving your HTML. You can focus
on creating, you don´t have to invert time in naming classes and you don´t repeat every time the same CSS properties
that make CSS files size growing without control.

Tailwind provides you with a set of possibilities to choose from, different text sizes, color palette, shadow, scale for
margins and paddings... And it is completely customizable, Tailwind is built with PostCSS and you can overwrite or
extend everything you want. Tailwind gives you a base on which can create your design system for a fully customized
website. Try it.

In my next articles I will show how I have configured Hugo, things I have learnt in which I spent a lot of time to get
resolved.

[1]: https://gohugo.io/
[2]: https://gohugo.io/getting-started/quick-start/
[3]: https://zwbetz.com/make-a-hugo-blog-from-scratch/
[4]: https://gohugo.io/content-management/shortcodes/
[5]: https://github.com
[6]: https://tailwindcss.com
