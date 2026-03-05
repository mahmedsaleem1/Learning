1 . create a project
2. run it on multiple servers (multiple ports)
    example : $env:PORT=3000; node index.js
3. open nginx folder and go to sites-available
4. create a new file with your project name (test) : no extension
5. in that file do config like this 
    upstream backend {
        server 172.25.176.1:3001;
        server 172.25.176.1:3002;
        server 172.25.176.1:3003;
    } (3001, 3002, 3003) -> project servers
    172.25.176.1 -> windows host ip, may be different in WSL /other OS's

    server {
        listen 8080; (acutal nginx server)

        location / {
            proxy_pass http://backend;
        }
    }

6. enable it 
    sudo ln -s /etc/nginx/sites-available/test /etc/nginx/sites-enabled/

7. test it 
    sudo nginx -t

8. restart nginx 
    sudo systemctl restart nginx

9. run localhost:8080

10. refresh and u will see different servers(load balanced)