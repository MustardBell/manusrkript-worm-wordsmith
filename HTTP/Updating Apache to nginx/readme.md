
A web server is software that sends web pages to your browser over the HTTP protocol. Apache is the name of the current web server we're using, however we're looking to move to `nginx` as it's easier to configure, uses less memory and is faster. Updating to `nginx` is essential if you want to run a lot of concurrent HTTP connections.

To switch to `nginx` create the folder called 

~~~
.nginx
~~~

in the base of your home folder with an [FTP / SFTP client](https://www.feralhosting.com/faq/view?question=187). 

Or [using SSH](https://www.feralhosting.com/faq/view?question=12) run this command:

~~~
mkdir -p ~/.nginx
~~~

After **waiting 5 minutes** Apache will shut down and `nginx` will have been auto-configured to be very similar to Apache. It will attempt to:

- Configure PHP
- Serve domains from `~/www/*/public_html`
- Password protect rutorrent
- Set up an rtorrent SCGI rpc mount point at `/$username/RPC` (necessary for Transdroid)
- Deny access to areas of rutorrent which do not need web access
- Deny access to all files beginning with `.ht`
- Deny access to any folder with a `.htaccess` file at the time of auto-configuration

**Important note:** The SCGI rpc password will be the same as the rutorrent password, for your Feral username, at the time the update was initiated. See this FAQ for changing these passwords if you have forgotten them - [Password protect your WWW folder](https://www.feralhosting.com/faq/view?question=22)

Additional domain top-level configuration and domains can be updated by dropping (or editing) files in the directory: 

~~~
~/.nginx/conf.d
~~~

You should not need to do this if you just want to [add a domain](https://www.feralhosting.com/faq/view?question=52). 

Configuration for the default domain can be updated by adding (or editing) files in the folder 

~~~
~/.nginx/conf.d/000-default-server.d
~~~

**Important note:** You will need to restart `nginx` to apply configuration changes you make, once nginx has been loaded, for them to take effect.

If you run any custom configuration in Apache (found in the `.htaccess` files or the `~/.apache2/conf.d/` directory) then you should carefully review and apply this configuration to `nginx`. 

**Important note:** As a precaution any folder containing a `.htaccess` file will be denied access at the time of auto-configuration.

To review the configuration will need to consult the [Apache 2.2 documentation](http://httpd.apache.org/docs/2.2/index.html) and corresponding [nginx command](http://wiki.nginx.org/Main)

There exist tools to assist with the conversion if you [Google "nginx htaccess converter"](https://www.google.com/#q=nginx+htaccess+converter). The paths with a `.htaccess` are denied by the default server configuration in the files 

~~~
*-deny-htaccess.conf
~~~

Which can be removed once you've reviewed the set up.

**Reload your nginx.conf**

To reload the nginx conf file use this command for changes to take effect use this command:

~~~
/usr/sbin/nginx -s reload -c ~/.nginx/nginx.conf
~~~

You will see this:

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/HTTP/Updating%20Apache%20to%20nginx/nginx.png)

This is normal, your changes have been applied. You may need clear your browser cache for some changes to take effect.

**Kill the nginx process**

`nginx` can be killed and then automatically restarted by running the [SSH command](https://www.feralhosting.com/faq/view?question=12) 

~~~
killall -9 -u $(whoami) nginx php5-fpm
~~~

and then waiting up to 5 minutes for it to be restarted.

If nothing prevents nginx starting, like a bad .conf file, then running this command should show you the running processes.

~~~
ps x | grep nginx | grep -v grep
~~~

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/HTTP/Updating%20Apache%20to%20nginx/started.png)


**Notes:**

In regards to this particular action:

- Deny access to any folder with a `.htaccess` file at the time of auto-configuration

What will happen is that a numbered `deny.conf` will be created in the the `~/.nginx/conf.d/000-default-server.d` directory. This can break certain apps and will happen during the upgrade from Apache to nginx. An example of this is `_h5ai` if ti was present during before upgrading to nginx.



