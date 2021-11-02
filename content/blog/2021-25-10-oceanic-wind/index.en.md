---
title: "Oceanic Wind for VSCode"
date: 2021-02-11
author: javi
type: post
img: img/oceanic-wind.png
altImg: Oceanic Wind theme for VSCode
tags:
    - vscode
    - theme
---
{{< img src="img/logo.png" alt="Oceanic Wind logo." >}}
I have created a VSCode dark theme called **Oceanic Wind**. Why did I do that? Well, I have been using Oceanic Next theme for many years ago, first time I used it with Sublime Text, and I wanted to tweak it.

It is based on color combinations from [Oceanic Next](https://github.com/voronianski/oceanic-next-color-scheme) replaced and customized with [Tailwind CSS color palette](https://tailwindcss.com/docs/customizing-colors).

I am a person who usually needs time to get used to changes, and, since I moved to VSCode, there were not many ports for the theme (nowadays there are much more), and I felt that which I was using didn't convince me at all. So, I decided creating my own theme with good contrast. 

When I started creating the theme I didn't know there were so many colors and possibilities to customize VSCode. I decided to customize every color I could find, in most cases I just changed the default color from VSCode with one picked from the Tailwind palette.

## Create your own theme

If you want to create your own theme you can follow [the steps from Visual Studio Code guide](https://code.visualstudio.com/api/extension-guides/color-theme#create-a-new-color-theme). This is what I did:

First, you have to install Yeoman extension generator and run it:

{{< img src="img/yo.png" alt="Yeoman generator options." >}}

{{< highlight shell >}}
npm install -g yo generator-code
yo code
{{< / highlight >}}

Select `New color theme` and `No, start fresh`. Give a name and identifier for your extension, and select a base theme to be used as starting point. Now you can open the folder with VSCode.

{{< highlight shell >}}
cd your-theme
code .
{{< / highlight >}}

If you want to test your theme, just press `F5` and a new window will be open where you will be able to see the result.

The [official documentation](https://code.visualstudio.com/api/references/theme-color) is the perfect starting point. As you can see, there are dozens of colors available, sometimes finding the color for a setting can be difficult despite the description, there are a few I couldn't find.

## Finding colors
Press `Ctrl + Shift + P` to get the command palette and type `Inspect Editor Tokens and Scopes`. Now you can click anywhere, and you will see a pop-up with color, font type and scope to target. You have also information about contrast ratio, **I always try getting 4.5 as minimum value**.

{{< img src="img/scopes.png" alt="VSCode scope information for selected node: language, standard token type, foreground, background, contrast ratio." >}}

VSCode has Developer tools you can use to inspect any information you want. Press `Ctrl + Shift + P` and type `Toggle Developer Tools` to open theme.

{{< img src="img/devtools.png" alt="VSCode devtools inspecting an element for getting the color." >}}

Very useful if you want to quickly find any color from any theme you are peeking for inspiration. I used this method at the beginning in order to find default VSCode colors, but there are some elements difficult to inspect as minimap.

Finally, I ended searching default colors in [VSCode Github repository](https://github.com/microsoft/vscode). Just search the setting name (without the dot), `activityBar inactiveForeground` for example, and dig into the different files.

I created a [gist with all dark default colors in VSCode](https://gist.github.com/javifm86/073d8e05942a8849dd11fa6996955fc0), some values are not 100% accurate because sometimes they use a `darken` or `lighten` function to get some colors, or they apply a transparency to a color that has already transparency, but you can save time if you need default colors, I couldn't find any reference with all the values.

## Accent color
You can overwrite colors for a given theme in VSCode settings. I have created a different set of colors to provide accent color to VSCode. If you would like to try another color instead of blue for the accent of your IDE, you can use these different combinations:

- [Indigo](https://github.com/javifm86/oceanic-wind/blob/main/customize/indigo.md)
- [Green](https://github.com/javifm86/oceanic-wind/blob/main/customize/green.md)
- [Rose](https://github.com/javifm86/oceanic-wind/blob/main/customize/rose.md)
- [Teal](https://github.com/javifm86/oceanic-wind/blob/main/customize/teal.md)
- [Fuchsia](https://github.com/javifm86/oceanic-wind/blob/main/customize/fuchsia.md)
- [Amber](https://github.com/javifm86/oceanic-wind/blob/main/customize/amber.md)
- [Esmerald](https://github.com/javifm86/oceanic-wind/blob/main/customize/esmerald.md)
- [Sky](https://github.com/javifm86/oceanic-wind/blob/main/customize/sky.md)

I tested the contrast ratio for the different accent colors and there should not be any big issue with contrast. I must review it because I didn't test it yet with **Warm** and **Cool** version of the theme.

## Creating with a defined color palette
Once I finished the theme, **I could easily generate numerous variations**. Just replacing the gray with the 5 different kind of grays from Tailwind, I can generate 40 different variations (8 accent colors x 5 kind of grays = 40). That is just a possibility, I decided going with neutral gray for the default, warm gray for the warm version and blue gray for the cool version.

I wanted to avoid polluting the theme selector on VSCode with 40+ variations, so I just left 3 versions with blue as accent color, and if anybody wants to customize further can copy/paste the setting from different accent colors. It's so easy generating different color schemes when you have a color palette!

## Testing
The default way of testing your theme can be insufficient for some cases. In these cases, I used this trick: You can just **copy your folder with you extension files into `.vscode` folder**. In Windows for example:
```
C:\Users\your-user\.vscode
```
This way you can enable locally your theme and test it in any workspace you want.

You can make changes in the theme folder, but be sure to **reload VSCode instance** to be able to see your changes (you can press `Ctrl + Shift + P` and type `Reload window`).

You can also go to your user settings, and overwrite colors for your theme to get instant feedback of the change. This is a big time saver!

## Conclusion
Once finished I just [followed the official guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to publish the theme.

I have tested this theme focused on my day-to-day workflow, with HTML, CSS, Javascript, Typescript and developing with frameworks such as Angular, Vue and React. Furthermore, I have tried with files you can find in [demo folder](https://github.com/javifm86/oceanic-wind/tree/main/demo) (thanks to [Wes Bos](https://twitter.com/wesbos) and [Sarah Drasner](https://twitter.com/sarah_edo)).

If you find something amiss, you have any suggestion or improvement, please feel free to open and [issue](https://github.com/javifm86/oceanic-wind/issues). I'm sure there are things I missed.

I am not a designer, so any help or feedback would be really appreciated.

* [Oceanic Wind at Marketplace](https://marketplace.visualstudio.com/items?itemName=javifm.oceanic-wind)
* [Github repository](https://github.com/javifm86/oceanic-wind)
* [Default dark colors on VSCode](https://gist.github.com/javifm86/073d8e05942a8849dd11fa6996955fc0)
