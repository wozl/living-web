FROM centos:centos7

MAINTAINER asdf1221

ENV  LANG="en_US.UTF-8"

RUN yum update -y
RUN yum install -y \
    gcc  \
    gcc-c++ \
    pcre \
    pcre-devel \
    yasm \
    zlib zlib-devel \
    make automake autoconf cmake \
    openssl openssl-devel \
    wget nano net-tools unzip 

RUN yum clean all
RUN mkdir -p /home/www
RUN wget -P /tmp/  https://nginx.org/download/nginx-1.20.1.tar.gz 
RUN wget -P /tmp/ http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
COPY nginx-http-flv-module /tmp/nginx-http-flv-module
COPY ffmpeg-4.1.tar.xz /tmp/
COPY mytvlive.zip /home/www/
RUN cd /home/www/ && unzip mytvlive.zip   && mv mytvlive /home/www/mytv && rm -f mytvlive.zip

WORKDIR /tmp/

RUN tar -zxvf nginx-1.20.1.tar.gz 
RUN tar -zxvf yasm-1.3.0.tar.gz
RUN tar xvJf ffmpeg-4.1.tar.xz

RUN cd /tmp/yasm-1.3.0 \
    && ./configure \
    && make && make install 

RUN cd /tmp/ffmpeg-4.1 \
    && ./configure --enable-shared --prefix=/usr/local/ffmpeg \
    && make && make install \
    && echo '/usr/local/ffmpeg/lib/'>>/etc/ld.so.conf \
    && ldconfig \
    && echo 'PATH=$PATH:/usr/local/ffmpeg/bin'>>/etc/profile \
    && echo 'export PATH'>>/etc/profile \
    && source /etc/profile

RUN useradd -M -s /sbin/nologin nginx && chown -R nginx:nginx  /home/www/
RUN cd /tmp/nginx-1.20.1  \
    && ./configure --prefix=/usr/local/nginx \ 
        --with-http_stub_status_module \ 
        --with-http_ssl_module \ 
        --with-stream \
        --add-module=/tmp/nginx-http-flv-module \
    && make && make install

COPY nginx.conf /usr/local/nginx/conf/
COPY live.conf /usr/local/nginx/conf/conf.d/
COPY livingServer   /home/www/livingServer

RUN /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
RUN ln -s /usr/local/nginx/sbin/*   /usr/local/sbin/

RUN rm -rf /tmp/*

EXPOSE 80 443

CMD ["/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf","-g","daemon off;"]