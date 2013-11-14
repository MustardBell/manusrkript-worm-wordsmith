
When you switch to a different type of slot, we will gladly transfer your files from the old server to the new one. Simply [raise a ticket](https://www.feralhosting.com/manager/tickets/new) to have this done for you (please title the ticket **Data Transfer Request**).

Everything will be copied over to the new server recursively. This includes your data, `.torrents`, and other files. Your directory structure will also be preserved.

As soon as your new slot is active, please use the [**Install Software** link in your Manager](https://www.feralhosting.com/manager/) to install software on the new server in preparation for completing the data transfer.

We will update the ticket as soon as the transfer is complete (you will also be automatically notified by email). Depending on the amount of data to transfer, it might take anywhere from a few hours to a couple of days.

When the transfer is complete you will find your files under your home directory `~/` on the new server in a folder named:

~~~
~/data-from-server
~~~

Where `server` in `data-from-server` is the name of your old server. For example:

~~~
~/data-from-aphrodite
~~~

What you will find below this directory is a complete mirror of your old slot with its directory structure preserved.

**Important note:** Your torrents will not be automatically seeding after the transfer on the new slot. You will need to:

**1:** Install a torrent client(s) using the [**Install Software** link in your Manager](https://www.feralhosting.com/manager/).

**2:** Move your data and `.torrents` to the right locations on the server.

There is a certain amount of risk involved in this operation in the sense that in some cases your torrent client will fail to locate the data for certain `.torrents` and will attempt to re-download from the tracker. Which is why we recommend:

**You throttle your torrent client's download speed to the lowest possible value (1 KB/s) before you move data and `.torrents`**

### rTorrent / ruTorrent

Rutorrent: throttle your download.

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/General/Completing%20a%20data%20transfer/rutorrent.png)

[SSH](https://www.feralhosting.com/faq/view?question=12) to your new server and execute the following commands in this particular order:

**Move the rTorrent Data**

The move command:

~~~
mv ~/data-from-server/private/rtorrent/data/* ~/private/rtorrent/data
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/private/rtorrent/data/. ~/private/rtorrent/data
~~~

Substitute `server` in `data-from-server` with the name of your old server.

**Move the the rTorrent .torrents**

The move command:

~~~
mv ~/data-from-server/private/rtorrent/work/*.torrent ~/private/rtorrent/watch
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/private/rtorrent/work/*.torrent ~/private/rtorrent/watch
~~~

Substitute `server` in `data-from-server` with the name of your old server.

### Deluge

Deluge: throttle your download.

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/General/Completing%20a%20data%20transfer/deluge.png)

[SSH](https://www.feralhosting.com/faq/view?question=12) to your new server and execute the following commands in this particular order:

**Move the Deluge Data**

The move command:

~~~
mv ~/data-from-server/private/deluge/data/* ~/private/deluge/data
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/private/deluge/data/. ~/private/deluge/data
~~~

Substitute `server` in `data-from-server` with the name of your old server.

**Move the the rTorrent .torrents**

The move command:

~~~
mv ~/data-from-server/.config/deluge/state/*.torrent ~/private/deluge/watch
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/.config/deluge/state/*.torrent ~/private/deluge/watch
~~~

Substitute `server` in `data-from-server` with the name of your old server.

### Transmission

Transmission: throttle your download.

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/General/Completing%20a%20data%20transfer/transmission 1.png)
![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/General/Completing%20a%20data%20transfer/transmission 2.png)

[SSH](https://www.feralhosting.com/faq/view?question=12) to your new server and execute the following commands in this particular order:

**Move the Transmission Data**

The move command:

~~~
mv ~/data-from-server/private/transmission/data/* ~/private/transmission/data
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/private/transmission/data/. ~/private/transmission/data
~~~

Substitute `server` in `data-from-server` with the name of your old server.

**Move the the Transmission .torrents**

The move command:

~~~
mv ~/data-from-server/.config/transmission-daemon/torrents/*.torrent ~/private/transmission/watch
~~~

Optional: The copy command if needed:

~~~
cp -rf ~/data-from-server/.config/transmission-daemon/torrents/*.torrent ~/private/transmission/watch
~~~

Substitute `server` in `data-from-server` with the name of your old server.

### Final Steps

After you are done moving your data and .torrents, your torrent client will re-hash the data and start seeding. Depending on the amount of data to re-hash, this might take some time.

Once all of your .torrents are seeding, do not forget to un-throttle your torrent client's download speed (set it back to **off/unlimited**).



