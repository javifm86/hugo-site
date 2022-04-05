---
title: Restore grub after installing Windows
date: 2021-11-25
author: javi
type: post
img: img/boot-repair-cover.jpg
altImg: Windows, Linux and Boot repair logos
tags:
    - windows
    - linux
---
In this article, we are going to cover how to restore grub after installing Windows. I had Windows 7 and Ubuntu on my laptop, so after a long time thinking in upgrading to Windows 10, finally, I decided to do it. It is a good practice when setting up a computer, installing Windows and thereafter Linux. This way, Linux will take care of configuring grub.

If you have to install Windows after Linux, Windows will remove grub, and you must restore it. Here are the steps for recovering grub in an easy way.

## Boot repair to the rescue
[Boot repair disk](https://sourceforge.net/projects/boot-repair-cd/files/) is a rescue tool that will help us in a very straightforward way to bring back grub. Just download the iso for your computer and burn it into a live USB with [Rufus](https://rufus.ie/en/). Reboot the system and make sure that USB source is on the top of the list for booting devices in your BIOS.

Once Boot repair is loaded, you can connect to internet in order to download the latest version, click on "Recommended repair" and reboot.

{{< img src="img/boot-repair.png" alt="Boot repair screen showing two buttons: \"Recommended repair\" and \"Create a BootInfo summary\"" >}}

That's it! When you reboot, you should see the screen for selecting which operative system you would like to run.
