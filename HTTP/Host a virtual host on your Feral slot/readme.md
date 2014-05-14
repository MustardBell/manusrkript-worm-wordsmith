
The steps will similar for any other domain name provider. The DNS settings and tools may differ from place to place but the basic idea is the same anywhere you go.

**STEP 1:** Register Your Domain Name through a registrar.

The best option to it register a top level domain such a `.com` or `.co.uk` (depending on your region). If the privacy of domain registration is an issue that is something you must consider before linking your domain to your Feral account. Once you are in control of a valid domain proceed with the guide.

**STEP 2:** Obtain the IP of Your Feral Server to configure your DNS settings.

You need this IP of your Feral slot in order to configure the DNS settings/Records.

You can get this information using SSH. [SSH to your server](https://www.feralhosting.com/faq/view?question=12), and type:

~~~
hostname -i
~~~

or in IRC do, where `servername` is the name of your server:

~~~
$ip servername
~~~

For example:

~~~
$ip pontus
~~~

Take note of your server's IP address, as you will need in the next step.

**STEP 3:** Configure Your Domain Name using DNS settings:

The DNS settings of any domain are controlled by the host of the Name Servers. If you have changed the name servers at some point you must use their DNS manager to configure the DNS records. By default you names servers should be controlled by the registrar post registration.

**Important note:** Feral does not provide or manage name servers.

Optionally, for this FAQ I recommend using this DNS service: [http://rage4.com/](http://rage4.com/) - See this page for namerserver settings - [Nameservers](http://gbshouse.uservoice.com/knowledgebase/articles/107710-rage4-dns-frequently-asked-questions-faq-)

Your domain registrar or name server host will provide you with basic or advanced tools (a DNS records editor) to manage your DNS settings for each domain they are managing the name servers for. Find their DNS Settings Manager or similar and then we are going to two main records for this domain. The first is an `A` record for the main IP and the second will be a `cname` for the `www` version. Click on the domain name you'd like to configure, and then click the `Manage DNS` or similar options.

We are going to create two new records for our custom domain. 1: an `A` record linking to the server IP and 2: a `CNAME` to redirect the `www` subdomain to the main A record

**Important note:** Some hosting providers will automatically create a `CNAME` for your www version, such a GoDaddy. In this case you should only need to create Record 1, the `A` record. 

**Record 1 A record:** `example.co.uk` pointing to `123.123.123.123`

**Record 2 CNAME record:** `www.example.co.uk` pointing to `example.co.uk`

Here are the example records we use for the `example.co.uk` domain.

**Record 1 A record:**

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/HTTP/Host%20a%20virtual%20host%20on%20your%20Feral%20slot/1.png)

**Host**: `example.co.uk`

**TTL**: `1H` or `3600`

**Type**: `A`

**Value**: The IP of your Feral server

Add this new Record.

**Record 2 CNAME record:**

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/HTTP/Host%20a%20virtual%20host%20on%20your%20Feral%20slot/2.png)

**Host**: `www.example.co.uk`

**TTL**: `1H` or `3600`

**Type**: `CNAME`

**Value**: `example.co.uk`

Add this new Record.

**Important Note:** Activating domains can take up to 24 hours while the DNS propagates fully. This is beyond Feral's control and you should consider changing your DNS servers if your ISP is taking too long to acknowledge the changes.

[Google DNS](https://developers.google.com/speed/public-dns/)

[Comodo DNS](http://www.comodo.com/secure-dns/)

[OpenDNS](http://www.opendns.com/)

**STEP 4: Add it to the Server**

After you're done with the above steps, simply create a new folder with the same name as the domain inside the `~/www` directory on your slot. All slots have this directory in their root location.

**Folder name:** `example.co.uk`

So you will have something that looks like this:

![](https://raw.github.com/feralhosting/feralfilehosting/master/Feral%20Wiki/HTTP/Host%20a%20virtual%20host%20on%20your%20Feral%20slot/3.png)

It should be added almost immediately and when it is, another folder "public_html" should be created inside of each folder.

The final directory structure will look something like:

~~~
/media/12345/home/username/www/example.co.uk/public_html/
~~~

When you visit your domain's URL in a browser you will be seeing any files that are inside the `public_html` directory.

Now visit your website URL in a browser. You may need to clear your browser cache in some case to see the change.


nginx
---

If you have followed this FAQ - [Updating Apache to nginx](https://www.feralhosting.com/faq/view?question=231) then you will need to add your virtual hosts to nginx manually. Make sure you have pointed the DNS of your domain to the Feral server you want to host the domain on. Then follow this template:

Change example.com to your domain name in these examples:

~~~
mkdir -p ~/www/example.co.uk/public_html
mkdir -p ~/.nginx/proxy
echo 'www root' > ~/www/example.co.uk/public_html/index.html
~~~

Show full path to the root:

~~~
ls -d ~/www/example.co.uk/public_html
~~~

Add this to a new file on the  `~/.nginx/conf.d/` directory. For example: `example.conf`

**1:** `example.co.uk` to your custom domain 
**2:** `root` to the result of the ls command above
**3:** `proxy_temp_path` with your path info
**4:** `fastcgi_pass` with your path info

~~~
server {
    listen      8080;
    server_name example.co.uk;
    root        /media/DiskID/home/username/www/example.co.uk/public_html;
    index       index.html index.php;

    port_in_redirect off;
    proxy_temp_path  /media/DiskID/home/username/.nginx/proxy;

    autoindex            on;
    autoindex_exact_size off;
    autoindex_localtime  on;

    # Pass files that end in .php to PHP
    location ~ \.php$ {
        fastcgi_read_timeout 1h;
        fastcgi_send_timeout 10m;

        include      /etc/nginx/fastcgi_params;
        fastcgi_pass unix:/media/DiskID/home/username/.nginx/php/socket;
    }

    location / {
    }
}
~~~

Reload your nginx:

~~~
/usr/sbin/nginx -s reload -c ~/.nginx/nginx.conf
~~~

You should now be able to visit your domain in the browser and see the changes.

proxy_pass on a  custom domain:
---

Here is an example of a proxypass on your custom domain using nginx in the top level of your www.

**Important note:** Your app will be required to use the host `10.0.0.1` and not `localhost` or `127.0.0.1`.

~~~
    location / {    
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    rewrite /(.*) /$1 break;
    proxy_pass http://10.0.0.1:PORT/;
    proxy_redirect off;
    }
~~~



