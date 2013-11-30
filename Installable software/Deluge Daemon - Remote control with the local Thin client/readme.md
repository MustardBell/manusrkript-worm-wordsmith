
This FAQ requires you have already installed Deluge using the [**Install Software** link in your Manager](https://www.feralhosting.com/manager/) link in the manager for your slot.

A Web Gui is great, but nothing compares to the cold hard configurable application. And deluge allows you to have the best of both worlds. 

To be able to connect your local deluge client to your remote daemon and interact with it as if it were running locally is easy and just takes a few steps.

In SSH do these commands. Use this FAQ if you do not know how to SSH into your slot: [SSH basics - Putty](https://www.feralhosting.com/faq/view?question=12)

This bash script will do the following things for you.:

**1:** Print your hostname and daemon port 
**2:** Print your username and password
**3:** Enable remote access
**4:** Kill deluge and the Web Gui 
**5:** Restart deluge and the Web Gui

You will then be able to connect to deluge using the thin client with the information printed by the script.

~~~
wget -qO ~/delugethin.sh http://git.io/obe0mA && bash ~/delugethin.sh
~~~

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/Installable%20software/Deluge%20Daemon%20-%20Remote%20control%20with%20the%20local%20Thin%20client/script.png)

### Manual Installation Steps:

**Step 1:** Gather Server Information

You need to know some settings and passwords on the server first. To do this, [SSH](http://www.feralhosting.com/faq/view?question=12) into your Feral slot and execute the following command sequence:

Get your username:

~~~
echo $(whoami)
~~~

Which will return something like:

~~~
username
~~~

Get the daemon port:

~~~
cat ~/.config/deluge/core.conf | grep daemon_port
~~~

This will return something along the lines of:

~~~
"daemon_port": 23456
~~~

Write down the port that is returned, which for this example is `23456`.

**Important Note:** If you already use Deluge via the WebUI, the daemon port is also stored in the daemon info found
inside the `Preferences` menu.

To get your access password, run the following command:

~~~
cat ~/.config/deluge/auth | grep $(whoami) | cut -d\: -f2
~~~

This should return something like the following:

~~~
dgeyh47563483HDgr
~~~

This is the password you will need to connect the thin client to the remote daemon.

**Important Note:** This password is **NOT** the same as your WebUi password listed on your Slot Detail page. They are different passwords.

**Step 2:** Allow Remote Connections to the Daemon

**2.1:** Log into your Deluge Web Gui, go to `Preferences` and set `Allow remote connections` to `Yes`;

**2.2:** [Restarting - rtorrent - Deluge - Transmission - MySQL](https://www.feralhosting.com/faq/view?question=158) — this is absolutely necessary; please follow the link for instructions.

**Step 3:** Local Client (Thin Client) Set-up

Download [deluge](http://dev.deluge-torrent.org/wiki/Download) (make sure the version matches the daemon version running on the server — currently v1.3.6).

Install and run deluge.

Go to `Preferences -> Interface` and untick `Enable` under `Classic Mode`.

**Step 4:** Restart deluge. 

You should now see a connection manager box pop up.

Remove the localhost daemon

Click `Add` and enter the address of your Feral server, for example: `athena.feralhosting.com` found on your [Slot Detail](https://www.feralhosting.com/manager/) page for the relevant slot.

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/0%20Generic/slot_detail_link.png)

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/0%20Generic/slot_detail_ssh.png)

Set the port to the port you got in Step 1. Enter the username and password you got from Step 1, in our case `username` and `dgeyh47563483HDgr`

Click `Add` to add your server's daemon — you should now see a green icon as the status for the host you just added

**Optional:** 

Expand `Options` and select `Automatically connect to selected host on startup` and `Do not show this dialogue on start-up`
Click `Connect`, and the connection manager pop up box should disappear. You should find deluge is now functioning as a local client while manipulating the remote deluge daemon on your Feral slot

To see more information regarding running deluge as a Thin Client visit [http://dev.deluge-torrent.org/wiki/UserGuide/ThinClient](http://dev.deluge-torrent.org/wiki/UserGuide/ThinClient).



